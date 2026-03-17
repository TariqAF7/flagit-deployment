import { get, post, put, del, patch } from './api';

// ── Dashboard ────────────────────────────────────────────────
export const fetchAdminStats = () => get('/admin/stats');

// ── User Management ──────────────────────────────────────────
export const fetchAdminUsers = (params = {}) => {
  // Strip 'all' sentinels — backend treats missing params as "no filter"
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v && v !== 'all')
  );
  const qs = new URLSearchParams(clean).toString();
  return get(`/admin/users${qs ? '?' + qs : ''}`);
};
export const fetchAdminDepartments = () => get('/admin/users/departments');
export const createAdminUser  = (data) => post('/admin/users', data);
export const updateAdminUser  = (id, data) => put(`/admin/users/${id}`, data);
export const deleteAdminUser      = (id) => del(`/admin/users/${id}`);
export const hardDeleteAdminUser  = (id) => del(`/admin/users/${id}/hard`);

// ── Simulations (admin) ──────────────────────────────────────
export const fetchSimulations       = () => get('/admin/simulations');
export const createSimulation       = (data) => post('/admin/simulations', data);
export const updateSimulation       = (id, data) => put(`/admin/simulations/${id}`, data);
export const deleteSimulation       = (id) => del(`/admin/simulations/${id}`);
export const toggleSimulationPause  = (id) => put(`/admin/simulations/${id}/pause`);
export const patchSimulationStatus  = (id, status) => patch(`/admin/simulations/${id}/status`, { status });
export const endSimulation          = (id) => post(`/admin/simulations/${id}/end`);

// ── Reports ──────────────────────────────────────────────────
export const fetchReportTrends = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return get(`/admin/reports/trends${qs ? '?' + qs : ''}`);
};
export const fetchReportPdfData       = () => get('/admin/reports/export/pdf-data');

