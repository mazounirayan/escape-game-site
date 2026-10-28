import { FormEvent, useState } from 'react';
import { Alert, Box, TextField, Button } from '@mui/material';
import PageLayout from '../../components/PageLayout';
const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
export default function CreateTheme() {
  const [form, setForm] = useState({ name: '', salle: '', histoire: '', photo: '' });
  const [notice, setNotice] = useState(''); const [failed, setFailed] = useState(false); const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.histoire.trim() || !Number.isInteger(Number(form.salle)) || Number(form.salle) < 1) { setFailed(true); setNotice('Indiquez un nom, une histoire et un numéro de salle entier positif.'); return; }
    setBusy(true); setNotice('');
    try {
      const response = await fetch(`${API_URL}/themes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, name: form.name.trim(), histoire: form.histoire.trim(), salle: Number(form.salle) }) });
      if (!response.ok) throw new Error();
      setForm({ name: '', salle: '', histoire: '', photo: '' }); setFailed(false); setNotice('Scénario créé. Vous pouvez maintenant lui ajouter une session.');
    } catch { setFailed(true); setNotice('Le scénario n’a pas été enregistré. Vérifiez que l’API est démarrée et réessayez.'); }
    finally { setBusy(false); }
  };
  const field = (name: keyof typeof form, value: string) => setForm(previous => ({ ...previous, [name]: value }));
  return <PageLayout title="Créer un scénario" description="Définissez son histoire avant d’ouvrir des sessions." maxWidth={640}><Box component="form" onSubmit={submit} sx={{ display: 'grid', gap: 2 }}><TextField label="Nom du scénario" value={form.name} onChange={event => field('name', event.target.value)} required disabled={busy} inputProps={{ maxLength: 120 }} /><TextField label="Numéro de salle" type="number" value={form.salle} onChange={event => field('salle', event.target.value)} required disabled={busy} inputProps={{ min: 1, step: 1 }} /><TextField label="Histoire" multiline minRows={4} value={form.histoire} onChange={event => field('histoire', event.target.value)} required disabled={busy} inputProps={{ maxLength: 2000 }} /><TextField label="Adresse de la photo (facultatif)" type="url" value={form.photo} onChange={event => field('photo', event.target.value)} disabled={busy} />{notice && <Alert severity={failed ? 'error' : 'success'}>{notice}</Alert>}<Button variant="contained" type="submit" disabled={busy}>{busy ? 'Enregistrement…' : 'Créer le scénario'}</Button></Box></PageLayout>;
}
