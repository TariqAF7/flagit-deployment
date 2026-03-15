const mongoose = require('mongoose');

/**
 * Platform Settings — singleton document.
 * We always use Settings.getSingleton() to read and upsert the one record.
 */
const settingsSchema = new mongoose.Schema(
  {
    platformName:              { type: String,  default: 'FlagIT' },
    maintenanceMode:           { type: Boolean, default: false },
    defaultSimulationDifficulty: {
      type:    String,
      enum:    ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    maxSimulationTime:         { type: Number,  default: 300 },   // seconds
    emailNotifications:        { type: Boolean, default: true  },
    sessionTimeoutMinutes:     { type: Number,  default: 60    },
  },
  {
    timestamps: true,
  }
);

// Singleton helper — always work with a single settings document
settingsSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});  // create with all defaults
  }
  return doc;
};

module.exports = mongoose.model('Settings', settingsSchema);
