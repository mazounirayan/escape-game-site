import { useContext } from 'react';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { ColorModeContext } from '../theme/theme';
import { demoStatus, STATIC_DEMO } from '../../../../vitrine/src/staticApi';
export default function Topbar() {
  const theme = useTheme(); const { toggleColorMode } = useContext(ColorModeContext);
  return <Box component="header" display="flex" justifyContent="space-between" alignItems="center" px={{ xs: 2, md: 3 }} py={1.5} borderBottom="1px solid" borderColor="divider"><Typography variant="body2" color="text.secondary">{STATIC_DEMO ? demoStatus() : 'Espace de gestion · Démo locale'}</Typography><IconButton onClick={toggleColorMode} aria-label="Changer le thème">{theme.palette.mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}</IconButton></Box>;
}
