const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
import React, { useState } from 'react';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { toastStyle } from '../../components/theme/theme';
import {
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Alert
} from '@mui/material';
import PageLayout from '../../components/PageLayout';

const EmployeeForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newEmployee = {
      name,
      email,
      role,
      password,
    };

    try {
      const response = await fetch(`${API_URL}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });

      if (response.ok) {
        if (password.length >= 8) {
          Toastify({
            text: 'Employé créé avec succès !',
            duration: 3000,
            style: toastStyle.success,
          }).showToast();
          setName('');
          setEmail('');
          setPassword('');
          setError(null);
        } else {
          setError('Le mot de passe doit contenir au moins 8 caractères.');
          Toastify({
            text: 'Le mot de passe doit contenir au moins 8 caractères.',
            duration: 3000,
            style: toastStyle.error,
          }).showToast();
        }
      } else {
        throw new Error('Erreur lors de la création de l\'employé.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la communication avec le serveur.');
      Toastify({
        text: 'Erreur lors de la communication avec le serveur.',
        duration: 3000,
        style: toastStyle.error,
      }).showToast();
    }
  };

  return (
    <PageLayout title="Ajouter un membre" description="Créez un compte pour un nouveau membre de l’équipe." maxWidth={640}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Box>

        <Box mb={2}>
          <FormControl fullWidth>
            <InputLabel id="role-label">Rôle</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="Rôle"
              required
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="staff">Personnel</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Box>

        <Button type="submit" variant="contained">
          Créer le membre
        </Button>
      </form>
    </PageLayout>
  );
};

export default EmployeeForm;
