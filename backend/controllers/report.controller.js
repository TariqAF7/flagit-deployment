const SimulationResult = require('../models/SimulationResult');
const User = require('../models/User');
const Simulation = require('../models/Simulation');

/**
 * @desc   Get phishing incident trends with timeframe, department & type filters
 * @route  GET /api/admin/reports/trends
 * @query  timeframe   'last_7_days' | 'last_30_days' | 'last_year'
 * @query  department  any department string, or 'all' / omitted
 * @query  simType     simulation title substring, or 'all' / omitted
 */
exports.getTrends = async (req, res, next) => {
  try {
    const { timeframe = 'last_30_days', department = 'all', simType = 'all' } = req.query;

    // ── 1. Resolve date window ────────────────────────────────────────────
    const now = new Date();
    let startDate;
    let groupFormat;   // MongoDB dateToString format
    let labelFn;       // (groupKey: string) => display label

    if (timeframe === 'last_7_days') {
      startDate   = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      groupFormat = '%Y-%m-%d';           // group by calendar day
      labelFn     = (key) => {            // 'YYYY-MM-DD' → 'Mon', 'Tue' …
        const d = new Date(key);
        return d.toLocaleDateString('en-US', { weekday: 'short' });
      };
    } else if (timeframe === 'last_year') {
      startDate   = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      groupFormat = '%Y-%m';              // group by month
      labelFn     = (key) => {            // 'YYYY-MM' → 'Jan', 'Feb' …
        const [y, m] = key.split('-');
        return new Date(+y, +m - 1, 1).toLocaleDateString('en-US', { month: 'short' });
      };
    } else {
      // default: last_30_days — group by ISO week within the period
      startDate   = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      groupFormat = '%G-W%V';             // ISO week: '2025-W12'
      labelFn     = (key, idx) => `Week ${idx + 1}`;
    }

    // ── 2. Build match stage ─────────────────────────────────────────────
    const matchStage = { createdAt: { $gte: startDate } };

    // Department filter — requires a $lookup on User
    let userIds = null;
    if (department && department !== 'all') {
      const users = await User.find({ department }, '_id');
      userIds = users.map(u => u._id);
      matchStage.userId = { $in: userIds };
    }

    // Simulation type filter — requires a $lookup on Simulation
    if (simType && simType !== 'all') {
      const simulations = await Simulation.find(
        { title: { $regex: simType, $options: 'i' } },
        '_id'
      );
      const simIds = simulations.map(s => s._id);
      matchStage.simulationId = { $in: simIds };
    }

    // ── 3. MongoDB aggregation pipeline ─────────────────────────────────
    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: {
            $dateToString: { format: groupFormat, date: '$createdAt' },
          },
          totalIncidents:    { $sum: 1 },
          detectedIncidents: { $sum: { $cond: ['$isCorrect', 1, 0] } },
          reportedIncidents: { $sum: { $cond: ['$flagged',   1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const aggregated = await SimulationResult.aggregate(pipeline);

    // ── 4. Map to labelled response array ────────────────────────────────
    const data = aggregated.map((point, idx) => ({
      label:             labelFn(point._id, idx),
      totalIncidents:    point.totalIncidents,
      detectedIncidents: point.detectedIncidents,
      reportedIncidents: point.reportedIncidents,
    }));



    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Return structured data for client-side PDF generation
 * @route  GET /api/admin/reports/export/pdf-data
 *
 * Returns all the data needed to render an "Executive Security Summary" PDF.
 * The frontend uses jsPDF (loaded via CDN or npm) to assemble the actual file.
 * This avoids any server-side PDF library install.
 */
exports.exportPdfData = async (req, res, next) => {
  try {
    // ── Core metrics ───────────────────────────────────────────────────
    const totalResults = await SimulationResult.countDocuments();
    let orgResilienceScore = 0, detectionRate = 0, reportingRate = 0;

    if (totalResults > 0) {
      const correctCount = await SimulationResult.countDocuments({ isCorrect: true });
      const flaggedCount  = await SimulationResult.countDocuments({ flagged:   true });
      detectionRate      = Math.round((correctCount / totalResults) * 100);
      reportingRate      = Math.round((flaggedCount  / totalResults) * 100);
      orgResilienceScore = Math.round(detectionRate * 0.6 + reportingRate * 0.4);
    }

    const totalUsers  = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: { $ne: 'Inactive' } });

    res.json({
      success: true,
      data: {
        generatedAt:       new Date().toISOString(),
        reportTitle:       'Security Awareness Executive Summary',
        organization:      'FlagIT Platform',
        summary: {
          totalUsers,
          activeUsers,
          totalSimulations: totalResults,
          orgResilienceScore,
          detectionRate,
          reportingRate,
        },
      },
    });
  } catch (error) {
    console.error('[exportPdfData] Error:', error.message);
    next(error);
  }
};


