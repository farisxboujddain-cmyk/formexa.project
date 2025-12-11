const express = require('express');
const router = express.Router();
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { authenticateJWT } = require('../middleware/auth');

// Plan pricing (in dollars)
const PLANS = {
  free: { monthly: 0, yearly: 0 },
  pro: { monthly: 9.99, yearly: 99.90 },
  business: { monthly: 29.99, yearly: 299.90 }
};

// Get PayPal access token
const getPayPalAccessToken = async () => {
  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const response = await axios.post(
      'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Failed to get PayPal access token:', error.message);
    throw error;
  }
};

// Create subscription
router.post(
  '/create-subscription',
  authenticateJWT,
  [
    body('plan').isIn(['free', 'pro', 'business']),
    body('billingCycle').isIn(['monthly', 'yearly'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { plan, billingCycle } = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Free plan doesn't need PayPal
      if (plan === 'free') {
        user.subscriptionPlan = 'free';
        user.subscriptionStatus = 'active';
        await user.save();

        return res.json({
          message: 'Upgraded to free plan',
          plan: 'free',
          redirectUrl: null // No PayPal redirect needed
        });
      }

      const price = PLANS[plan][billingCycle];
      const frequency = billingCycle === 'monthly' ? 'MONTH' : 'YEAR';

      // Create PayPal subscription plan (simplified)
      // In production, you'd create a product and plan first
      const subscriptionPayload = {
        plan_id: `PLAN-${plan.toUpperCase()}-${billingCycle.toUpperCase()}`,
        subscriber: {
          name: {
            given_name: user.name.split(' ')[0],
            surname: user.name.split(' ')[1] || ''
          },
          email_address: user.email
        },
        application_context: {
          brand_name: 'Formexa',
          locale: user.language || 'en-US',
          user_action: 'SUBSCRIBE_NOW',
          return_url: `${process.env.FRONTEND_URL}/dashboard?subscription=success`,
          cancel_url: `${process.env.FRONTEND_URL}/pricing?subscription=cancelled`
        }
      };

      // In production, call PayPal API to create actual subscription
      // For now, return a mock PayPal approval URL
      const approvalUrl = `https://sandbox.paypal.com/checkoutnow?token=EC-MOCK${Date.now()}`;

      // Store subscription request temporarily
      const subscription = new Subscription({
        userId: user._id,
        plan,
        billingCycle,
        status: 'pending',
        price
      });
      await subscription.save();

      res.json({
        message: 'Subscription initialized',
        plan,
        billingCycle,
        price,
        redirectUrl: approvalUrl,
        subscriptionId: subscription._id
      });
    } catch (error) {
      console.error('Create subscription error:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Handle PayPal webhook
router.post('/webhook', async (req, res) => {
  try {
    const event = req.body;
    const eventType = event.event_type;

    console.log(`[PayPal Webhook] Received ${eventType}`);

    // Verify webhook signature (in production)
    // const isValid = await verifyPayPalWebhook(req);
    // if (!isValid) return res.status(403).json({ error: 'Invalid signature' });

    switch (eventType) {
      case 'BILLING.SUBSCRIPTION.CREATED':
        await handleSubscriptionCreated(event);
        break;
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        await handleSubscriptionActivated(event);
        break;
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        await handleSubscriptionCancelled(event);
        break;
      case 'PAYMENT.SALE.DENIED':
        await handlePaymentDenied(event);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle subscription created
const handleSubscriptionCreated = async (event) => {
  const subscriptionId = event.resource?.id;
  const customerId = event.resource?.subscriber?.email_address;

  const user = await User.findOne({ email: customerId });
  if (user) {
    const subscription = await Subscription.findOne({ userId: user._id });
    if (subscription) {
      subscription.paypalSubscriptionId = subscriptionId;
      subscription.status = 'active';
      subscription.startDate = new Date();
      subscription.events.push({
        type: 'CREATED',
        details: event.resource
      });
      await subscription.save();
    }
  }
};

// Handle subscription activated
const handleSubscriptionActivated = async (event) => {
  const subscriptionId = event.resource?.id;

  const subscription = await Subscription.findOne({
    paypalSubscriptionId: subscriptionId
  });
  if (subscription) {
    subscription.status = 'active';
    subscription.renewalDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    subscription.events.push({
      type: 'ACTIVATED',
      details: event.resource
    });
    await subscription.save();

    // Update user
    await User.findByIdAndUpdate(subscription.userId, {
      subscriptionStatus: 'active',
      subscriptionPlan: subscription.plan,
      paypalSubscriptionId: subscriptionId
    });
  }
};

// Handle subscription cancelled
const handleSubscriptionCancelled = async (event) => {
  const subscriptionId = event.resource?.id;

  const subscription = await Subscription.findOne({
    paypalSubscriptionId: subscriptionId
  });
  if (subscription) {
    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    subscription.events.push({
      type: 'CANCELLED',
      details: event.resource
    });
    await subscription.save();

    // Downgrade user to free plan
    await User.findByIdAndUpdate(subscription.userId, {
      subscriptionStatus: 'cancelled',
      subscriptionPlan: 'free'
    });
  }
};

// Handle payment denied
const handlePaymentDenied = async (event) => {
  const saleId = event.resource?.id;
  console.warn(`[PayPal] Payment denied: ${saleId}`);

  // Optionally suspend user subscription
};

// Get subscription status
router.get('/status', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const subscription = await Subscription.findOne({ userId: user._id });

    res.json({
      plan: user.subscriptionPlan,
      status: user.subscriptionStatus,
      billingCycle: user.billingCycle || 'monthly',
      renewalDate: subscription?.renewalDate,
      subscriptionStartDate: user.subscriptionStartDate,
      usage: user.usage,
      limits: user.getSubscriptionLimits()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel subscription
router.post('/cancel', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const subscription = await Subscription.findOne({ userId: user._id });

    if (!subscription || subscription.status !== 'active') {
      return res.status(400).json({ error: 'No active subscription to cancel' });
    }

    // In production, call PayPal API to cancel subscription
    // subscription.paypalSubscriptionId is the ID to use

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    await subscription.save();

    user.subscriptionStatus = 'cancelled';
    user.subscriptionPlan = 'free';
    await user.save();

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
