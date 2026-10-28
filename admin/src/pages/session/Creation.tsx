const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
import React, { useState, useEffect } from 'react';
import { validateSession } from '../../../../vitrine/src/booking';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import 'moment/locale/fr'; 
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { toastStyle } from '../../components/theme/theme';
import { TextField, Button, MenuItem, Select, SelectChangeEvent, InputLabel, FormControl, Box, Typography } from '@mui/material';
import PageLayout from '../../components/PageLayout';

interface Theme {
  id: string;
  name: string;
  salle: number;
  histoire: string;
  photo?: string;
}

interface SessionForm {
  themeId: string;
  date: Date | null;
  duration: number;
  price: number;
  minParticipants: number;
  availableSlots: string[];
  createdBy: number;
}

const CreateSession: React.FC = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [sessionForm, setSessionForm] = useState<SessionForm>({
    themeId: "0",
    date: new Date(),
    duration: 0,
    price: 0,
    minParticipants: 0,
    availableSlots: [moment().format('HH:mm')],
    createdBy: 1
  });

  useEffect(() => {
    fetch(`${API_URL}/themes`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setThemes(data))
      .catch(error => {
        console.error('Erreur lors de la récupération des thèmes:', error);
        Toastify({
          text: 'Erreur lors de la récupération des thèmes.',
          duration: 3000,
          style: toastStyle.error,
        }).showToast();
      });
  }, []);

  const handleSessionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setSessionForm(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSlotChange = (index: number, value: string) => {
    const slots = [...sessionForm.availableSlots];
    slots[index] = value;
    setSessionForm(prevState => ({ ...prevState, availableSlots: slots }));
  };

  const handleAddSlot = () => {
    setSessionForm(prevState => ({
      ...prevState,
      availableSlots: [...prevState.availableSlots, moment().format('HH:mm')]
    }));
  };

  const handleRemoveSlot = (index: number) => {
    const slots = sessionForm.availableSlots.filter((_, i) => i !== index);
    setSessionForm(prevState => ({ ...prevState, availableSlots: slots }));
  };

  const handleDateChange = (date: Date | null) => {
    setSessionForm(prevState => ({ ...prevState, date }));
  };

  const handleSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { themeId, duration, price, minParticipants, availableSlots } = sessionForm;
    const payload = { ...sessionForm, date: sessionForm.date?.toISOString() || '', theme: themes.find(theme => String(theme.id) === String(themeId))?.name, duration: Number(duration), price: Number(price), minParticipants: Number(minParticipants), availableSlots: availableSlots.map(time => ({ time, maxParticipants: 10, remainingPlaces: 10 })) };
    try { validateSession(payload); }
    catch (error) { window.alert(error instanceof Error ? error.message : 'Session invalide.'); return; }
    if (!themes.some(theme => String(theme.id) === String(themeId))) {
      Toastify({
        text: 'Choisissez un scénario.',
        duration: 3000,
        style: toastStyle.error,
      }).showToast();
      return;
    }

    fetch(`${API_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(newSession => {
        console.log('Session créée:', newSession);
        Toastify({
          text: 'Session créée avec succès!',
          duration: 3000,
          style: toastStyle.success,
        }).showToast();
       
        setSessionForm({
          themeId: "0",
          date: new Date(),
          duration: 0,
          price: 0,
          minParticipants: 0,
          availableSlots: [moment().format('HH:mm')],
          createdBy: 1 
        });
      })
      .catch(error => {
        console.error('Erreur lors de la création de la session:', error);
        Toastify({
          text: 'Erreur lors de la création de la session.',
          duration: 3000,
          style: toastStyle.error,
        }).showToast();
      });
  };

  return (
    <PageLayout title="Créer une session" maxWidth={640}>
      <form onSubmit={handleSessionSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="theme-label">Scénario</InputLabel>
          <Select
            labelId="theme-label"
            label="Scénario"
            name="themeId"
            value={sessionForm.themeId}
            onChange={handleSessionChange}
            required
          >
            <MenuItem value={0}>Choisir un scénario</MenuItem>
            {themes.map(theme => (
              <MenuItem key={theme.id} value={theme.id}>{theme.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <DatePicker
            selected={sessionForm.date}
            dateFormat="dd/MM/yyyy"
            onChange={(date: Date | null) => handleDateChange(date)}
            customInput={<TextField fullWidth label="Date" />}
            required
          />
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          type="number"
          name="duration"
          label="Durée (minutes)"
          value={sessionForm.duration}
          onChange={handleSessionChange}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          type="number"
          name="price"
          label="Prix (€)"
          value={sessionForm.price}
          onChange={handleSessionChange}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          type="number"
          name="minParticipants"
          label="Participants minimum"
          value={sessionForm.minParticipants}
          onChange={handleSessionChange}
          required
        />

        <Typography variant="h6" component="h2" sx={{ mt: 2 }} gutterBottom>
          Créneaux disponibles
        </Typography>
        {sessionForm.availableSlots.map((slot, index) => (
          <Box key={index} display="flex" alignItems="center" marginBottom={1}>
            <TextField
              fullWidth
              value={slot}
              onChange={(e) => handleSlotChange(index, e.target.value)}
              required
            />
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleRemoveSlot(index)}
              aria-label="Supprimer le créneau"
              sx={{ ml: 2, minWidth: 48, height: 56 }}
            >
              ✕
            </Button>
          </Box>
        ))}
        <Button
          variant="outlined"
          onClick={handleAddSlot}
          sx={{ mt: 2 }}
        >
          Ajouter un créneau
        </Button>

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 4, display: 'block' }}
        >
          Sauvegarder
        </Button>
      </form>
    </PageLayout>
  );
};

export default CreateSession;
