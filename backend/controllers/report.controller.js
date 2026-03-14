const SimulationResult = require('../models/SimulationResult');

// @desc    Get phishing incident trends (weekly)
// @route   GET /api/admin/reports/trends
exports.getTrends = async (req, res, next) => {
  try {
    const { period } = req.query;
    let daysBack = 30;
    if (period === '7d') daysBack = 7;
    if (period === '90d') daysBack = 90;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const results = await SimulationResult.find({
      createdAt: { $gte: startDate },
    }).sort({ createdAt: 1 });

    // Group by week
    const weeks = {};
    results.forEach((r) => {
      const weekNum = getWeekNumber(r.createdAt);
      const key = `Week ${weekNum}`;
      if (!weeks[key]) {
        weeks[key] = { w: key, total: 0, detected: 0, reported: 0 };
      }
      weeks[key].total++;
      if (r.isCorrect) {
        weeks[key].detected++;
        weeks[key].reported++;
      }
    });

    const trends = Object.values(weeks);

    // If no real data, provide sample trends
    if (trends.length === 0) {
      res.json({
        success: true,
        data: [
          { w: 'Week 1', total: 110, detected: 80, reported: 70 },
          { w: 'Week 2', total: 125, detected: 90, reported: 85 },
          { w: 'Week 3', total: 155, detected: 110, reported: 95 },
          { w: 'Week 4', total: 175, detected: 140, reported: 120 },
          { w: 'Week 5', total: 190, detected: 155, reported: 135 },
          { w: 'Week 6', total: 215, detected: 175, reported: 155 },
          { w: 'Week 7', total: 230, detected: 193, reported: 171 },
        ],
      });
      return;
    }

    res.json({ success: true, data: trends });
  } catch (error) {
    next(error);
  }
};

// @desc    Export report (stub — returns JSON for now)
// @route   GET /api/admin/reports/export
exports.exportReport = async (req, res, next) => {
  try {
    const results = await SimulationResult.find()
      .populate('userId', 'name email department')
      .populate('simulationId', 'title')
      .sort({ createdAt: -1 })
      .limit(1000);

    res.json({
      success: true,
      message: 'Export data ready',
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

// Helper: get ISO week number from date
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}
