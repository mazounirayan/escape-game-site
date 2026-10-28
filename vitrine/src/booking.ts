export interface Slot { time: string; maxParticipants: number; remainingPlaces: number }
export interface Session { id: string; date: string; theme: string; price: number; duration: number; minParticipants: number; availableSlots: Slot[] }
export interface Reservation { id: string; sessionId: string; slot: string; participants: number; status: string }
export function validateSession(session: Pick<Session, 'date' | 'duration' | 'price' | 'minParticipants' | 'availableSlots'>): void {
  if (!session.date || Number.isNaN(new Date(session.date).getTime())) throw new Error('Choisissez une date valide.');
  if (!Number.isInteger(session.duration) || session.duration < 1 || !Number.isFinite(session.price) || session.price <= 0) throw new Error('La durée doit être un nombre entier positif et le prix supérieur à zéro.');
  if (!Number.isInteger(session.minParticipants) || session.minParticipants < 1) throw new Error('Le minimum de participants doit être un entier positif.');
  if (!session.availableSlots.length || new Set(session.availableSlots.map(slot => slot.time)).size !== session.availableSlots.length) throw new Error('Ajoutez au moins un horaire, sans doublon.');
  for (const slot of session.availableSlots) {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(slot.time) || !Number.isInteger(slot.maxParticipants) || slot.maxParticipants < session.minParticipants) throw new Error('Chaque horaire doit être au format HH:mm, avec une capacité suffisante.');
  }
}
export function localDay(value: string | Date): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function availableSlots(session: Session, reservations: Reservation[]): Slot[] {
  return session.availableSlots.map(slot => {
    const reserved = reservations.filter(item => {
      const date = new Date(item.slot);
      const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      return String(item.sessionId) === String(session.id) && item.status !== 'cancelled' && localDay(item.slot) === localDay(session.date) && time === slot.time;
    }).reduce((sum, item) => sum + Number(item.participants), 0);
    return { ...slot, remainingPlaces: Math.max(0, Number(slot.maxParticipants) - reserved) };
  });
}
export function reservationPayload(session: Session, slot: Slot, participants: number, customer: { firstName: string; lastName: string; email: string }) {
  if (!Number.isInteger(participants) || participants < Number(session.minParticipants) || participants > slot.remainingPlaces) throw new Error(`Choisissez entre ${session.minParticipants} et ${slot.remainingPlaces} participants.`);
  const date = new Date(`${localDay(session.date)}T${slot.time}:00`);
  if (Number.isNaN(date.getTime()) || date <= new Date()) throw new Error('Ce créneau est passé. Choisissez une autre session.');
  return { ...customer, sessionId: session.id, slot: date.toISOString(), participants, status: 'pending' };
}
