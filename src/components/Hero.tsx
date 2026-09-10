import { CheckIcon, PinIcon } from './Icons';
import { WhatsAppButton } from './WhatsAppButton';
import { Reveal } from './Reveal';
import { HeroCarousel } from './HeroCarousel';
import { GoogleRatingBadge } from './Reviews';
export function Hero() {
 return <section className="hero-section" aria-labelledby="hero-title"><div className="hero container"><Reveal className="hero-copy"><p className="eyebrow"><span className="status-dot"/>Ihr Montageservice im Saarland</p><h1 id="hero-title">Ihre Küche.<br/>Ihre Möbel.<br/><span>Richtig montiert.</span></h1><p className="hero-description">Sie freuen sich auf Ihr neues Zuhause.<br/>Wir kümmern uns um den Aufbau.</p><p className="hero-support">Saarmontage ist der Montageservice von Andrii Ryndia Solutions. Von der Möbelmontage bis zur Küchenmontage – sorgfältig und direkt bei Ihnen vor Ort.</p><GoogleRatingBadge/><div className="hero-actions"><WhatsAppButton/><a href="/referenzen/" className="button button-secondary">Unsere Arbeiten ansehen <span>↗</span></a></div><div className="hero-person-line"><span className="person-check"><CheckIcon/></span><span><strong>Saarmontage</strong><small>Andrii Ryndia Solutions</small></span><span className="hero-location"><PinIcon/>Saarbrücken & Umgebung</span></div></Reveal><Reveal className="hero-media"><HeroCarousel/></Reveal><div className="hero-bottom">{['Direkter Kontakt','Umfang & Preis vorab abstimmen','Sorgfältiger Aufbau nach Anleitung'].map(text=><span key={text}><CheckIcon/>{text}</span>)}</div></div></section>;
}
