const mongoose = require('mongoose');

const generatedSampleSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    attackType: {
      type: String,
      required: true,
    },
    tactic: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      default: 'Random Brand',
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('GeneratedSample', generatedSampleSchema);
