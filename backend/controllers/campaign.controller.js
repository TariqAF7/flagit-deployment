const Campaign = require('../models/Campaign');

// @desc    Get all campaigns (active and past)
// @route   GET /api/admin/campaigns
exports.getAll = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const campaigns = await Campaign.find(query).sort({ createdAt: -1 });

    const active = campaigns.filter((c) => c.status === 'Active' || c.status === 'Paused');
    const past = campaigns.filter((c) => c.status === 'Completed');

    res.json({ success: true, data: { active, past } });
  } catch (error) {
    next(error);
  }
};

// @desc    Create campaign
// @route   POST /api/admin/campaigns
exports.create = async (req, res, next) => {
  try {
    const { name, targetGroup, scenarioType, schedule, simulationIds } = req.body;
    const campaign = await Campaign.create({
      name,
      targetGroup,
      scenarioType,
      schedule,
      simulationIds: simulationIds || [],
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, data: { campaign } });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single campaign
// @route   GET /api/admin/campaigns/:id
exports.getById = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('simulationIds');
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    res.json({ success: true, data: { campaign } });
  } catch (error) {
    next(error);
  }
};

// @desc    Update campaign
// @route   PUT /api/admin/campaigns/:id
exports.update = async (req, res, next) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    res.json({ success: true, data: { campaign } });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete campaign
// @route   DELETE /api/admin/campaigns/:id
exports.delete = async (req, res, next) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    res.json({ success: true, message: 'Campaign deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle pause/resume campaign
// @route   PUT /api/admin/campaigns/:id/pause
exports.togglePause = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    campaign.status = campaign.status === 'Active' ? 'Paused' : 'Active';
    await campaign.save();

    res.json({ success: true, data: { campaign } });
  } catch (error) {
    next(error);
  }
};
