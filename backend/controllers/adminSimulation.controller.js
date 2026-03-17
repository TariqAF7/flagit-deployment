const Simulation = require('../models/Simulation');
const SimulationResult = require('../models/SimulationResult');
const User = require('../models/User');

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Calculate dynamic progress for a simulation by comparing
 * SimulationResult count against the total users in the target group.
 *
 *   progress = (completedResults / totalTargetUsers) * 100
 *
 * If targetGroup is "All Employees" we count every non-admin user.
 * Otherwise we match the department field.
 * Clamps result to 0–100.
 */
async function calcProgress(simulation) {
  const simId = simulation._id;
  const group = simulation.targetGroup || 'All Employees';

  // Count users in the target group (exclude admins — they aren't targets)
  const userQuery = { role: { $ne: 'admin' }, status: 'Active' };
  if (group !== 'All Employees') {
    userQuery.department = group;
  }
  const totalUsers = await User.countDocuments(userQuery);

  if (totalUsers === 0) return 0;

  // Count unique users who have completed this simulation
  const completedUsers = await SimulationResult.distinct('userId', { simulationId: simId });

  return Math.min(100, Math.round((completedUsers.length / totalUsers) * 100));
}

/**
 * Attach dynamic progress to each simulation document.
 * Returns plain objects (not Mongoose docs) with `progress` field.
 */
async function attachProgress(simulations) {
  return Promise.all(
    simulations.map(async (sim) => {
      const obj = sim.toObject ? sim.toObject() : { ...sim };
      obj.progress = await calcProgress(sim);
      return obj;
    })
  );
}

// ─── Controllers ────────────────────────────────────────────────────────────

// @desc    Get all admin simulations (active + past) — with live progress
// @route   GET /api/admin/simulations
exports.getAll = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const simulations = await Simulation.find(query).sort({ createdAt: -1 });

    // Simulations are filtered by status for the admin view
    const activeRaw = simulations.filter(
      (s) => s.status === 'Active' || s.status === 'Paused'
    );
    const pendingRaw = simulations.filter((s) => s.status === 'Pending');
    const pastRaw = simulations.filter((s) => s.status === 'Completed');

    // Attach live progress
    const [active, pending, past] = await Promise.all([
      attachProgress(activeRaw),
      attachProgress(pendingRaw),
      attachProgress(pastRaw),
    ]);

    res.json({ success: true, data: { active, pending, past } });
  } catch (error) {
    next(error);
  }
};

// @desc    Create simulation (admin)
// @route   POST /api/admin/simulations
exports.create = async (req, res, next) => {
  try {
    const {
      name, title, targetGroup, scenarioType,
      schedule, status, category, description,
      difficulty, isPhishing,
      subject, senderName, senderEmail, bodyContent,
    } = req.body;

    const resolvedCategory = category || (scenarioType === 'Normal Awareness' ? 'Normal' : 'Phishing');

    const simulation = await Simulation.create({
      title: title || name,
      description: description || `Targeted ${resolvedCategory.toLowerCase()} simulation for ${targetGroup || 'All Employees'}.`,
      targetGroup: targetGroup || 'All Employees',
      schedule: schedule || null,
      status: status || 'Pending',
      category: resolvedCategory,
      isPhishing: resolvedCategory === 'Phishing',
      difficulty: difficulty || 'Intermediate',
      tags: scenarioType ? [scenarioType] : [],
      emailContent: {
        subject: subject || '',
        senderName: senderName || '',
        senderEmail: senderEmail || '',
        body: bodyContent || '',
      },
    });

    res.status(201).json({ success: true, data: { simulation } });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single simulation
// @route   GET /api/admin/simulations/:id
exports.getById = async (req, res, next) => {
  try {
    const simulation = await Simulation.findById(req.params.id);
    if (!simulation) {
      return res.status(404).json({ success: false, message: 'Simulation not found' });
    }
    const obj = simulation.toObject();
    obj.progress = await calcProgress(simulation);
    res.json({ success: true, data: { simulation: obj } });
  } catch (error) {
    next(error);
  }
};

// @desc    Update simulation
// @route   PUT /api/admin/simulations/:id
exports.update = async (req, res, next) => {
  try {
    const { name, title, scenarioType, category, ...rest } = req.body;
    
    const updateData = { ...rest };
    if (title || name) updateData.title = title || name;
    if (category) {
      updateData.category = category;
      updateData.isPhishing = category === 'Phishing';
    }
    if (scenarioType) updateData.tags = [scenarioType];

    const simulation = await Simulation.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!simulation) {
      return res.status(404).json({ success: false, message: 'Simulation not found' });
    }

    res.json({ success: true, data: { simulation } });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete simulation (admin) — also removes linked results
// @route   DELETE /api/admin/simulations/:id
exports.deleteSimulation = async (req, res, next) => {
  try {
    const simulation = await Simulation.findByIdAndDelete(req.params.id);
    if (!simulation) {
      return res.status(404).json({ success: false, message: 'Simulation not found' });
    }
    // Clean up orphaned results
    await SimulationResult.deleteMany({ simulationId: req.params.id });

    res.json({ success: true, message: 'Simulation deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle pause/resume simulation
// @route   PUT /api/admin/simulations/:id/pause
exports.togglePause = async (req, res, next) => {
  try {
    const simulation = await Simulation.findById(req.params.id);
    if (!simulation) {
      return res.status(404).json({ success: false, message: 'Simulation not found' });
    }

    simulation.status = simulation.status === 'Active' ? 'Paused' : 'Active';
    await simulation.save();

    res.json({ success: true, data: { simulation } });
  } catch (error) {
    next(error);
  }
};

// @desc    Set simulation status explicitly
// @route   PATCH /api/admin/simulations/:id/status
exports.setStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'Active', 'Paused', 'Completed'];
    if (!allowed.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });
    }

    const simulation = await Simulation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!simulation) {
      return res.status(404).json({ success: false, message: 'Simulation not found' });
    }

    res.json({ success: true, data: { simulation } });
  } catch (error) {
    next(error);
  }
};

// @desc    End simulation and save final metrics snapshot
// @route   POST /api/admin/simulations/:id/end
exports.endSimulation = async (req, res, next) => {
  try {
    const simulation = await Simulation.findById(req.params.id);
    if (!simulation) {
      return res.status(404).json({ success: false, message: 'Simulation not found' });
    }

    // Get all results for this simulation
    const results = await SimulationResult.find({ simulationId: simulation._id });
    const totalParticipants = results.length;

    let finalDetectionRate = 0;
    let finalReportingRate = 0;

    if (totalParticipants > 0) {
      const detected = results.filter((r) => r.isCorrect).length;
      const reported = results.filter((r) => r.flagged).length;

      finalDetectionRate = Math.round((detected / totalParticipants) * 100);
      finalReportingRate = Math.round((reported / totalParticipants) * 100);
    }

    // Update simulation with snapshot metrics
    simulation.status = 'Completed';
    simulation.completionDate = new Date();
    simulation.totalParticipants = totalParticipants;
    simulation.finalDetectionRate = finalDetectionRate;
    simulation.finalReportingRate = finalReportingRate;
    simulation.progress = 100; // Force 100 on completion

    await simulation.save();

    res.json({ success: true, data: { simulation: simulation.toObject() } });
  } catch (error) {
    next(error);
  }
};
