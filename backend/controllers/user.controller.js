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
      .populate('simulationId', 'title slug tags description')
      .sort({ createdAt: 1 });

    const vulnerabilityCategoryOrder = [
      'Deceptive URLs',
      'BiTB Attacks',
      'Psychological Tactics',
      'Credential Harvesting',
    ];

    const vulnerabilityScoreMap = vulnerabilityCategoryOrder.reduce((acc, category) => {
      acc[category] = { correct: 0, total: 0 };
      return acc;
    }, {});

    const mapSimulationToCategory = (simulation) => {
      if (!simulation) return null;

      const searchable = [
        simulation.title,
        simulation.slug,
        simulation.description,
        ...(Array.isArray(simulation.tags) ? simulation.tags : []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (
        searchable.includes('url') ||
        searchable.includes('link') ||
        searchable.includes('quish') ||
        searchable.includes('qr') ||
        searchable.includes('domain')
      ) {
        return 'Deceptive URLs';
      }

      if (searchable.includes('bitb') || searchable.includes('browser-in-the-browser') || searchable.includes('fake login')) {
        return 'BiTB Attacks';
      }

      if (
        searchable.includes('urgent') ||
        searchable.includes('urgency') ||
        searchable.includes('psychological') ||
        searchable.includes('social engineering') ||
        searchable.includes('vishing')
      ) {
        return 'Psychological Tactics';
      }

      if (
        searchable.includes('credential') ||
        searchable.includes('password') ||
        searchable.includes('login') ||
        searchable.includes('account') ||
        searchable.includes('spear phishing') ||
        searchable.includes('ceo fraud')
      ) {
        return 'Credential Harvesting';
      }

      return 'Psychological Tactics';
    };

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

        const mappedCategory = mapSimulationToCategory(r.simulationId);
        if (mappedCategory && vulnerabilityScoreMap[mappedCategory]) {
          vulnerabilityScoreMap[mappedCategory].total += 1;
          if (r.isCorrect) {
            vulnerabilityScoreMap[mappedCategory].correct += 1;
          }
        }
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

    const vulnerabilityData = vulnerabilityCategoryOrder.map((category) => {
      const { correct, total } = vulnerabilityScoreMap[category];
      const score = total > 0 ? Math.round((correct / total) * 100) : 0;
      return {
        category,
        score,
      };
    });

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
