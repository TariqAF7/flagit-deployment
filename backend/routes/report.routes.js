const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/rbac');
const {
  getTrends,
  getHeatmapData,
  getEffectivenessData,
  exportPdfData,
} = require('../controllers/report.controller');

// Trend / analytics
router.get('/trends',          auth, authorize('admin'), getTrends);
router.get('/heatmap',         auth, authorize('admin'), getHeatmapData);
router.get('/effectiveness',   auth, authorize('admin'), getEffectivenessData);

// Export — PDF only
router.get('/export/pdf-data', auth, authorize('admin'), exportPdfData);

module.exports = router;
