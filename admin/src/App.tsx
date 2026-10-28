import React, { useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import PageTitle from './components/PageTitle';
import Sidbar from './components/SideBar/Sidbar';
import Topbar from './components/NavBar/navbar';
const SessionList = React.lazy(() => import('./pages/session/sessionList'));
const CreateSession = React.lazy(() => import('./pages/session/Creation'));
const EmployeeForm = React.lazy(() => import('./pages/Dashboard/Employee'));
import { AuthProvider } from './pages/Authentication/AuthContext';
import ProtectedRoute from './pages/Authentication/ProtectedRoute';
import SignIn from './pages/Authentication/SignIn';
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));
const CreateTheme = React.lazy(() => import('./pages/session/theme'));
const EmployeeList = React.lazy(() => import('./pages/Employee/EmployeeList'));
import { ColorModeContext, useMode } from './components/theme/theme';
import './App.css';
const ReservationManager = React.lazy(() => import('./pages/Reservation/reservationList'));

const App: React.FC = () => {


  const { pathname } = useLocation();
  const [theme, colorMode] = useMode();
  const isLoginPage = pathname === '/signin';
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);



  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>

            <Box display="flex" minHeight="100dvh" sx={{ flexDirection: { xs: "column", md: "row" } }}>
               {!isLoginPage && <Sidbar />}

              <Box flexGrow={1} display="flex" flexDirection="column" minWidth={0}>
              {!isLoginPage &&   <Topbar />}
                <Box flexGrow={1} p={2} bgcolor="background.default">
                  <React.Suspense fallback={<Box role="status" sx={{ p: 3 }}>Chargement…</Box>}><Routes>
                    <Route
                      index
                      element={
                        <ProtectedRoute
                          element={
                            <>
                              <PageTitle title="Vue d’ensemble · Évasion Mystique" />
                              <Dashboard />
                            </>
                          }
                        />
                      }
                    />
                    <Route
                      path="/signin"
                      element={
                        <>
                          <PageTitle title="Connexion · Évasion Mystique" />
                          <SignIn />
                        </>
                      }
                    />
                    <Route
                      path="/sessions"
                      element={
                        <ProtectedRoute
                          element={
                            <>
                              <PageTitle title="Sessions · Évasion Mystique" />
                              <SessionList />
                            </>
                          }
                        />
                      }
                    />
                    <Route
                      path="/Reservation"
                      element={
                        <ProtectedRoute
                          element={
                            <>
                              <PageTitle title="Réservations · Évasion Mystique" />
                              <ReservationManager />
                            </>
                          }
                        />
                      }
                    />
                    <Route
                      path="/create-session"
                      element={
                        <ProtectedRoute
                          element={
                            <>
                              <PageTitle title="Créer une session · Évasion Mystique" />
                              <CreateSession />
                            </>
                          }
                        />
                      }
                    />
                    <Route
                      path="/employeeForm"
                      element={
                        <ProtectedRoute
                          element={
                            <>
                              <PageTitle title="Ajouter un membre · Évasion Mystique" />
                              <EmployeeForm />
                            </>
                          }
                        />
                      }
                    />
                    <Route
                      path="/employees"
                      element={
                        <ProtectedRoute
                          element={
                            <>
                              <PageTitle title="Équipe · Évasion Mystique" />
                              <EmployeeList />
                            </>
                          }
                        />
                      }
                    />
                    <Route
                      path="/themeCreation"
                      element={
                        <ProtectedRoute
                          element={
                            <>
                              <PageTitle title="Scénarios · Évasion Mystique" />
                              <CreateTheme />
                            </>
                          }
                        />
                      }
                    />
                    <Route path="*" element={<Navigate to="/signin" replace />} />
                  </Routes></React.Suspense>
                </Box>
              </Box>
            </Box>

        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
