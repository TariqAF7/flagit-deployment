const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/rbac');
const {
  getAll,
  create,
  getById,
  update,
  deleteSimulation,
  togglePause,
  setStatus,
  endSimulation,
} = require('../controllers/adminSimulation.controller');

router.get('/',                auth, authorize('admin'), getAll);
router.post('/',               auth, authorize('admin'), create);
router.get('/:id',             auth, authorize('admin'), getById);
router.put('/:id',             auth, authorize('admin'), update);
router.delete('/:id',          auth, authorize('admin'), deleteSimulation);
router.put('/:id/pause',       auth, authorize('admin'), togglePause);
router.patch('/:id/status',    auth, authorize('admin'), setStatus);
router.post('/:id/end',        auth, authorize('admin'), endSimulation);

module.exports = router;
