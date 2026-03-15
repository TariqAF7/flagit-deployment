const mongoose = require('mongoose');

const redFlagSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['technical', 'psychological'],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const simulationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Simulation title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Simulation description is required'],
    },
    icon: {
      type: String,
      enum: ['Brain', 'Shield', 'Link', 'Mail', 'UserSecret', 'Globe', 'Bullseye', 'Qrcode', 'Phone', 'Envelope'],
      default: 'Brain',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    tags: {
      type: [String],
      default: [],
    },
    playCount: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    emailContent: {
      senderName: { type: String, default: '' },
      senderEmail: { type: String, default: '' },
      subject: { type: String, default: '' },
      body: { type: String, default: '' },
      redFlags: [redFlagSchema],
    },
    isPhishing: {
      type: Boolean,
      default: true,
    },
    timeLimit: {
      type: Number,
      default: 1066, // 17 minutes 46 seconds
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from title if not provided
simulationSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
  next();
});

module.exports = mongoose.model('Simulation', simulationSchema);
