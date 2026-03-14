const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Dataset name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    size: {
      type: String,
      default: '0 MB',
    },
    records: {
      type: String,
      default: '0',
    },
    source: {
      type: String,
      enum: ['API', 'Manual Upload', 'Web Scraping', 'External Feed'],
      default: 'API',
    },
    status: {
      type: String,
      enum: ['Active', 'Processing'],
      default: 'Processing',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Dataset', datasetSchema);
