const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/rbac');
const {
  getAll,
  getById,
  getBySlug,
  submit,
  getHistory,
  getLastResult,
  startSimulation,
  getUserStats,
} = require('../controllers/simulation.controller');

router.get('/', auth, authorize('user'), getAll);
router.get('/user-stats', auth, authorize('user'), getUserStats);
router.get('/results/history', auth, authorize('user'), getHistory);
router.get('/results/last', auth, authorize('user'), getLastResult);
router.get('/slug/:slug', auth, authorize('user'), getBySlug);
router.get('/:id', auth, authorize('user'), getById);
router.post('/:id/start', auth, authorize('user'), startSimulation);
router.post('/:id/submit', auth, authorize('user'), submit);

module.exports = router;
