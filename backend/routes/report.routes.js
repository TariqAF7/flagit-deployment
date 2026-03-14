const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/rbac');
const { getTrends, exportReport } = require('../controllers/report.controller');

router.get('/trends', auth, authorize('admin'), getTrends);
router.get('/export', auth, authorize('admin'), exportReport);

module.exports = router;
