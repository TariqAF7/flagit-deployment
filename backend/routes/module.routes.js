const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/rbac');
const {
  getAll,
  getById,
  updateProgress,
} = require('../controllers/module.controller');

router.get('/', auth, authorize('user'), getAll);
router.get('/:id', auth, authorize('user'), getById);
router.put('/:id/progress', auth, authorize('user'), updateProgress);

module.exports = router;
