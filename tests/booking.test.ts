import assert from 'node:assert/strict';
import test from 'node:test';
import { availableSlots, reservationPayload, validateSession, Session } from '../vitrine/src/booking';
const session: Session = { id: 'demo', date: '2099-07-15T12:00:00', theme: 'Asile', duration: 60, price: 25, minParticipants: 3, availableSlots: [{ time: '18:00', maxParticipants: 6, remainingPlaces: 6 }] };
test('pending/confirmed reservations consume capacity, cancelled and other sessions do not', () => {
  const items = [
    { id: '1', sessionId: 'demo', slot: '2099-07-15T18:00:00', participants: 3, status: 'pending' },
    { id: '2', sessionId: 'demo', slot: '2099-07-15T18:00:00', participants: 2, status: 'cancelled' },
    { id: '3', sessionId: 'other', slot: '2099-07-15T18:00:00', participants: 2, status: 'confirmed' }
  ];
  assert.equal(availableSlots(session, items)[0].remainingPlaces, 3);
});
test('payload matches the admin contract and rejects overflow and fractional counts', () => {
  const customer = { firstName: 'Demo', lastName: 'Guest', email: 'demo@example.com' };
  const payload = reservationPayload(session, session.availableSlots[0], 3, customer);
  assert.equal(payload.sessionId, 'demo'); assert.equal(payload.participants, 3); assert.equal(payload.status, 'pending');
  assert.throws(() => reservationPayload(session, session.availableSlots[0], 7, customer));
  assert.throws(() => reservationPayload(session, session.availableSlots[0], 3.5, customer));
  assert.throws(() => reservationPayload({ ...session, date: '2000-01-01' }, session.availableSlots[0], 3, customer));
});
test('invalid session edits fail before they can corrupt calendar rendering', () => {
  assert.doesNotThrow(() => validateSession(session));
  for (const changes of [{ date: '' }, { date: 'invalid' }, { minParticipants: 3.5 }, { duration: 0 }, { price: NaN }, { availableSlots: [] }, { availableSlots: [{ time: '25:99', maxParticipants: 6, remainingPlaces: 6 }] }, { minParticipants: 7 }, { availableSlots: [session.availableSlots[0], session.availableSlots[0]] }]) {
    assert.throws(() => validateSession({ ...session, ...changes }));
  }
});
