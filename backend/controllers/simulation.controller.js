const Simulation = require('../models/Simulation');
const SimulationResult = require('../models/SimulationResult');
const User = require('../models/User');

// @desc    Get all simulations
// @route   GET /api/simulations
exports.getAll = async (req, res, next) => {
  try {
    const simulations = await Simulation.find().select('-emailContent').sort({ createdAt: -1 });
    res.json({ success: true, data: simulations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get simulation detail (with email content)
// @route   GET /api/simulations/:id
exports.getById = async (req, res, next) => {
  try {
    const simulation = await Simulation.findById(req.params.id);
    if (!simulation) {
      return res.status(404).json({ success: false, message: 'Simulation not found' });
    }
    res.json({ success: true, data: simulation });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit user choice for a simulation
// @route   POST /api/simulations/:id/submit
exports.submit = async (req, res, next) => {
  try {
    const { choice, responseTime, flagged } = req.body;
    const simulation = await Simulation.findById(req.params.id);

    if (!simulation) {
      return res.status(404).json({ success: false, message: 'Simulation not found' });
    }

    if (!['phish', 'legit'].includes(choice)) {
      return res.status(400).json({ success: false, message: 'Choice must be "phish" or "legit"' });
    }

    const isCorrect = simulation.isPhishing ? choice === 'phish' : choice === 'legit';

    // flagged === true means the user actively clicked the FlagIT report button.
    // Strict boolean coercion prevents truthy non-boolean values (e.g. the
    // string "true") from accidentally inflating the org reporting rate.
    const wasFlagged = flagged === true;

    const result = await SimulationResult.create({
      userId: req.user._id,
      simulationId: simulation._id,
      choice,
      isCorrect,
      responseTime: responseTime || 0,
      flagged: wasFlagged,
    });

    // Update user stats
    const update = {
      $inc: {
        'stats.simulationsCompleted': 1,
      },
    };

    if (isCorrect && choice === 'phish') {
      update.$inc['stats.phishDetected'] = 1;
    }

    // Recalculate resilience score
    const allResults = await SimulationResult.find({ userId: req.user._id });
    const correctCount = allResults.filter((r) => r.isCorrect).length + (isCorrect ? 1 : 0);
    const totalCount = allResults.length + 1;
    const newScore = Math.round((correctCount / totalCount) * 100);

    update.resilienceScore = newScore;

    await User.findByIdAndUpdate(req.user._id, update);

    res.json({
      success: true,
      data: {
        result,
        isCorrect,
        flagged: wasFlagged,
        updatedResilienceScore: newScore,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's simulation results history
// @route   GET /api/simulations/results/history
exports.getHistory = async (req, res, next) => {
  try {
    const results = await SimulationResult.find({ userId: req.user._id })
      .populate('simulationId', 'title description icon')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's last result
// @route   GET /api/simulations/results/last
exports.getLastResult = async (req, res, next) => {
  try {
    const result = await SimulationResult.findOne({ userId: req.user._id })
      .populate('simulationId', 'title description icon')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
