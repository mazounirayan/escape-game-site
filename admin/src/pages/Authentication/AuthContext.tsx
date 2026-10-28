const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { toastStyle } from '../../components/theme/theme';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(localStorage.getItem('email')));
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/employees?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      const data = await response.json();
  
      if (data.length > 0) {
        const user = data[0];
        if (user.password === password) {
          setIsAuthenticated(true);
          localStorage.setItem('email', email);
          Toastify({
            text: 'Connexion réussie !',
            duration: 3000,
            style: toastStyle.success,
          }).showToast();
        } else {
          throw new Error('Invalid email or password');
        }
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      Toastify({
        text: 'Email ou mot de passe invalide.',
        duration: 3000,
        style: toastStyle.error,
      }).showToast();
  
      throw new Error('Invalid email or password');
    }
  };
  

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('email');
    Toastify({
      text: 'Déconnexion réussie !',
      duration: 3000,
      style: toastStyle.success,
    }).showToast();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
