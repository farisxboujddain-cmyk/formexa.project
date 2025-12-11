import React from 'react'
import { useTranslation } from 'react-i18next'

const SubscriptionStatus = ({ subscription }) => {
  const { t } = useTranslation()

  if (!subscription) return null

  return (
    <div className="card subscription-status">
      <h3>{t('dashboard.subscriptionStatus')}</h3>
      <div className="status-grid">
        <div className="status-item">
          <p className="label">{t('dashboard.currentPlan')}</p>
          <p className="value">
            <span className="badge badge-success">
              {subscription.subscriptionPlan?.toUpperCase()}
            </span>
          </p>
        </div>
        <div className="status-item">
          <p className="label">Status</p>
          <p className="value">{subscription.subscriptionStatus}</p>
        </div>
        {subscription.billingCycle && (
          <div className="status-item">
            <p className="label">Billing Cycle</p>
            <p className="value">{subscription.billingCycle}</p>
          </div>
        )}
        {subscription.renewalDate && (
          <div className="status-item">
            <p className="label">{t('dashboard.renewalDate')}</p>
            <p className="value">
              {new Date(subscription.renewalDate).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubscriptionStatus
