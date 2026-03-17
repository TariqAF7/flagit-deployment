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

// @desc    Get simulation detail by slug (with email content)
// @route   GET /api/simulations/slug/:slug
exports.getBySlug = async (req, res, next) => {
  try {
    const simulation = await Simulation.findOne({ slug: req.params.slug });
    if (!simulation) {
      return res.status(404).json({ success: false, message: 'Simulation not found' });
    }
    res.json({ success: true, data: simulation });
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

// @desc    Submit user choice for a simulation via PATCH
// @route   PATCH /api/simulations/:id/report
exports.report = async (req, res, next) => {
  try {
    const { choice } = req.body;
    const simulation = await Simulation.findById(req.params.id);

    if (!simulation) {
      return res.status(404).json({ success: false, message: 'Simulation not found' });
    }

    if (!['phish', 'legit'].includes(choice)) {
      return res.status(400).json({ success: false, message: 'Choice must be "phish" or "legit"' });
    }

    const isCorrect = simulation.isPhishing ? choice === 'phish' : choice === 'legit';

    const result = await SimulationResult.create({
      userId: req.user._id,
      simulationId: simulation._id,
      choice,
      isCorrect,
      flagged: choice === 'phish', // If they reported it as phish, they flagged it
    });

    res.json({
      success: true,
      data: {
        isCorrect,
        isPhishing: simulation.isPhishing,
      },
      message: isCorrect
        ? 'Great job! You identified a potential threat.'
        : 'Actually, this was a simulated scam. Here’s what you missed...',
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

// @desc    Start a simulation (increment playCount)
// @route   POST /api/simulations/:id/start
exports.startSimulation = async (req, res, next) => {
  try {
    const simulation = await Simulation.findByIdAndUpdate(
      req.params.id,
      { $inc: { playCount: 1 } },
      { new: true }
    ).select('-emailContent');

    if (!simulation) {
      return res.status(404).json({ success: false, message: 'Simulation not found' });
    }

    res.json({ success: true, data: simulation });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user stats for simulations page
// @route   GET /api/simulations/user-stats
exports.getUserStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get all results for this user
    const results = await SimulationResult.find({ userId });

    const totalSimulations = results.length;
    const correctCount = results.filter((r) => r.isCorrect).length;
    const avgScore = totalSimulations > 0 ? Math.round((correctCount / totalSimulations) * 100) : 0;
    const totalResponseTime = results.reduce((sum, r) => sum + (r.responseTime || 0), 0);
    const timeSpent = totalResponseTime; // in seconds

    // Compute streak (consecutive weeks with at least one simulation)
    let streak = 0;
    if (results.length > 0) {
      const now = new Date();
      const sortedByDate = [...results].sort((a, b) => b.createdAt - a.createdAt);

      // Check week-by-week backwards
      let weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // start of current week
      weekStart.setHours(0, 0, 0, 0);

      for (let i = 0; i < 52; i++) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);

        const hasActivity = sortedByDate.some(
          (r) => r.createdAt >= weekStart && r.createdAt < weekEnd
        );

        if (hasActivity) {
          streak++;
        } else {
          break;
        }

        // Move to previous week
        weekStart.setDate(weekStart.getDate() - 7);
      }
    }

    // Compute flaggedCorrectly (correct phish detection + flagged)
    const flaggedCorrectly = results.filter((r) => r.isCorrect && r.flagged).length;

    // Generate badges
    const badges = [];
    if (avgScore >= 90) badges.push('Elite Defender');
    if (avgScore >= 75) badges.push('Strong Defender');
    if (streak >= 5) badges.push('Consistent Learner');
    if (totalSimulations >= 20) badges.push('Veteran');

    // Generate learning insights
    const insights = [];

    if (streak >= 10) {
      insights.push({
        type: 'achievement',
        title: '🔥 10-Week Streak!',
        description: "You've completed simulations for 10 weeks straight - exceptional dedication!",
        badge: 'elite',
      });
    } else if (streak >= 5) {
      insights.push({
        type: 'achievement',
        title: '⭐ 5-Week Streak',
        description: 'Consistent progress! Keep the momentum going.',
        badge: 'consistent',
      });
    }

    if (avgScore >= 90) {
      insights.push({
        type: 'success',
        title: '🏆 Elite Defender',
        description: "You're in the top 5% of all users. Masterful phishing detection!",
        badge: 'elite',
      });
    } else if (avgScore > 80) {
      insights.push({
        type: 'success',
        title: '🛡️ Strong Defender',
        description: `Your average score of ${avgScore}% puts you well above average.`,
        badge: 'strong',
      });
    } else if (avgScore >= 60) {
      insights.push({
        type: 'success',
        title: '📈 On Track',
        description: 'Good progress! Keep practicing to improve your score.',
        badge: 'improving',
      });
    } else {
      insights.push({
        type: 'success',
        title: '🌱 Building Foundation',
        description: 'Every expert was once a beginner. Keep learning!',
        badge: 'beginner',
      });
    }

    if (flaggedCorrectly >= 10) {
      insights.push({
        type: 'strength',
        title: '✅ URL Detection Master',
        description: 'Your ability to spot and flag malicious content is exceptional.',
        badge: 'strength',
      });
    }

    // Recommendation based on weaknesses
    const incorrectResults = results.filter((r) => !r.isCorrect);
    if (incorrectResults.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Recommended: Practice More Simulations',
        description: `You have ${incorrectResults.length} incorrect answers. Try repeating those scenarios.`,
      });
    } else if (totalSimulations === 0) {
      insights.push({
        type: 'warning',
        title: 'Get Started!',
        description: 'Complete your first simulation to begin building your defense skills.',
      });
    }

    res.json({
      success: true,
      data: {
        totalSimulations,
        avgScore,
        timeSpent,
        streak,
        badges,
        flaggedCorrectly,
        insights,
      },
    });
  } catch (error) {
    next(error);
  }
};
