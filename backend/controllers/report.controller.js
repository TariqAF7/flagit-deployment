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

    // ── 5. Fallback sample data when DB has no results yet ───────────────
    if (data.length === 0) {
      const LABELS_7  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const LABELS_30 = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      const LABELS_YR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      const labels =
        timeframe === 'last_7_days' ? LABELS_7  :
        timeframe === 'last_year'   ? LABELS_YR :
        LABELS_30;

      const fallback = labels.map((label, i) => ({
        label,
        totalIncidents:    Math.round(80  + i * 12 + Math.random() * 20),
        detectedIncidents: Math.round(55  + i * 9  + Math.random() * 15),
        reportedIncidents: Math.round(35  + i * 6  + Math.random() * 10),
      }));

      return res.json({ success: true, data: fallback, fallback: true });
    }

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

    // ── Heatmap (department vulnerability) ────────────────────────────
    const heatmapRaw = await SimulationResult.aggregate([
      {
        $lookup: {
          from: 'users', localField: 'userId',
          foreignField: '_id', as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: false } },
      { $match: { 'user.department': { $exists: true, $ne: '' } } },
      {
        $group: {
          _id:    '$user.department',
          total:  { $sum: 1 },
          clicks: { $sum: { $cond: [{ $eq: ['$isCorrect', false] }, 1, 0] } },
        },
      },
      { $sort: { clicks: -1 } },
    ]);

    const heatmap = heatmapRaw.map(r => ({
      department:       r._id,
      total:            r.total,
      clicks:           r.clicks,
      vulnerabilityRate: r.total > 0 ? Math.round((r.clicks / r.total) * 100) : 0,
    }));

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
        heatmap,
      },
    });
  } catch (error) {
    console.error('[exportPdfData] Error:', error.message);
    next(error);
  }
};

/**
 * @desc   Department vulnerability heatmap
 * @route  GET /api/admin/reports/heatmap
 *
 * Joins SimulationResult -> User to get department per result.
 * Groups by department, calculates:
 *   vulnerabilityRate = (clicks / total) * 100
 *   riskLevel         = Critical | High | Moderate | Low
 * Sorted most vulnerable first.
 */
exports.getHeatmapData = async (req, res, next) => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: false } },
      { $match: { 'user.department': { $exists: true, $ne: '' } } },
      {
        $group: {
          _id:    '$user.department',
          total:  { $sum: 1 },
          clicks: { $sum: { $cond: [{ $eq: ['$isCorrect', false] }, 1, 0] } },
        },
      },
      { $sort: { clicks: -1 } },
    ];

    const aggregated = await SimulationResult.aggregate(pipeline);

    const data = aggregated.map(row => {
      const vulnerabilityRate = row.total > 0
        ? Math.round((row.clicks / row.total) * 100)
        : 0;
      const riskLevel =
        vulnerabilityRate >= 70 ? 'Critical' :
        vulnerabilityRate >= 50 ? 'High'     :
        vulnerabilityRate >= 30 ? 'Moderate' : 'Low';
      return { department: row._id, total: row.total, clicks: row.clicks, vulnerabilityRate, riskLevel };
    });

    if (data.length === 0) {
      return res.json({
        success: true, fallback: true,
        data: [
          { department: 'Finance',     total: 120, clicks: 84, vulnerabilityRate: 70, riskLevel: 'Critical' },
          { department: 'HR',          total: 98,  clicks: 58, vulnerabilityRate: 59, riskLevel: 'High'     },
          { department: 'Operations',  total: 145, clicks: 71, vulnerabilityRate: 49, riskLevel: 'Moderate' },
          { department: 'Sales',       total: 88,  clicks: 37, vulnerabilityRate: 42, riskLevel: 'Moderate' },
          { department: 'Marketing',   total: 76,  clicks: 26, vulnerabilityRate: 34, riskLevel: 'Moderate' },
          { department: 'IT',          total: 110, clicks: 23, vulnerabilityRate: 21, riskLevel: 'Low'      },
          { department: 'Engineering', total: 134, clicks: 20, vulnerabilityRate: 15, riskLevel: 'Low'      },
        ],
      });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Training effectiveness: trained vs untrained click-rate comparison
 * @route  GET /api/admin/reports/effectiveness
 *
 * Trained   = User.stats.modulesFinished >= 1
 * Untrained = User.stats.modulesFinished === 0
 * avgClickRate = (wrong answers / total simulations) * 100  per group
 * impact       = untrainedClickRate - trainedClickRate  (percentage-point reduction)
 */
exports.getEffectivenessData = async (req, res, next) => {
  try {
    const [trainedUsers, untrainedUsers] = await Promise.all([
      User.find({ 'stats.modulesFinished': { $gte: 1 } }, '_id'),
      User.find({ 'stats.modulesFinished': { $lte: 0 } }, '_id'),
    ]);

    const trainedIds   = trainedUsers.map(u => u._id);
    const untrainedIds = untrainedUsers.map(u => u._id);

    const getGroupStats = async (userIds) => {
      if (userIds.length === 0) return { total: 0, clicks: 0, avgClickRate: 0 };
      const [row] = await SimulationResult.aggregate([
        { $match: { userId: { $in: userIds } } },
        {
          $group: {
            _id:    null,
            total:  { $sum: 1 },
            clicks: { $sum: { $cond: [{ $eq: ['$isCorrect', false] }, 1, 0] } },
          },
        },
      ]);
      if (!row) return { total: 0, clicks: 0, avgClickRate: 0 };
      return {
        total:        row.total,
        clicks:       row.clicks,
        avgClickRate: row.total > 0 ? Math.round((row.clicks / row.total) * 100) : 0,
      };
    };

    const [trainedStats, untrainedStats] = await Promise.all([
      getGroupStats(trainedIds),
      getGroupStats(untrainedIds),
    ]);

    const hasData = trainedStats.total > 0 || untrainedStats.total > 0;

    if (!hasData) {
      return res.json({
        success: true, fallback: true,
        data: {
          trained:   { label: 'Trained (≥1 Module)',   avgClickRate: 18, totalUsers: trainedUsers.length,   description: 'Users who completed at least one training module' },
          untrained: { label: 'Untrained (0 Modules)', avgClickRate: 61, totalUsers: untrainedUsers.length, description: 'Users who have not completed any training modules'    },
          impact: 43,
        },
      });
    }

    const impact = Math.max(0, untrainedStats.avgClickRate - trainedStats.avgClickRate);

    res.json({
      success: true,
      data: {
        trained: {
          label: 'Trained (≥1 Module)', avgClickRate: trainedStats.avgClickRate,
          totalUsers: trainedUsers.length, totalResults: trainedStats.total,
          description: 'Users who completed at least one training module',
        },
        untrained: {
          label: 'Untrained (0 Modules)', avgClickRate: untrainedStats.avgClickRate,
          totalUsers: untrainedUsers.length, totalResults: untrainedStats.total,
          description: 'Users who have not completed any training modules',
        },
        impact,
      },
    });
  } catch (error) {
    next(error);
  }
};
