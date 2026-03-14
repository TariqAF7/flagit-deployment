import { post, get } from './api';

/**
 * POST /api/auth/login
 * @returns {{ user, token }}
 */
export const loginUser = (email, password) =>
  post('/auth/login', { email, password });

/**
 * GET /api/auth/me
 * @returns {{ user }}
 */
export const getMe = () => get('/auth/me');
