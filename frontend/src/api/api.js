/**
 * Centralized API client for FlagIt.
 *
 * Reads the base URL from VITE_API_URL.
 * Automatically attaches Authorization header from localStorage.
 * Throws a descriptive Error for non-2xx responses.
 */

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api';

const getToken = () => localStorage.getItem('flagit_token');

/**
 * Core request helper.
 * @param {string} endpoint  - Path relative to BASE_URL, e.g. '/auth/login'
 * @param {RequestInit} options - fetch options (method, body, etc.)
 * @returns {Promise<any>}    - Parsed JSON data field
 */
const request = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let body;
  try {
    body = await response.json();
  } catch {
    body = { message: 'Server returned an invalid response' };
  }

  if (!response.ok) {
    const message =
      (body?.errors?.length && body.errors.map((e) => e.message).join(', ')) ||
      body?.message ||
      `HTTP ${response.status}`;
    throw new Error(message);
  }

  return body.data ?? body;
};

export const get = (endpoint) => request(endpoint, { method: 'GET' });

export const post = (endpoint, data) =>
  request(endpoint, { method: 'POST', body: JSON.stringify(data) });

export const put = (endpoint, data) =>
  request(endpoint, { method: 'PUT', body: JSON.stringify(data) });

export const del = (endpoint) => request(endpoint, { method: 'DELETE' });

export const patch = (endpoint, data) =>
  request(endpoint, { method: 'PATCH', body: JSON.stringify(data) });

export default { get, post, put, del, patch };
