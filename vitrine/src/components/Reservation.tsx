import { useEffect, useState, FormEvent } from 'react';
import { api, STATIC_DEMO } from '../api';
import { availableSlots, localDay, reservationPayload, Session, Reservation } from '../booking';
export default function BookingForm() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [sessionId, setSessionId] = useState('');
  const [time, setTime] = useState('');
  const [people, setPeople] = useState(3);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const load = async () => {
    try {
      const [sessionResponse, reservationResponse] = await Promise.all([api('/sessions'), api('/reservations')]);
      if (!sessionResponse.ok || !reservationResponse.ok) throw new Error();
      const data: Session[] = await sessionResponse.json();
      setSessions(data.filter(session => localDay(session.date) >= localDay(new Date())));
      setReservations(await reservationResponse.json());
      setReady(true); setNotice('');
    } catch { setReady(false); setNotice('Le calendrier est indisponible. Démarrez l’API de démonstration et réessayez.'); }
  };
  useEffect(() => { void load(); }, []);
  const session = sessions.find(item => String(item.id) === sessionId);
  const slots = session ? availableSlots(session, reservations).filter(slot => new Date(`${localDay(session.date)}T${slot.time}:00`) > new Date()) : [];
  const slot = slots.find(item => item.time === time);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session || !slot || busy) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setBusy(true); setNotice('');
    try {
      // Refresh availability before sending; json-server remains a local demo, without locking.
      const latest = await api('/reservations');
      if (!latest.ok) throw new Error('Impossible de vérifier les places. Réessayez.');
      const freshReservations: Reservation[] = await latest.json();
      setReservations(freshReservations);
      const freshSlot = availableSlots(session, freshReservations).find(item => item.time === time)!;
      const payload = reservationPayload(session, freshSlot, people, { firstName: String(fields.get('firstName')).trim(), lastName: String(fields.get('lastName')).trim(), email: String(fields.get('email')).trim() });
      const response = await api('/reservations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('La demande n’a pas pu être enregistrée. Réessayez.');
      const reservation: Reservation = await response.json();
      setReservations([...freshReservations, reservation]);
      form.reset(); setTime('');
      setNotice(STATIC_DEMO ? 'Demande enregistrée. Vous pouvez la confirmer dans l’espace de gestion de démo.' : 'Demande enregistrée. Votre réservation est en attente de confirmation dans l’espace de gestion.');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Connexion interrompue. Vérifiez votre réservation avant de réessayer.'); }
    finally { setBusy(false); }
  };
  return <div className="booking-band"><section id="Booking" className="booking section-shell">
    <div><h2>Choisissez votre prochaine évasion.</h2><p>Une session, une équipe, un mystère à résoudre. Les sessions et les places restantes proviennent du calendrier de démonstration : choisissez une session pour voir ses horaires.</p><p className="demo-note">{STATIC_DEMO ? 'Démo en ligne : les données restent dans votre navigateur. Votre demande apparaît dans l’espace de gestion de démo (lien en bas de page). Aucun paiement ni e-mail n’est envoyé.' : 'Démo locale. Aucun paiement ni e-mail de confirmation n’est envoyé.'}</p></div>
    <form onSubmit={submit}>
      <div className="field"><label htmlFor="session">Scénario et date</label><select id="session" value={sessionId} onChange={event => { setSessionId(event.target.value); setTime(''); }} required disabled={!ready || busy}><option value="">Choisir une session</option>{sessions.map(item => <option key={item.id} value={item.id}>{item.theme} · {new Date(item.date).toLocaleDateString('fr-FR')} · {item.price} €/personne</option>)}</select></div>
      {ready && sessions.length === 0 && <p>Aucune session à venir. Ajoutez-en une dans l’espace de gestion.</p>}
      {session && <><fieldset disabled={busy}><legend>Horaire ({session.duration} minutes)</legend><div className="slot-grid">{slots.map(item => <label className={`slot ${time === item.time ? 'selected' : ''}`} key={item.time}><input type="radio" name="time" value={item.time} checked={time === item.time} onChange={() => setTime(item.time)} disabled={item.remainingPlaces < Number(session.minParticipants)} required /><span>{item.time}<small>{item.remainingPlaces} places</small></span></label>)}</div>{slots.length === 0 && <p>Aucun créneau disponible.</p>}</fieldset><div className="field"><label htmlFor="people">Nombre de participants (minimum {session.minParticipants})</label><input id="people" type="number" min={session.minParticipants} max={slot?.remainingPlaces || 10} value={people} onChange={event => setPeople(Number(event.target.value))} required disabled={busy} /></div></>}
      <div className="field-pair"><label>Prénom<input name="firstName" autoComplete="given-name" required maxLength={80} disabled={busy} /></label><label>Nom<input name="lastName" autoComplete="family-name" required maxLength={80} disabled={busy} /></label></div>
      <label>E-mail<input name="email" type="email" autoComplete="email" required maxLength={200} disabled={busy} /></label>
      {session && slot && <p className="booking-total">Total indicatif <strong>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(session.price) * people)}</strong></p>}
      {ready && !slot && !busy && <p className="form-hint" id="submit-hint">{session ? 'Choisissez un horaire pour continuer.' : 'Choisissez une session pour continuer.'}</p>}
      <button className="primary-button" disabled={!slot || busy || !ready} aria-describedby={ready && !slot ? 'submit-hint' : undefined}>{busy ? 'Enregistrement…' : 'Demander une réservation'}</button>
      {notice && <p className="form-notice" role="status">{notice}</p>}{!ready && <button className="text-button" type="button" onClick={() => void load()}>Recharger le calendrier</button>}
    </form>
  </section></div>;
}
