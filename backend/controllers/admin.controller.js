const User = require('../models/User');
const bcrypt = require('bcryptjs');
const SimulationResult = require('../models/SimulationResult');
const Settings = require('../models/Settings');


// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
exports.getStats = async (req, res, next) => {
  try {
    // ── Stat Card 1: Total Users ──────────────────────────────────────────
    // Count of ALL documents in the User collection.
    const totalUsers = await User.countDocuments();

    // ── Stat Card 2: Active Users ─────────────────────────────────────────
    // Users whose status is anything other than 'Inactive'.
    // This is safer than only counting { status: 'Active' } because future
    // statuses (e.g. 'Suspended', 'Pending') would still be excluded
    // from the Inactive group and counted correctly.
    const activeUsers = await User.countDocuments({ status: { $ne: 'Inactive' } });

    // ── Resilience formula shared counts ─────────────────────────────────
    const totalResults  = await SimulationResult.countDocuments();

    let detectionRate    = 0;
    let reportingRate    = 0;
    let orgResilienceScore = 0;
    let correctCount     = 0;
    let flaggedCount     = 0;

    if (totalResults > 0) {
      // ── Stat Card 3 source: Avg Detection Rate ──────────────────────────
      // Formula: (Total Correct / Total Simulations) × 100
      // A result is 'correct' when the user correctly identified the email
      // as phishing (isCorrect === true).
      correctCount  = await SimulationResult.countDocuments({ isCorrect: true });

      // ── Stat Card 4 source: Incidents Reported ───────────────────────────
      // Count of results where the user actively pressed the FlagIT button
      // (flagged === true), regardless of whether they were correct.
      flaggedCount  = await SimulationResult.countDocuments({ flagged: true });

      detectionRate = Math.round((correctCount / totalResults) * 100);
      reportingRate = Math.round((flaggedCount  / totalResults) * 100);

      orgResilienceScore = Math.round(
        detectionRate * 0.6 + reportingRate * 0.4
      );

      // ── DIAGNOSTIC LOGS (remove after verification) ──────────────
      console.log('\n[DIAG] ── Resilience Score Calculation ────────────────');
      console.log(`[DIAG]  Total SimulationResults : ${totalResults}`);
      console.log(`[DIAG]  Correct (isCorrect=true): ${correctCount}`);
      console.log(`[DIAG]  Flagged (flagged=true)  : ${flaggedCount}`);
      console.log(`[DIAG]  Detection Rate          : ${detectionRate}%  (correctCount / total × 100)`);
      console.log(`[DIAG]  Reporting Rate          : ${reportingRate}%  (flaggedCount  / total × 100)`);
      console.log(`[DIAG]  Final Score (60/40)     : ${orgResilienceScore}  (${detectionRate}×0.6 + ${reportingRate}×0.4)`);
      console.log('[DIAG] ──────────────────────────────────────────────────\n');
      // ─────────────────────────────────────────────────────────────
    }

    // ── Stat Card 3: Avg Detection Rate (%) ──────────────────────────────
    const avgDetectionRate = detectionRate; // same value, explicit alias for clarity

    // ── Stat Card 4: Incidents Reported ──────────────────────────────────
    // = total number of times users pressed the FlagIT report button.
    const incidentsReported = flaggedCount;

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        avgDetectionRate,
        detectionRate,
        reportingRate,
        incidentsReported,
        orgResilienceScore,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (with search, filter, pagination)
// @route   GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const { search, role, department, status, page = 1, limit = 50 } = req.query;

    const query = {};

    // ── Search: case-insensitive regex on name OR email ─────────────────
    if (search && search.trim()) {
      query.$or = [
        { name:  { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // ── Role filter: frontend sends backend enum values directly ─────────
    // Valid values: 'user' | 'admin' | 'ai_maintainer'
    // 'all' or missing = no filter applied.
    if (role && role !== 'all') {
      query.role = role;
    }

    // ── Department filter ────────────────────────────────────────────────
    if (department && department !== 'all') {
      query.department = department;
    }

    // ── Status filter ────────────────────────────────────────────────────
    if (status && status !== 'all') {
      query.status = status;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')           // never send password hash to frontend
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        users,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unique department values (for filter dropdown)
// @route   GET /api/admin/users/departments
exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await User.distinct('department');
    // Filter out empty strings and sort alphabetically
    const cleaned = departments.filter(d => d && d.trim()).sort();
    res.json({ success: true, data: cleaned });
  } catch (error) {
    next(error);
  }
};


// @desc    Create a new user (admin)
// @route   POST /api/admin/users
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, department, status } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email,
      password: password || 'FlagIt123',
      role: role || 'user',
      department: department || '',
      status: status || 'Active',
    });

    res.status(201).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, password, role, department, status } = req.body;
    const user = await User.findById(req.params.id).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // ── Admin fail-safe: prevent deactivating the last active admin ──────
    if (
      user.role === 'admin' &&
      (status === 'Inactive' || (role && role !== 'admin'))
    ) {
      const activeAdminCount = await User.countDocuments({ role: 'admin', status: 'Active' });
      if (activeAdminCount <= 1) {
        return res.status(403).json({
          success: false,
          message: 'Cannot deactivate or change the role of the last active Admin.',
        });
      }
    }

    // Apply field updates
    if (name)       user.name       = name;
    if (email)      user.email      = email;
    if (role)       user.role       = role;
    if (department !== undefined) user.department = department;
    if (status)     user.status     = status;

    // If a new password was provided, hash it before saving
    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save({ validateModifiedOnly: true });

    // Strip password from response
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ success: true, data: { user: userObj } });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/deactivate user (soft delete)
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // ── Admin fail-safe ──────────────────────────────────────────────────
    if (user.role === 'admin' && user.status === 'Active') {
      const activeAdminCount = await User.countDocuments({ role: 'admin', status: 'Active' });
      if (activeAdminCount <= 1) {
        return res.status(403).json({
          success: false,
          message: 'Cannot deactivate the last active Admin.',
        });
      }
    }

    user.status = 'Inactive';
    await user.save({ validateModifiedOnly: true });

    res.json({ success: true, message: 'User deactivated', data: { user } });
  } catch (error) {
    next(error);
  }
};

// @desc    Permanently delete user
// @route   DELETE /api/admin/users/:id/hard
exports.hardDeleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // ── Admin fail-safe ──────────────────────────────────────────────────
    if (user.role === 'admin') {
      const activeAdminCount = await User.countDocuments({ role: 'admin' });
      if (activeAdminCount <= 1) {
        return res.status(403).json({
          success: false,
          message: 'Cannot delete the last Admin account.',
        });
      }
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'User permanently deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform settings from MongoDB
// @route   GET /api/admin/settings
exports.getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSingleton();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update platform settings — persists to MongoDB
// @route   PUT /api/admin/settings
exports.updateSettings = async (req, res, next) => {
  try {
    // Whitelist of fields admins are allowed to change
    const ALLOWED = [
      'platformName',
      'maintenanceMode',
      'defaultSimulationDifficulty',
      'maxSimulationTime',
      'emailNotifications',
      'sessionTimeoutMinutes',
    ];

    const updates = {};
    ALLOWED.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const settings = await Settings.findOneAndUpdate(
      {},                        // match the singleton
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, message: 'Settings saved.', data: settings });
  } catch (error) {
    next(error);
  }
};
