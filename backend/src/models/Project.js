const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    type: {
      type: String,
      enum: ['article', 'image', 'code'],
      required: true
    },
    content: {
      input: { type: String, required: true },
      output: { type: String },
      metadata: mongoose.Schema.Types.Mixed
    },
    tags: [String],
    isPublic: { type: Boolean, default: false },
    aiProvider: {
      type: String,
      enum: ['openai', 'gemini'],
      default: 'openai'
    },
    generationTime: { type: Number }, // in milliseconds
    cost: { type: Number, default: 0 }, // in cents
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Index for faster queries
projectSchema.index({ userId: 1, createdAt: -1 });
projectSchema.index({ userId: 1, type: 1 });

module.exports = mongoose.model('Project', projectSchema);
