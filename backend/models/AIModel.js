const mongoose = require('mongoose');

const aiModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Model name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Training', 'Inactive'],
      default: 'Active',
    },
    version: {
      type: String,
      default: 'v1.0.0',
    },
    metrics: {
      accuracy: { type: Number, default: 0 },
      precision: { type: Number, default: 0 },
      recall: { type: Number, default: 0 },
      f1: { type: Number, default: 0 },
    },
    lastTrainedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AIModel', aiModelSchema);
