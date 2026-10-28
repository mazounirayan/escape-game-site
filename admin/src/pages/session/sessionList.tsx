const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { Box, Paper, Chip, Typography, Button, MenuItem, Select, InputLabel, FormControl, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PageLayout from '../../components/PageLayout';

import { availableSlots, localDay, validateSession, Reservation, Session } from '../../../../vitrine/src/booking';

interface Theme {
  id: string;
  name: string;
  salle: number;
  histoire: string;
  photo?: string;
}

const SessionList: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filterTheme, setFilterTheme] = useState<string>('');
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [editSession, setEditSession] = useState<Session | null>(null);
  const [newSlot, setNewSlot] = useState<string>('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddSlotDialog, setOpenAddSlotDialog] = useState(false);

  useEffect(() => {
    fetchData(`${API_URL}/sessions`, setSessions);
    fetchData(`${API_URL}/reservations`, setReservations);
  }, []);

  useEffect(() => {
    fetchData(`${API_URL}/themes`, setThemes);
  }, []);

  const fetchData = async (url: string, setter: React.Dispatch<React.SetStateAction<any>>) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Requete refusee par API.");
      const data = await response.json();
      setter(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      window.alert(error instanceof Error ? error.message : "La requete a echoue.");
    }
  };

  const handleFilter = async () => {
    try {
      const response = await fetch(`${API_URL}/sessions`);
      if (!response.ok) throw new Error();
      const data: Session[] = await response.json();
      setSessions(data.filter(session => (!filterTheme || session.theme === filterTheme) && (!filterDate || localDay(session.date) === localDay(filterDate))));
    } catch { window.alert('Impossible de filtrer les sessions. Vérifiez que l’API est démarrée.'); }
  };

  const handleDeleteSession = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/sessions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('La session n’a pas été supprimée.');
      setSessions((prevSessions) => prevSessions.filter((session) => session.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de la séance:', error);
      window.alert(error instanceof Error ? error.message : "La requete a echoue.");
    }
  };

  const handleDeleteSlot = async (sessionId: string, slotIndex: number) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      const updatedSlots = session.availableSlots.filter((_, index) => index !== slotIndex);
      const updatedSession = { ...session, availableSlots: updatedSlots };

      try {
        validateSession(updatedSession);
        const response = await fetch(`${API_URL}/sessions/${sessionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedSession),
        });
        if (!response.ok) throw new Error("Requete refusee par API.");
        const data = await response.json();
        setSessions((prevSessions) => prevSessions.map((session) => (session.id === data.id ? data : session)));
      } catch (error) {
        console.error('Erreur lors de la suppression du créneau:', error);
        window.alert(error instanceof Error ? error.message : "La requete a echoue.");
      }
    }
  };

  const handleUpdate = (session: Session) => {
    setEditSession(session);
    setOpenEditDialog(true);
  };

  const handleSaveUpdate = async () => {
    if (editSession) {
      try {
        validateSession(editSession);
        const response = await fetch(`${API_URL}/sessions/${editSession.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editSession),
        });
        if (!response.ok) throw new Error("Requete refusee par API.");
        const updatedSession = await response.json();
        setSessions((prevSessions) => prevSessions.map((session) => (session.id === updatedSession.id ? updatedSession : session)));
        setEditSession(null);
        setOpenEditDialog(false);
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la séance:', error);
        window.alert(error instanceof Error ? error.message : "La requete a echoue.");
      }
    }
  };

  const handleAddSlot = (id: string) => {
    const session = sessions.find((s) => s.id === id);
    if (session) {
      setEditSession(session);
      setOpenAddSlotDialog(true);
    }
  };

  const handleSaveSlot = async () => {
    if (editSession) {
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(newSlot) || editSession.availableSlots.some(slot => slot.time === newSlot)) { window.alert('Choisissez un horaire unique au format HH:mm.'); return; }
      const updatedSlots = [...editSession.availableSlots, { time: newSlot, maxParticipants: 10, remainingPlaces: 10 }];
      const updatedSession = { ...editSession, availableSlots: updatedSlots };

      try {
        validateSession(updatedSession);
        const response = await fetch(`${API_URL}/sessions/${editSession.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedSession),
        });
        if (!response.ok) throw new Error("Requete refusee par API.");
        const data = await response.json();
        setSessions((prevSessions) => prevSessions.map((session) => (session.id === data.id ? data : session)));
        setEditSession(null);
        setNewSlot('');
        setOpenAddSlotDialog(false);
      } catch (error) {
        console.error('Erreur lors de l\'ajout du créneau:', error);
        window.alert(error instanceof Error ? error.message : "La requete a echoue.");
      }
    }
  };

  return (
    <PageLayout title="Sessions">
      <Box mb={3} display="flex" alignItems="center" gap={2} flexWrap="wrap">
        <FormControl variant="outlined" sx={{ flex: '1 1 220px' }}>
          <InputLabel>Scénario</InputLabel>
          <Select
            value={filterTheme}
            onChange={(e) => setFilterTheme(e.target.value)}
            label="Scénario"
          >
            <MenuItem value="">Tous les scénarios</MenuItem>
            {themes.map((theme) => (
              <MenuItem key={theme.id} value={theme.name}>{theme.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ flex: '1 1 220px' }}>
        <DatePicker
          selected={filterDate}
          onChange={(date) => setFilterDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Sélectionner une date"
          className="react-datepicker-wrapper"
          customInput={
            <TextField
              variant="outlined"
              fullWidth
              label="Date"
              InputLabelProps={{ shrink: true }}
            />
          }
        />
        </Box>
        <Button variant="contained" size="large" onClick={handleFilter}>
          Filtrer
        </Button>
      </Box>

      <Box>
        {sessions.map((session) => (
          <Paper key={session.id} variant="outlined" sx={{ mb: 2, p: 2 }}>
            <Typography variant="h6" component="h2">{session.theme}</Typography>
            <Typography color="text.secondary">Date : {format(new Date(session.date), 'dd/MM/yyyy')}</Typography>
            <Typography color="text.secondary">Durée : {session.duration} minutes</Typography>
            <Typography color="text.secondary">Prix : {session.price} €</Typography>
            <Typography color="text.secondary">Participants minimum : {session.minParticipants}</Typography>
            <Box sx={{ mt: 1 }}><Typography>Créneaux disponibles :</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
              {availableSlots(session, reservations).map((slot, index) => (
                <Chip
                  key={index}
                  variant="outlined"
                  label={`${slot.time} (${slot.remainingPlaces}/${slot.maxParticipants})`}
                  onDelete={() => handleDeleteSlot(session.id!, index)}
                  deleteIcon={<DeleteIcon aria-label="Supprimer le créneau" />}
                />
              ))}
              </Box>
            </Box>
            <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
              <Button variant="outlined" onClick={() => handleUpdate(session)} startIcon={<EditIcon />}>
                Modifier
              </Button>
              <Button variant="outlined" onClick={() => handleAddSlot(session.id!)} startIcon={<AddCircleIcon />}>
                Ajouter un créneau
              </Button>
              <Button variant="outlined" color="error" onClick={() => handleDeleteSession(session.id!)} startIcon={<DeleteIcon />}>
                Supprimer
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Modifier la session</DialogTitle>
        <DialogContent>
          {editSession && (
            <>
              <TextField
                fullWidth
                label="Scénario"
                value={editSession.theme}
                onChange={(e) => setEditSession({ ...editSession, theme: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Durée (minutes)"
                type="number"
                value={editSession.duration}
                onChange={(e) => setEditSession({ ...editSession, duration: parseInt(e.target.value) })}
                margin="normal"
              />
              <DatePicker
                selected={editSession.date ? new Date(editSession.date) : null}
                onChange={(date: Date | null) => setEditSession({ ...editSession, date: date ? date.toISOString() : '' })}
                dateFormat="dd/MM/yyyy"
                customInput={
                  <TextField
                    fullWidth
                    label="Date"
                    InputLabelProps={{ shrink: true }}
                  />
                }
              />
              <TextField
                fullWidth
                label="Prix (€)"
                type="number"
                value={editSession.price}
                onChange={(e) => setEditSession({ ...editSession, price: parseFloat(e.target.value) })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Participants minimum"
                type="number"
                value={editSession.minParticipants}
                onChange={(e) => setEditSession({ ...editSession, minParticipants: parseInt(e.target.value) })}
                margin="normal"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="inherit">Annuler</Button>
          <Button onClick={handleSaveUpdate} variant="contained">Enregistrer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddSlotDialog} onClose={() => setOpenAddSlotDialog(false)}>
        <DialogTitle>Ajouter un créneau</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Créneau"
            value={newSlot}
            onChange={(e) => setNewSlot(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddSlotDialog(false)} color="inherit">Annuler</Button>
          <Button onClick={handleSaveSlot} variant="contained">Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};

export default SessionList;
