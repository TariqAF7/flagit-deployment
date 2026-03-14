const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/rbac');
const {
  getProfile,
  updateProfile,
  getStats,
  getAnalytics,
} = require('../controllers/user.controller');

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/stats', auth, authorize('user'), getStats);
router.get('/analytics', auth, authorize('user'), getAnalytics);

module.exports = router;
