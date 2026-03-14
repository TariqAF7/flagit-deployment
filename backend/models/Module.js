const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Module title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Module description is required'],
    },
    icon: {
      type: String,
      enum: ['Brain', 'Shield', 'Link', 'Mail'],
      default: 'Brain',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    duration: {
      type: String,
      default: '15 min',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Module', moduleSchema);
