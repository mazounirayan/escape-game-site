import FeatureBox from './FeatureBox';
import asile from '../images/Asile.jpeg';
import crypte from '../images/Crypte.png';
import laboratoire from '../images/Laboratoire.png';
export default function Salles() {
  return <section id="features" className="section-shell scenarios"><div className="section-heading"><h2>Quel mystère allez-vous résoudre ?</h2><p>Chaque décor raconte une autre histoire. À vous de trouver la sortie.</p></div><div className="scenario-grid"><FeatureBox image={asile} title="Asile" text="Explorez un asile abandonné. Ses murs gardent des secrets que votre équipe devra déchiffrer." /><FeatureBox image={crypte} title="Crypte" text="Une expédition a mal tourné. Dans les profondeurs de la crypte, chaque indice peut vous rapprocher de la lumière." /><FeatureBox image={laboratoire} title="Laboratoire" text="Le savant fou est absent. Fouillez son laboratoire et déjouez ses expériences avant son retour." /></div></section>;
}
