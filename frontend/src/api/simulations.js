import { get, post } from './api';

/** GET /api/simulations — list all simulations (no email content) */
export const fetchSimulations = () => get('/simulations');

/** GET /api/simulations/:id — single simulation with full email content */
export const fetchSimulationById = (id) => get(`/simulations/${id}`);

/** GET /api/simulations/slug/:slug — single simulation by slug with full email content */
export const fetchSimulationBySlug = (slug) => get(`/simulations/slug/${slug}`);

/**
 * POST /api/simulations/:id/submit
 * @param {string}          id
 * @param {'phish'|'legit'} choice
 * @param {number}          responseTime  seconds taken
 * @param {boolean}         flagged       true if user clicked the FlagIT report button
 */
export const submitSimulation = (id, choice, responseTime = 0, flagged = false) =>
  post(`/simulations/${id}/submit`, { choice, responseTime, flagged });

/** POST /api/simulations/:id/start — increment playCount */
export const startSimulation = (id) => post(`/simulations/${id}/start`);

/** GET /api/simulations/user-stats — user stats + learning insights */
export const fetchUserStats = () => get('/simulations/user-stats');

/** GET /api/simulations/results/history */
export const fetchHistory = () => get('/simulations/results/history');

/** GET /api/simulations/results/last */
export const fetchLastResult = () => get('/simulations/results/last');
