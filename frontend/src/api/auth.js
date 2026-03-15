import { post, get } from './api';

/**
 * POST /api/auth/login
 * @returns {{ user, token }}
 */
export const loginUser = (email, password) =>
  post('/auth/login', { email, password });

/**
 * POST /api/auth/register
 * @returns {{ user, token }}
 */
export const registerUser = (name, email, password) =>
  post('/auth/register', { name, email, password });

/**
 * GET /api/auth/me
 * @returns {{ user }}
 */
export const getMe = () => get('/auth/me');
