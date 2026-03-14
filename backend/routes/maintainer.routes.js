const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/rbac');
const {
  getModels,
  getModelById,
  retrainModel,
  getModelLogs,
  getDatasets,
  createDataset,
  ingestDataset,
  deleteDataset,
  getSamples,
  generateSamples,
} = require('../controllers/maintainer.controller');

// AI Models
router.get('/models', auth, authorize('ai_maintainer'), getModels);
router.get('/models/:id', auth, authorize('ai_maintainer'), getModelById);
router.post('/models/:id/retrain', auth, authorize('ai_maintainer'), retrainModel);
router.get('/models/:id/logs', auth, authorize('ai_maintainer'), getModelLogs);

// Datasets
router.get('/datasets', auth, authorize('ai_maintainer'), getDatasets);
router.post('/datasets', auth, authorize('ai_maintainer'), createDataset);
router.post('/datasets/:id/ingest', auth, authorize('ai_maintainer'), ingestDataset);
router.delete('/datasets/:id', auth, authorize('ai_maintainer'), deleteDataset);

// Sample Generator
router.get('/samples', auth, authorize('ai_maintainer'), getSamples);
router.post('/samples/generate', auth, authorize('ai_maintainer'), generateSamples);

module.exports = router;
