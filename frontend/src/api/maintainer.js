import { get, post, del } from './api';

// ── AI Models ─────────────────────────────────────────────────
export const fetchModels = () => get('/maintainer/models');
export const retrainModel = (id) => post(`/maintainer/models/${id}/retrain`);
export const fetchModelLogs = (id) => get(`/maintainer/models/${id}/logs`);

// ── Datasets ──────────────────────────────────────────────────
export const fetchDatasets = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return get(`/maintainer/datasets${qs ? '?' + qs : ''}`);
};
export const createDataset = (data) => post('/maintainer/datasets', data);
export const ingestDataset = (id) => post(`/maintainer/datasets/${id}/ingest`);
export const deleteDataset = (id) => del(`/maintainer/datasets/${id}`);

// ── Samples ───────────────────────────────────────────────────
export const fetchSamples = () => get('/maintainer/samples');
export const generateSamples = (data) => post('/maintainer/samples/generate', data);
