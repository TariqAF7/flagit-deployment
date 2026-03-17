import { get } from './api';

/** GET /api/users/analytics */
export const fetchUserAnalytics = () => get('/users/analytics');
