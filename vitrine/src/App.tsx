import Navbar from './components/Navbar';
import Header from './components/Header';
import Salles from './components/Salles';
import About from './components/About';
import BookingForm from './components/Reservation';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';
export default function App() { return <><a className="skip-link" href="#features">Aller au contenu</a><Navbar /><Header /><main><Salles /><About /><BookingForm /><Contact /></main><Footer /></>; }
