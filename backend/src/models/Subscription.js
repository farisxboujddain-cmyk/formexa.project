const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    plan: {
      type: String,
      enum: ['free', 'pro', 'business'],
      default: 'free'
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly'
    },
    paypalSubscriptionId: { type: String, unique: true, sparse: true },
    paypalCustomerId: { type: String },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'pending', 'suspended'],
      default: 'inactive'
    },
    startDate: { type: Date },
    endDate: { type: Date },
    renewalDate: { type: Date },
    price: { type: Number }, // in dollars
    currency: { type: String, default: 'USD' },
    autoRenew: { type: Boolean, default: true },
    paymentMethod: {
      type: String,
      enum: ['paypal', 'credit_card', 'bank_transfer'],
      default: 'paypal'
    },
    cancellationReason: { type: String },
    cancelledAt: { type: Date },
    failedPayments: { type: Number, default: 0 },
    lastPaymentDate: { type: Date },
    nextPaymentDate: { type: Date },
    events: [
      {
        type: { type: String }, // CREATED, ACTIVATED, CANCELLED, etc.
        timestamp: { type: Date, default: Date.now },
        details: mongoose.Schema.Types.Mixed
      }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ paypalSubscriptionId: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
