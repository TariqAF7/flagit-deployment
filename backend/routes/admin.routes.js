const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/rbac');
const {
  getStats,
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  hardDeleteUser,
  getSettings,
  updateSettings,
  getDepartments,
} = require('../controllers/admin.controller');

// Dashboard stats
router.get('/stats', auth, authorize('admin'), getStats);

// User management
router.get('/users/departments', auth, authorize('admin'), getDepartments);
router.get('/users', auth, authorize('admin'), getUsers);
router.post('/users', auth, authorize('admin'), createUser);
router.get('/users/:id', auth, authorize('admin'), getUserById);
router.put('/users/:id', auth, authorize('admin'), updateUser);
router.delete('/users/:id/hard', auth, authorize('admin'), hardDeleteUser);
router.delete('/users/:id', auth, authorize('admin'), deleteUser);

// Settings
router.get('/settings', auth, authorize('admin'), getSettings);
router.put('/settings', auth, authorize('admin'), updateSettings);

module.exports = router;
