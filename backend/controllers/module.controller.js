const Module = require('../models/Module');

// @desc    Get all modules
// @route   GET /api/modules
exports.getAll = async (req, res, next) => {
  try {
    const modules = await Module.find().sort({ createdAt: -1 });
    res.json({ success: true, data: modules });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single module
// @route   GET /api/modules/:id
exports.getById = async (req, res, next) => {
  try {
    const mod = await Module.findById(req.params.id);
    if (!mod) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }
    res.json({ success: true, data: mod });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user progress on a module
// @route   PUT /api/modules/:id/progress
exports.updateProgress = async (req, res, next) => {
  try {
    const { progress } = req.body;
    // In a full implementation, progress would be tracked per-user in a separate collection.
    // For now, we simply return the updated progress value.
    const mod = await Module.findById(req.params.id);
    if (!mod) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }
    res.json({
      success: true,
      data: {
        moduleId: mod._id,
        userId: req.user._id,
        progress: progress || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
