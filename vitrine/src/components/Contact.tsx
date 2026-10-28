import { FormEvent, useState } from 'react';
import { api, STATIC_DEMO } from '../api';
export default function Contact() {
  const [notice, setNotice] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
    setBusy(true); setNotice('');
    try {
      const response = await api('/contacts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(data)) });
      if (!response.ok) throw new Error();
      form.reset(); setNotice(STATIC_DEMO ? 'Message enregistré dans votre navigateur. Aucun e-mail n’a été envoyé.' : 'Message enregistré dans la démo. Aucun e-mail n’a été envoyé.');
    } catch { setNotice('Message non enregistré. Vérifiez que l’API est démarrée puis réessayez.'); }
    finally { setBusy(false); }
  };
  return <section id="contact" className="contact section-shell"><div><h2>Une question<br />avant de jouer ?</h2><p>Laissez un message dans la démonstration.</p></div><form onSubmit={submit}><label>Votre nom<input name="name" autoComplete="name" required maxLength={120} disabled={busy} /></label><label>E-mail<input name="email" type="email" autoComplete="email" required maxLength={200} disabled={busy} /></label><label>Votre message<textarea name="message" required maxLength={2000} rows={4} disabled={busy} /></label><button className="primary-button" disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer le message'}</button><p role="status">{notice}</p></form></section>;
}
