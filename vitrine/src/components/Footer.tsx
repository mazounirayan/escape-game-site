import { STATIC_DEMO } from '../api';

export default function Footer() { return <footer className="site-footer"><a className="wordmark" href="#main">Évasion<span>Mystique</span></a><p>Projet de démonstration de réservation et de gestion d’escape game.</p>{STATIC_DEMO && <a href={`${import.meta.env.BASE_URL}admin/`}>Espace de gestion (démo)</a>}<a href="#Booking">Retour au calendrier</a></footer>; }
