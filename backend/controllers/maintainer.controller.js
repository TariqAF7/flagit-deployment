const AIModel = require('../models/AIModel');
const Dataset = require('../models/Dataset');
const GeneratedSample = require('../models/GeneratedSample');

// ========================
// AI MODELS
// ========================

// @desc    Get all AI models
// @route   GET /api/maintainer/models
exports.getModels = async (req, res, next) => {
  try {
    const models = await AIModel.find().sort({ createdAt: -1 });
    res.json({ success: true, data: models });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single AI model
// @route   GET /api/maintainer/models/:id
exports.getModelById = async (req, res, next) => {
  try {
    const model = await AIModel.findById(req.params.id);
    if (!model) {
      return res.status(404).json({ success: false, message: 'Model not found' });
    }
    res.json({ success: true, data: model });
  } catch (error) {
    next(error);
  }
};

// @desc    Trigger model retraining
// @route   POST /api/maintainer/models/:id/retrain
exports.retrainModel = async (req, res, next) => {
  try {
    const model = await AIModel.findById(req.params.id);
    if (!model) {
      return res.status(404).json({ success: false, message: 'Model not found' });
    }

    // Set to Training status
    model.status = 'Training';
    await model.save();

    // Simulate training completion after a delay (in production, this would trigger an ML pipeline)
    setTimeout(async () => {
      try {
        const currentVersion = model.version;
        const parts = currentVersion.replace('v', '').split('.');
        parts[1] = String(parseInt(parts[1]) + 1);
        const newVersion = 'v' + parts.join('.');

        await AIModel.findByIdAndUpdate(model._id, {
          status: 'Active',
          version: newVersion,
          lastTrainedAt: new Date(),
          'metrics.accuracy': Math.min(99, model.metrics.accuracy + Math.random() * 2),
          'metrics.precision': Math.min(99, model.metrics.precision + Math.random() * 2),
          'metrics.recall': Math.min(99, model.metrics.recall + Math.random() * 2),
          'metrics.f1': Math.min(99, model.metrics.f1 + Math.random() * 2),
        });
      } catch (err) {
        console.error('Simulated retrain error:', err);
      }
    }, 5000);

    res.json({
      success: true,
      message: 'Retraining initiated',
      data: model,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get model training logs (stub)
// @route   GET /api/maintainer/models/:id/logs
exports.getModelLogs = async (req, res, next) => {
  try {
    const model = await AIModel.findById(req.params.id);
    if (!model) {
      return res.status(404).json({ success: false, message: 'Model not found' });
    }

    // Stub logs
    const logs = [
      { timestamp: new Date().toISOString(), level: 'INFO', message: `Model ${model.name} loaded successfully` },
      { timestamp: new Date().toISOString(), level: 'INFO', message: `Current version: ${model.version}` },
      { timestamp: new Date().toISOString(), level: 'INFO', message: `Status: ${model.status}` },
    ];

    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

// ========================
// DATASETS
// ========================

// @desc    Get all datasets
// @route   GET /api/maintainer/datasets
exports.getDatasets = async (req, res, next) => {
  try {
    const { search, source } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (source) {
      query.source = source;
    }

    const datasets = await Dataset.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: datasets });
  } catch (error) {
    next(error);
  }
};

// @desc    Create / ingest new dataset
// @route   POST /api/maintainer/datasets
exports.createDataset = async (req, res, next) => {
  try {
    const { name, source, type, size, records } = req.body;

    const dataset = await Dataset.create({
      name,
      description: 'User initiated data ingestion',
      tags: [type || 'CSV'],
      size: `${size} MB`,
      records: String(records),
      source: source || 'API',
      status: 'Processing',
    });

    // Simulate processing completion
    setTimeout(async () => {
      try {
        await Dataset.findByIdAndUpdate(dataset._id, {
          status: 'Active',
          lastUpdated: new Date(),
        });
      } catch (err) {
        console.error('Simulated ingestion error:', err);
      }
    }, 3000);

    res.status(201).json({ success: true, data: dataset });
  } catch (error) {
    next(error);
  }
};

// @desc    Re-ingest existing dataset
// @route   POST /api/maintainer/datasets/:id/ingest
exports.ingestDataset = async (req, res, next) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    if (!dataset) {
      return res.status(404).json({ success: false, message: 'Dataset not found' });
    }

    dataset.status = 'Processing';
    await dataset.save();

    // Simulate processing
    setTimeout(async () => {
      try {
        await Dataset.findByIdAndUpdate(dataset._id, {
          status: 'Active',
          lastUpdated: new Date(),
        });
      } catch (err) {
        console.error('Simulated ingest error:', err);
      }
    }, 3000);

    res.json({ success: true, data: dataset });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete dataset
// @route   DELETE /api/maintainer/datasets/:id
exports.deleteDataset = async (req, res, next) => {
  try {
    const dataset = await Dataset.findByIdAndDelete(req.params.id);
    if (!dataset) {
      return res.status(404).json({ success: false, message: 'Dataset not found' });
    }
    res.json({ success: true, message: 'Dataset deleted' });
  } catch (error) {
    next(error);
  }
};

// ========================
// GENERATED SAMPLES
// ========================

// @desc    Get all generated samples
// @route   GET /api/maintainer/samples
exports.getSamples = async (req, res, next) => {
  try {
    const samples = await GeneratedSample.find()
      .sort({ createdAt: -1 })
      .populate('generatedBy', 'name email');
    res.json({ success: true, data: samples });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate AI phishing samples
// @route   POST /api/maintainer/samples/generate
exports.generateSamples = async (req, res, next) => {
  try {
    const { attackType, tactic, brand, count } = req.body;
    const sampleCount = count || 10;
    const brandText = brand || 'Random Brand';

    const samples = [];
    for (let i = 0; i < sampleCount; i++) {
      samples.push({
        subject: `[${tactic}] Important Update Regarding Your ${brandText} Account`,
        content: `This is an AI generated ${attackType} phishing sample utilizing ${tactic} against ${brandText}. Please click the link to verify your identity.`,
        attackType,
        tactic,
        brand: brandText,
        generatedBy: req.user._id,
      });
    }

    const createdSamples = await GeneratedSample.insertMany(samples);

    res.status(201).json({ success: true, data: createdSamples });
  } catch (error) {
    next(error);
  }
};
