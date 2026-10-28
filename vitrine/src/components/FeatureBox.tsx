interface Props { image: string; title: string; text: string }
export default function FeatureBox({ image, title, text }: Props) {
  return <article className={`scenario scenario--${title.toLowerCase()}`}><img src={image} alt={`Décor du scénario ${title}`} loading="lazy" /><div><h3>{title}</h3><p>{text}</p><a href="#Booking" aria-label={`Voir les sessions du scénario ${title}`}>Voir les sessions</a></div></article>;
}
