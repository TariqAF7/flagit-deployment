const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/rbac');
const {
  getAll,
  create,
  getById,
  update,
  delete: deleteCampaign,
  togglePause,
} = require('../controllers/campaign.controller');

router.get('/', auth, authorize('admin'), getAll);
router.post('/', auth, authorize('admin'), create);
router.get('/:id', auth, authorize('admin'), getById);
router.put('/:id', auth, authorize('admin'), update);
router.delete('/:id', auth, authorize('admin'), deleteCampaign);
router.put('/:id/pause', auth, authorize('admin'), togglePause);

module.exports = router;
