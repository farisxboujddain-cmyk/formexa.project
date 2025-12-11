const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
    password: { type: String, select: false },
    name: { type: String, required: true },
    avatar: { type: String },
    githubId: { type: String, unique: true, sparse: true },
    subscriptionPlan: {
      type: String,
      enum: ['free', 'pro', 'business'],
      default: 'free'
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'suspended'],
      default: 'inactive'
    },
    paypalSubscriptionId: { type: String },
    paypalCustomerId: { type: String },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly'
    },
    subscriptionStartDate: { type: Date },
    subscriptionEndDate: { type: Date },
    renewalDate: { type: Date },
    usage: {
      articles: { type: Number, default: 0 },
      images: { type: Number, default: 0 },
      code: { type: Number, default: 0 }
    },
    usageResetDate: { type: Date, default: () => new Date(new Date().setDate(1)) },
    language: {
      type: String,
      enum: ['en', 'ar', 'fr'],
      default: 'en'
    },
    lastLogin: { type: Date },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpiry: { type: Date, select: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Method to get subscription limits based on plan
userSchema.methods.getSubscriptionLimits = function () {
  const limits = {
    free: { articles: 5, images: 2, code: 5 },
    pro: { articles: 100, images: 50, code: 100 },
    business: { articles: Infinity, images: Infinity, code: Infinity }
  };
  return limits[this.subscriptionPlan] || limits.free;
};

// Method to check if user can use a feature
userSchema.methods.canUseFeature = function (featureType) {
  const limits = this.getSubscriptionLimits();
  const currentUsage = this.usage[featureType] || 0;
  return currentUsage < limits[featureType];
};

// Method to increment usage
userSchema.methods.incrementUsage = function (featureType) {
  this.usage[featureType] = (this.usage[featureType] || 0) + 1;
  return this.save();
};

// Method to reset monthly usage
userSchema.methods.resetMonthlyUsage = async function () {
  const now = new Date();
  const resetDate = new Date(now.getFullYear(), now.getMonth(), 1);
  if (this.usageResetDate < resetDate) {
    this.usage = { articles: 0, images: 0, code: 0 };
    this.usageResetDate = resetDate;
    return this.save();
  }
};

module.exports = mongoose.model('User', userSchema);
