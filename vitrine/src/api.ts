export { STATIC_DEMO } from './staticApi';

const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export function api(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API_URL}${path}`, init);
}
