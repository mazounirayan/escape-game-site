import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useAuth } from './AuthContext';
export default function SignIn() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const { login } = useAuth(); const navigate = useNavigate();
  const submit = async (event: FormEvent) => { event.preventDefault(); setBusy(true); setError(''); try { await login(email, password); navigate('/'); } catch { setError('Connexion impossible. Vérifiez le compte de démo et que l’API est démarrée.'); } finally { setBusy(false); } };
  return <Box sx={{ minHeight: '85dvh', display: 'grid', placeItems: 'center', px: 2 }}><Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 }, width: '100%', maxWidth: 440 }}><Typography variant="h4" component="h1">Évasion Mystique</Typography><Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>Votre espace de gestion</Typography><Alert severity="info" sx={{ mb: 3 }}>Démo locale : admin@example.com / demo-password. Cette connexion n’est pas une protection pour un site public.</Alert><Box component="form" onSubmit={submit} sx={{ display: 'grid', gap: 2 }}><TextField label="E-mail" type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="username" required disabled={busy} /><TextField label="Mot de passe" type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required disabled={busy} />{error && <Alert severity="error">{error}</Alert>}<Button type="submit" variant="contained" disabled={busy}>{busy ? 'Connexion…' : 'Ouvrir l’espace de gestion'}</Button></Box></Paper></Box>;
}
