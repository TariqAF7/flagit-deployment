import { get } from './api';

/** GET /api/modules — returns array of module objects */
export const fetchModules = () => get('/modules');
