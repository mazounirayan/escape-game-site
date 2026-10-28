import { useState } from 'react';
export default function Navbar() {
  const [open, setOpen] = useState(false);
  return <nav className="site-nav" aria-label="Navigation principale"><a className="wordmark" href="#main">Évasion<span>Mystique</span></a><button className="menu-toggle" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(!open)}>Menu</button><div id="site-menu" className={open ? 'site-menu open' : 'site-menu'}>{[['features','Les scénarios'],['about','L’expérience'],['contact','Contact'],['Booking','Réserver']].map(([id,label]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}</div></nav>;
}
