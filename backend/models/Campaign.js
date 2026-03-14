const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Campaign name is required'],
      trim: true,
    },
    targetGroup: {
      type: String,
      required: [true, 'Target group is required'],
    },
    scenarioType: {
      type: String,
      required: [true, 'Scenario type is required'],
    },
    schedule: {
      type: Date,
      required: [true, 'Schedule date is required'],
    },
    status: {
      type: String,
      enum: ['Active', 'Paused', 'Completed'],
      default: 'Active',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    simulationIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Simulation',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Campaign', campaignSchema);
