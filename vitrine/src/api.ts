import { localDay } from './booking';

const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

// Static build (GitHub Pages): no server, so the demo calendar lives in memory and is lost on reload.
export const STATIC_DEMO = import.meta.env.VITE_STATIC_DEMO === '1';

const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
const store: Record<string, unknown[]> = {
  sessions: ['Asile', 'Crypte', 'Laboratoire'].map((theme, index) => ({ id: `demo-${index + 1}`, themeId: String(index + 1), theme, date: `${localDay(tomorrow)}T12:00:00`, duration: 60, price: 25, minParticipants: 3, createdBy: 'demo-admin', availableSlots: ['14:00', '18:00'].map(time => ({ time, maxParticipants: 6, remainingPlaces: 6 })) })),
  reservations: [],
  contacts: []
};

export async function api(path: string, init?: RequestInit): Promise<Response> {
  if (!STATIC_DEMO) return fetch(`${API_URL}${path}`, init);
  const items = store[path.replace(/^\//, '')];
  if (!items) return new Response(null, { status: 404 });
  if (init?.method === 'POST') {
    const item = { id: crypto.randomUUID(), ...JSON.parse(String(init.body)) };
    items.push(item);
    return Response.json(item, { status: 201 });
  }
  return Response.json(items);
}
