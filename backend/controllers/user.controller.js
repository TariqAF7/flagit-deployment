const User = require('../models/User');
const SimulationResult = require('../models/SimulationResult');

// @desc    Get own profile
// @route   GET /api/users/profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

// @desc    Update own profile
// @route   PUT /api/users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user stats
// @route   GET /api/users/stats
exports.getStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: {
        simulationsCompleted: user.stats.simulationsCompleted,
        phishDetected: user.stats.phishDetected,
        modulesFinished: user.stats.modulesFinished,
        resilienceScore: user.resilienceScore,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user analytics (vulnerability, progress, ranking)
// @route   GET /api/users/analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Get results history for weekly progress
    const results = await SimulationResult.find({ userId: req.user._id })
      .sort({ createdAt: 1 });

    // Compute weekly progress (group by week)
    const weeklyProgress = [];
    if (results.length > 0) {
      let weekStart = new Date(results[0].createdAt);
      let weekCorrect = 0;
      let weekTotal = 0;

      for (const r of results) {
        const diff = (r.createdAt - weekStart) / (1000 * 60 * 60 * 24);
        if (diff > 7) {
          weeklyProgress.push(weekTotal > 0 ? Math.round((weekCorrect / weekTotal) * 100) : 0);
          weekStart = new Date(r.createdAt);
          weekCorrect = 0;
          weekTotal = 0;
        }
        weekTotal++;
        if (r.isCorrect) weekCorrect++;
      }
      weeklyProgress.push(weekTotal > 0 ? Math.round((weekCorrect / weekTotal) * 100) : 0);
    }

    // Compute team ranking (simple: percentage of users with lower score)
    const totalUsers = await User.countDocuments({ role: 'user' });
    const usersBelow = await User.countDocuments({
      role: 'user',
      resilienceScore: { $lt: user.resilienceScore },
    });
    const teamRanking = totalUsers > 0 ? Math.round((usersBelow / totalUsers) * 100) : 0;

    // Vulnerability data (mock based on results breakdown — can be enriched later)
    const vulnerabilityData = {
      urgency: 65,
      urlDetection: 82,
      authority: 71,
      genericGreeting: 58,
      suspiciousLinks: 79,
      spoofing: 63,
    };

    res.json({
      success: true,
      data: {
        resilienceScore: user.resilienceScore,
        weeklyProgress,
        teamRanking: `Top ${100 - teamRanking}%`,
        vulnerabilityData,
      },
    });
  } catch (error) {
    next(error);
  }
};
