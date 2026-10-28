const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Modal,
  Paper,
  IconButton,
  Alert,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PageLayout from '../../components/PageLayout';

const roleLabels: Record<string, string> = { admin: 'Admin', staff: 'Personnel' };

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  password: string;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filterRole, setFilterRole] = useState<string>('');
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData(`${API_URL}/employees`, setEmployees);
  }, []);

  const fetchData = async (url: string, setter: React.Dispatch<React.SetStateAction<any>>) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Requete refusee par API.");
      const data = await response.json();
      setter(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  const handleFilter = () => {
    let url = `${API_URL}/employees`;
    if (filterRole) {
      url += `?role=${encodeURIComponent(filterRole)}`;
    }
    fetchData(url, setEmployees);
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/employees/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Le membre n’a pas été supprimé.');
      setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'employé:', error);
      setError('Erreur lors de la suppression de l\'employé.');
    }
  };

  const handleUpdate = (employee: Employee) => {
    setEditEmployee(employee);
    setOpenModal(true);
  };

  const handleSaveUpdate = async () => {
    if (editEmployee) {
      try {
        const response = await fetch(`${API_URL}/employees/${editEmployee.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editEmployee),
        });
        if (!response.ok) throw new Error("Requete refusee par API.");
        const updatedEmployee = await response.json();
        setEmployees((prevEmployees) =>
          prevEmployees.map((employee) => (employee.id === updatedEmployee.id ? updatedEmployee : employee))
        );
        setEditEmployee(null);
        setOpenModal(false);
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'employé:', error);
        setError('Erreur lors de la mise à jour de l\'employé.');
      }
    }
  };

  return (
    <PageLayout title="Équipe">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Rôle</InputLabel>
          <Select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            label="Rôle"
          >
            <MenuItem value="">Tous les rôles</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="staff">Personnel</MenuItem>
          </Select>
        </FormControl>
        <Button onClick={handleFilter} variant="contained" size="large">
          Filtrer
        </Button>
      </Box>
      <Box sx={{ display: 'grid', gap: 2 }}>
        {employees.map((employee) => (
          <Paper key={employee.id} variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" component="h2">{employee.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>{employee.email}</Typography>
              <Chip size="small" variant="outlined" label={roleLabels[employee.role] || employee.role} sx={{ mt: 1 }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={() => handleUpdate(employee)} variant="outlined">
                Modifier
              </Button>
              <Button onClick={() => handleDeleteEmployee(employee.id)} variant="outlined" color="error">
                Supprimer
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Paper sx={{ p: 3, width: 'min(500px, 90vw)', position: 'relative', maxHeight: '90dvh', overflow: 'auto' }}>
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            Modifier le membre
          </Typography>
          <IconButton
            onClick={() => setOpenModal(false)}
            sx={{ position: 'absolute', top: 10, right: 10 }}
            aria-label="Fermer"
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Nom"
              value={editEmployee?.name || ''}
              onChange={(e) => setEditEmployee({ ...editEmployee!, name: e.target.value })}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="E-mail"
              type="email"
              value={editEmployee?.email || ''}
              onChange={(e) => setEditEmployee({ ...editEmployee!, email: e.target.value })}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Rôle</InputLabel>
              <Select
                value={editEmployee?.role || ''}
                onChange={(e) => setEditEmployee({ ...editEmployee!, role: e.target.value })}
                label="Rôle"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="staff">Personnel</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              value={editEmployee?.password || ''}
              onChange={(e) => setEditEmployee({ ...editEmployee!, password: e.target.value })}
            />
          </Box>
          <Button onClick={handleSaveUpdate} variant="contained" sx={{ mr: 1 }}>
            Sauvegarder
          </Button>
          <Button onClick={() => setOpenModal(false)} variant="outlined" color="inherit">
            Annuler
          </Button>
        </Paper>
      </Modal>
    </PageLayout>
  );
};

export default EmployeeList;
