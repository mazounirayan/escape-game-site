import { NavLink } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { useAuth } from '../../pages/Authentication/AuthContext';
const links = [['/', 'Vue d’ensemble'], ['/sessions', 'Sessions'], ['/Reservation', 'Réservations'], ['/create-session', 'Créer une session'], ['/themeCreation', 'Scénarios'], ['/employees', 'Équipe'], ['/employeeForm', 'Ajouter un membre']];
export default function Sidebar() {
  const { logout } = useAuth();
  return <Box component="aside" sx={{ width: { xs: '100%', md: 235 }, flexShrink: 0, borderStyle: 'solid', borderColor: 'divider', borderWidth: 0, borderRightWidth: { md: 1 }, borderBottomWidth: { xs: 1, md: 0 }, p: { xs: 2, md: 3 }, bgcolor: 'background.paper' }}><Typography variant="h5" component="p" sx={{ mb: 0.5 }}>Évasion Mystique</Typography><Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 1.5, md: 3 } }}>Le calendrier de vos aventures</Typography><Box component="nav" aria-label="Gestion" className="admin-navigation">{links.map(([path, label]) => <NavLink key={path} to={path} end={path === '/'}>{label}</NavLink>)}</Box><Button onClick={logout} sx={{ mt: { xs: 1.5, md: 3 } }} color="inherit" variant="outlined" size="small">Se déconnecter</Button></Box>;
}
