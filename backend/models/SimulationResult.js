const mongoose = require('mongoose');

const simulationResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    simulationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Simulation',
      required: true,
    },
    choice: {
      type: String,
      enum: ['phish', 'legit'],
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    responseTime: {
      type: Number, // seconds
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user history queries
simulationResultSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('SimulationResult', simulationResultSchema);
