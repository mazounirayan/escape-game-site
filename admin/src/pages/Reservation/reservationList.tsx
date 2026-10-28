const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Box,
  Button,
  Typography,
  Modal,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';
import PageLayout from '../../components/PageLayout';

const statusLabels: Record<string, { label: string; color: 'success' | 'warning' | 'error' }> = {
  confirmed: { label: 'Confirmé', color: 'success' },
  pending: { label: 'En attente', color: 'warning' },
  cancelled: { label: 'Annulé', color: 'error' },
};

interface Reservation {
  id?: string;
  email: string;
  sessionId: string;
  slot: string;
  participants: number;
  status: string;
}

const ReservationList: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [editReservation, setEditReservation] = useState<Reservation | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch(`${API_URL}/reservations`);
      if (!response.ok) throw new Error("Requete refusee par API.");
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
      window.alert(error instanceof Error ? error.message : "La requete a echoue.");
    }
  };

  const handleDeleteReservation = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/reservations/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('La réservation n’a pas été supprimée.');
      setReservations(prevReservations =>
        prevReservations.filter(reservation => reservation.id !== id)
      );
    } catch (error) {
      console.error('Erreur lors de la suppression de la réservation:', error);
      window.alert(error instanceof Error ? error.message : "La requete a echoue.");
    }
  };

  const handleUpdateStatus = async () => {
    if (editReservation) {
      try {
        const updatedReservation = { ...editReservation, status: newStatus };
        const response = await fetch(`${API_URL}/reservations/${editReservation.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedReservation),
        });
        if (!response.ok) throw new Error("Requete refusee par API.");
        const data = await response.json();
        setReservations(prevReservations =>
          prevReservations.map(reservation =>
            reservation.id === data.id ? data : reservation
          )
        );
        setEditReservation(null);
        setNewStatus('');
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        window.alert(error instanceof Error ? error.message : "La requete a echoue.");
      }
    }
  };

  const handleUpdate = (reservation: Reservation) => {
    setEditReservation(reservation);
    setNewStatus(reservation.status);
  };

  return (
    <PageLayout title="Liste des réservations">
      <Box sx={{ display: 'grid', gap: 2 }}>
        {reservations.map((reservation) => {
          const status = statusLabels[reservation.status] || statusLabels.cancelled;
          return (
            <Paper key={reservation.id} variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h6" component="h2" sx={{ overflowWrap: 'anywhere' }}>{`Réservation de ${reservation.email}`}</Typography>
                <Typography variant="body2" color="text.secondary">Date et heure : {format(new Date(reservation.slot), 'dd/MM/yyyy à HH:mm')}</Typography>
                <Typography variant="body2" color="text.secondary">Nombre de participants : {reservation.participants}</Typography>
                <Chip size="small" variant="outlined" color={status.color} label={status.label} sx={{ mt: 1 }} />
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" onClick={() => handleUpdate(reservation)}>
                  Modifier
                </Button>
                <Button variant="outlined" color="error" onClick={() => handleDeleteReservation(reservation.id!)}>
                  Supprimer
                </Button>
              </Box>
            </Paper>
          );
        })}
      </Box>

      <Modal
        open={!!editReservation}
        onClose={() => setEditReservation(null)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Paper sx={{ p: 3, width: "min(400px, 90vw)" }}>
          <Typography variant="h6" gutterBottom>
            Modifier la réservation
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="status-label">Statut</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Statut"
            >
              <MenuItem value="confirmed">Confirmé</MenuItem>
              <MenuItem value="pending">En attente</MenuItem>
              <MenuItem value="cancelled">Annulé</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" onClick={handleUpdateStatus}>
              Enregistrer
            </Button>
            <Button variant="outlined" color="inherit" onClick={() => setEditReservation(null)}>
              Annuler
            </Button>
          </Box>
        </Paper>
      </Modal>
    </PageLayout>
  );
};

export default ReservationList;
