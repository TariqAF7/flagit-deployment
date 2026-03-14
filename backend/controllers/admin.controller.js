const User = require('../models/User');
const SimulationResult = require('../models/SimulationResult');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'Active' });

    // Average detection rate across all users
    const users = await User.find({ role: 'user' });
    let totalScore = 0;
    users.forEach((u) => {
      totalScore += u.resilienceScore;
    });
    const avgDetectionRate = users.length > 0 ? Math.round(totalScore / users.length) : 0;

    // Count total incorrect results (simulated "incidents")
    const incidentsReported = await SimulationResult.countDocuments({ isCorrect: false });

    // Org resilience score (average of all user scores)
    const orgResilienceScore = avgDetectionRate;

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        avgDetectionRate,
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
    const { search, role, department, status, page = 1, limit = 20 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) query.role = role;
    if (department) query.department = department;
    if (status) query.status = status;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
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
    const { name, email, role, department, status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, department, status },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/deactivate user
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'Inactive' },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deactivated', data: { user } });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform settings (stub)
// @route   GET /api/admin/settings
exports.getSettings = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        platformName: 'FlagIt',
        maxSimulationTime: 1066,
        emailNotifications: true,
        maintenanceMode: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update platform settings (stub)
// @route   PUT /api/admin/settings
exports.updateSettings = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: 'Settings updated',
      data: req.body,
    });
  } catch (error) {
    next(error);
  }
};
