import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { paypalAPI } from '../services/api'
import { useAuthStore, useSubscriptionStore } from '../store'
import '../styles/pricing.css'

const PricingPage = () => {
  const { t } = useTranslation()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const setSubscription = useSubscriptionStore((state) => state.setSubscription)
  const [billingCycle, setBillingCycle] = React.useState('monthly')
  const [loading, setLoading] = React.useState(false)

  const handleSelectPlan = async (plan) => {
    if (!isLoggedIn) {
      window.location.href = '/login'
      return
    }

    if (plan === 'free') {
      // Free plan doesn't need PayPal
      try {
        setLoading(true)
        const response = await paypalAPI.createSubscription('free', 'monthly')
        setSubscription({ plan: 'free', status: 'active' })
        window.location.href = '/dashboard'
      } catch (error) {
        alert('Failed to upgrade: ' + error.message)
      } finally {
        setLoading(false)
      }
      return
    }

    // Paid plans - redirect to PayPal
    try {
      setLoading(true)
      const response = await paypalAPI.createSubscription(plan, billingCycle)
      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl
      }
    } catch (error) {
      alert('Failed to initiate payment: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pricing-page">
      <div className="container">
        <h1>{t('pricing.title')}</h1>
        <p>{t('pricing.description')}</p>

        {/* Billing Cycle Toggle */}
        <div className="billing-toggle">
          <button
            className={billingCycle === 'monthly' ? 'active' : ''}
            onClick={() => setBillingCycle('monthly')}
          >
            {t('common.monthly')}
          </button>
          <button
            className={billingCycle === 'yearly' ? 'active' : ''}
            onClick={() => setBillingCycle('yearly')}
          >
            {t('common.yearly')}
            <span className="savings">Save 20%</span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-3 pricing-grid">
          {['free', 'pro', 'business'].map((plan) => (
            <div key={plan} className="card pricing-card">
              <h3>{t(`pricing.${plan}.name`)}</h3>
              <div className="price">
                {t(`pricing.${plan}.price`)}
                <span className="period">{t(`pricing.${plan}.period`)}</span>
              </div>
              
              {plan !== 'free' && (
                <div className="yearly-price">
                  {billingCycle === 'yearly' && 
                    `${((parseFloat(t(`pricing.${plan}.price`.match(/\d+\.?\d*/))) * 12 * 0.8).toFixed(2))}/year`
                  }
                </div>
              )}

              <ul className="features-list">
                {t(`pricing.${plan}.features`).map((feature, i) => (
                  <li key={i}>✓ {feature}</li>
                ))}
              </ul>

              <button
                className="btn-primary"
                onClick={() => handleSelectPlan(plan)}
                disabled={loading}
              >
                {loading ? 'Loading...' : plan === 'free' ? 'Start Free' : 'Subscribe Now'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PricingPage
