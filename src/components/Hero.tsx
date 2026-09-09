import { CheckIcon, PinIcon } from './Icons';
import { WhatsAppButton } from './WhatsAppButton';
import { Reveal } from './Reveal';
import { HeroCarousel } from './HeroCarousel';
import { GoogleRatingBadge } from './Reviews';
export function Hero() {
 return <section className="hero-section" aria-labelledby="hero-title"><div className="hero container"><Reveal className="hero-copy"><p className="eyebrow"><span className="status-dot"/>Ihr Montageservice im Saarland</p><h1 id="hero-title">Ihre Küche.<br/>Ihre Möbel.<br/><span>Richtig montiert.</span></h1><p className="hero-description">Sie freuen sich auf Ihr neues Zuhause.<br/>Ich kümmere mich um den Aufbau.</p><p className="hero-support">Möbel- und Küchenmontage mit Andrii Ryndia. Vom IKEA PAX bis zum letzten Griff – persönlich, sorgfältig und direkt bei Ihnen vor Ort.</p><GoogleRatingBadge/><div className="hero-actions"><WhatsAppButton/><a href="/referenzen/" className="button button-secondary">Meine Arbeiten ansehen <span>↗</span></a></div><div className="hero-person-line"><span className="person-check"><CheckIcon/></span><span><strong>Andrii Ryndia</strong><small>Ihr direkter Ansprechpartner</small></span><span className="hero-location"><PinIcon/>Saarbrücken & Umgebung</span></div></Reveal><Reveal className="hero-media"><HeroCarousel/></Reveal><div className="hero-bottom">{['Direkter Kontakt zum Monteur','Umfang & Preis vorab abstimmen','Sorgfältiger Aufbau nach Anleitung'].map(text=><span key={text}><CheckIcon/>{text}</span>)}</div></div></section>;
}
