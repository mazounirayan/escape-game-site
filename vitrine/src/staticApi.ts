import { localDay } from './booking';

// Static build (GitHub Pages): no server. `/api` requests are answered from a json-server-like
// store kept in this browser's localStorage, shared by the vitrine and the admin (same origin).
export const STATIC_DEMO = import.meta.env.VITE_STATIC_DEMO === '1';

type Item = { id: string } & Record<string, unknown>;
type Db = Record<string, Item[]>;
const KEY = 'evasion-mystique-demo-db';

function seed(): Db {
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const themes = ['Asile', 'Crypte', 'Laboratoire'].map((name, index) => ({ id: String(index + 1), name, salle: index + 1, histoire: `Scénario de démonstration : ${name}.` }));
  return {
    employees: [{ id: 'demo-admin', name: 'Administration démo', email: 'admin@example.com', password: 'demo-password', role: 'admin' }],
    themes,
    sessions: themes.map(theme => ({ id: `demo-${theme.id}`, themeId: theme.id, theme: theme.name, date: `${localDay(tomorrow)}T12:00:00`, duration: 60, price: 25, minParticipants: 3, createdBy: 'demo-admin', availableSlots: ['14:00', '18:00'].map(time => ({ time, maxParticipants: 6, remainingPlaces: 6 })) })),
    reservations: [],
    contacts: []
  };
}

let memory: Db | null = null;
// Read storage on every request: another tab (vitrine or admin) may have written since.
function load(): Db {
  try { const saved = localStorage.getItem(KEY); if (saved) return (memory = JSON.parse(saved) as Db); } catch { /* storage unavailable: keep the demo in memory */ }
  return memory ?? (memory = seed());
}
function save(db: Db) {
  memory = db;
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { /* storage unavailable: keep the demo in memory */ }
}

export function resetStaticDemo() { save(seed()); }

// Without localStorage (blocked by the browser), the vitrine and the admin cannot share bookings.
export function storageAvailable(): boolean {
  try { localStorage.setItem(`${KEY}-probe`, '1'); localStorage.removeItem(`${KEY}-probe`); return true; } catch { return false; }
}

export function demoStatus(): string {
  if (!storageAvailable()) return 'Démo en ligne · stockage bloqué par le navigateur : les réservations de la vitrine ne peuvent pas apparaître ici';
  const count = load().reservations.length;
  return `Démo en ligne · ${count} réservation${count > 1 ? 's' : ''} enregistrée${count > 1 ? 's' : ''} dans ce navigateur`;
}

function answer(request: string, init?: RequestInit): Response {
  const url = new URL(request, location.origin);
  const [collection, id] = url.pathname.replace(/^\/api\/?/, '').split('/');
  const db = load();
  const items = db[collection];
  if (!items) return new Response(null, { status: 404 });
  const method = (init?.method || 'GET').toUpperCase();
  const body = init?.body ? JSON.parse(String(init.body)) as Record<string, unknown> : {};
  const index = id ? items.findIndex(item => String(item.id) === id) : -1;
  if (method === 'GET') {
    if (id) return index < 0 ? new Response(null, { status: 404 }) : Response.json(items[index]);
    const filters = [...url.searchParams];
    return Response.json(items.filter(item => filters.every(([key, value]) => String(item[key]) === value)));
  }
  if (method === 'POST') {
    const item = { ...body, id: String(body.id ?? crypto.randomUUID()) };
    save({ ...db, [collection]: [...items, item] });
    return Response.json(item, { status: 201 });
  }
  if (index < 0) return new Response(null, { status: 404 });
  if (method === 'DELETE') {
    save({ ...db, [collection]: items.filter((_, position) => position !== index) });
    return Response.json({});
  }
  const item = { ...(method === 'PATCH' ? items[index] : {}), ...body, id: items[index].id };
  save({ ...db, [collection]: items.map((current, position) => position === index ? item : current) });
  return Response.json(item);
}

export function installStaticApi({ reloadOnExternalChange = false } = {}) {
  if (!STATIC_DEMO) return;
  // Lists load once on mount; reloading shows a booking made in another tab right away.
  if (reloadOnExternalChange) window.addEventListener('storage', event => { if (event.key === KEY) location.reload(); });
  const realFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const request = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const path = new URL(request, location.origin).pathname;
    return path.startsWith('/api/') || path === '/api' ? answer(request, init) : realFetch(input, init);
  };
}
