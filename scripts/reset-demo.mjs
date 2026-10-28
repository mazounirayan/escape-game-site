import { mkdir, writeFile } from 'node:fs/promises';
const localDay = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const themes = ['Asile', 'Crypte', 'Laboratoire'].map((name, index) => ({ id: String(index + 1), name, salle: index + 1, histoire: `Scénario de démonstration : ${name}.` }));
const date = new Date(); date.setDate(date.getDate() + 1);
const db = {
  employees: [{ id: 'demo-admin', name: 'Administration démo', email: 'admin@example.com', password: 'demo-password', role: 'admin' }],
  themes,
  sessions: themes.map(theme => ({ id: `demo-${theme.id}`, themeId: theme.id, theme: theme.name, date: `${localDay(date)}T12:00:00`, duration: 60, price: 25, minParticipants: 3, createdBy: 'demo-admin', availableSlots: ['14:00', '18:00'].map(time => ({ time, maxParticipants: 6, remainingPlaces: 6 })) })),
  reservations: [], contacts: []
};
await mkdir(new URL('../admin/data/', import.meta.url), { recursive: true });
await writeFile(new URL('../admin/data/db.json', import.meta.url), JSON.stringify(db, null, 2) + '\n');
console.log('Fixtures fictives réinitialisées. Sessions datées de demain ; réservations et messages effacés.');

