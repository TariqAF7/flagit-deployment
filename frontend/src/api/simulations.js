import { get, post } from './api';

/** GET /api/simulations — list all simulations (no email content) */
export const fetchSimulations = () => get('/simulations');

/** GET /api/simulations/:id — single simulation with full email content */
export const fetchSimulationById = (id) => get(`/simulations/${id}`);

/**
 * POST /api/simulations/:id/submit
 * @param {string}          id
 * @param {'phish'|'legit'} choice
 * @param {number}          responseTime  seconds taken
 * @param {boolean}         flagged       true if user clicked the FlagIT report button
 */
export const submitSimulation = (id, choice, responseTime = 0, flagged = false) =>
  post(`/simulations/${id}/submit`, { choice, responseTime, flagged });

/** GET /api/simulations/results/history */
export const fetchHistory = () => get('/simulations/results/history');

/** GET /api/simulations/results/last */
export const fetchLastResult = () => get('/simulations/results/last');
