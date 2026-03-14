const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/rbac');
const {
  getAll,
  getById,
  submit,
  getHistory,
  getLastResult,
} = require('../controllers/simulation.controller');

router.get('/', auth, authorize('user'), getAll);
router.get('/results/history', auth, authorize('user'), getHistory);
router.get('/results/last', auth, authorize('user'), getLastResult);
router.get('/:id', auth, authorize('user'), getById);
router.post('/:id/submit', auth, authorize('user'), submit);

module.exports = router;
