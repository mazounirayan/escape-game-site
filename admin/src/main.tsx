import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import { installStaticApi, STATIC_DEMO } from '../../vitrine/src/staticApi';

installStaticApi();
// GitHub Pages serves only index.html: hash routes avoid 404s on reload of /sessions, etc.
const Router = STATIC_DEMO ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
);
