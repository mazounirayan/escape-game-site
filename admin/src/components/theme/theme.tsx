import { createContext, useMemo, useState } from 'react';
import { createTheme, Theme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const serif = "Georgia, 'Times New Roman', serif";

export const toastStyle = {
  success: { background: '#28573e', color: '#ffffff' },
  error: { background: '#8c2f2a', color: '#ffffff' },
};

export function useMode(): [Theme, { toggleColorMode: () => void }] {
  const [mode, setMode] = useState<PaletteMode>('light');
  const colorMode = useMemo(() => ({ toggleColorMode: () => setMode(previous => previous === 'light' ? 'dark' : 'light') }), []);
  const theme = useMemo(() => {
    const light = mode === 'light';
    return createTheme({
      palette: {
        mode,
        primary: { main: light ? '#28573e' : '#e6c36a' },
        secondary: { main: light ? '#8a5f22' : '#9ac9ac' },
        error: { main: light ? '#b3261e' : '#f2a29b' },
        warning: { main: light ? '#8a5f22' : '#e6c36a' },
        success: { main: light ? '#28573e' : '#9ac9ac' },
        background: { default: light ? '#f1f4ef' : '#141b19', paper: light ? '#ffffff' : '#1b2220' },
        divider: light ? 'rgba(27,34,32,0.14)' : 'rgba(230,195,106,0.2)',
      },
      typography: {
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        h1: { fontFamily: serif },
        h2: { fontFamily: serif },
        h3: { fontFamily: serif },
        h4: { fontFamily: serif, fontSize: 'clamp(1.6rem, 1.2rem + 1.5vw, 1.9rem)', fontWeight: 500, lineHeight: 1.25 },
        h5: { fontFamily: serif, fontWeight: 500 },
        h6: { fontFamily: serif, fontSize: '1.15rem', fontWeight: 500 },
        button: { textTransform: 'none', fontWeight: 600 },
      },
      shape: { borderRadius: 8 },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: { margin: 0 },
            'a:focus-visible, button:focus-visible': { outline: `3px solid ${light ? '#8a5f22' : '#e6c36a'}`, outlineOffset: 3 },
            '.admin-navigation a': { color: 'inherit' },
            '.admin-navigation a:hover': { background: light ? 'rgba(40,87,62,0.08)' : 'rgba(230,195,106,0.1)' },
            '.admin-navigation a.active': { background: light ? 'rgba(40,87,62,0.14)' : 'rgba(230,195,106,0.16)' },
            '.react-datepicker-popper': { zIndex: 1400 },
            '.react-datepicker': { fontFamily: "'Segoe UI', system-ui, sans-serif" },
          },
        },
        MuiButton: { defaultProps: { disableElevation: true } },
        MuiTextField: { defaultProps: { fullWidth: true } },
        MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
        MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
      },
    });
  }, [mode]);
  return [theme, colorMode];
}
