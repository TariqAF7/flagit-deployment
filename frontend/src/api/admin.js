import { get, post, put, del } from './api';

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
export const deleteAdminUser  = (id) => del(`/admin/users/${id}`);

// ── Campaigns ────────────────────────────────────────────────
export const fetchCampaigns = () => get('/admin/campaigns');
export const createCampaign = (data) => post('/admin/campaigns', data);
export const updateCampaign = (id, data) => put(`/admin/campaigns/${id}`, data);
export const deleteCampaign = (id) => del(`/admin/campaigns/${id}`);
export const toggleCampaignPause = (id) => put(`/admin/campaigns/${id}/pause`);

// ── Reports ──────────────────────────────────────────────────
export const fetchReportTrends = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return get(`/admin/reports/trends${qs ? '?' + qs : ''}`);
};
