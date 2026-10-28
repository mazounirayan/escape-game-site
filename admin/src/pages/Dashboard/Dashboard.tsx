import { Link } from 'react-router-dom';
import { Box, Paper, Typography } from '@mui/material';
import PageLayout from '../../components/PageLayout';
const entries = [
  { title: 'Réservations', description: 'Consultez les demandes et confirmez les équipes.', path: '/Reservation' },
  { title: 'Sessions', description: 'Organisez les dates, les horaires et les jauges.', path: '/sessions' },
  { title: 'Créer une session', description: 'Ouvrez un nouveau créneau pour un scénario.', path: '/create-session' },
  { title: 'Scénarios', description: 'Ajoutez les histoires proposées aux visiteurs.', path: '/themeCreation' },
  { title: 'Équipe', description: 'Retrouvez les membres de votre équipe.', path: '/employees' }
];
export default function Dashboard() {
  return <PageLayout title="Préparez la prochaine aventure" description="Le site public et cet espace partagent les mêmes sessions et réservations."><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0,1fr))', lg: 'repeat(3, minmax(0,1fr))' }, gap: 2 }}>{entries.map(entry => <Paper component={Link} to={entry.path} key={entry.path} variant="outlined" sx={{ p: 3, textDecoration: 'none', color: 'inherit', '&:hover': { borderColor: 'primary.main' } }}><Typography variant="h6">{entry.title}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.8 }}>{entry.description}</Typography></Paper>)}</Box></PageLayout>;
}
