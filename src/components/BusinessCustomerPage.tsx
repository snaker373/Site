import { ArrowIcon, CheckIcon } from './Icons';
import { PhotoLightbox } from './PhotoLightbox';
import { ResponsivePhoto } from './ResponsivePhoto';
import { WhatsAppButton } from './WhatsAppButton';
import { site } from '@/lib/site';

const photos=['partner-baumarkt-10.png','partner-baumarkt-01.png','partner-baumarkt-08.png','partner-baumarkt-04.png','partner-baumarkt-07.png','partner-baumarkt-02.png'].map((file,index)=>({
  file,
  alt:`Ausgeführte gewerbliche Montagearbeit ${index+1}`,
  caption:'Ausgeführter Auftrag im gewerblichen Bereich',
}));

const services=[
  'Montage von Büro- und Betriebsmöbeln',
  'Aufbau von Regalen, Schränken und Einrichtungssystemen',
  'Aufbau von Waren- und Präsentationsständern',
  'Einrichtung und Umgestaltung von Verkaufsflächen',
  'Sortierung und strukturierte Platzierung von Waren',
  'Montagearbeiten in Baumärkten und Fachmärkten',
  'Demontage, Umbau und erneute Montage bestehender Einrichtungen',
];

function ProjectPhoto({file,alt,priority=false}:{file:string;alt:string;priority?:boolean}){
  return <div className="business-feature-photo"><ResponsivePhoto file={file} alt={alt} sizes="(max-width:767px) calc(100vw - 36px), 46vw" eager={priority}/><span aria-hidden="true">Saarmontage · Gewerbe</span></div>;
}

export function BusinessCustomerPage(){
  return <>
    <section className="business-hero section">
      <div className="container business-feature-grid business-feature-hero">
        <div className="business-feature-copy">
          <p className="eyebrow">FÜR UNTERNEHMEN & GEWERBE</p>
          <h1>Zuverlässiger Montageservice für Unternehmen und Geschäftskunden</h1>
          <div className="business-intro-copy">
            <p>Saarmontage unterstützt kleine und große Unternehmen bei Montagearbeiten, Möbelaufbau und der Einrichtung von Verkaufs- und Arbeitsbereichen.</p>
            <p>Wir sind offen für einzelne Aufträge, regelmäßige Einsätze und langfristige Partnerschaften. Dabei zählen klare Termine, saubere Ausführung und unkomplizierte Kommunikation.</p>
          </div>
          <div className="business-audiences" aria-label="Geschäftsbereiche">
            {['Büro','Fachhandel','Baumarkt','Lagerbetrieb','Weiteres Gewerbe'].map(item=><span key={item}><CheckIcon/>{item}</span>)}
          </div>
        </div>
        <ProjectPhoto file="partner-baumarkt-10.png" alt="Montage- und Einrichtungsarbeit auf einer gewerblichen Fläche" priority/>
      </div>
    </section>

    <section className="section business-services">
      <div className="container business-feature-grid business-feature-reverse">
        <ProjectPhoto file="partner-baumarkt-01.png" alt="Fertig eingerichteter Verkaufsbereich für einen Geschäftskunden"/>
        <div className="business-feature-copy">
          <p className="eyebrow">GEWERBLICHE ARBEITEN</p>
          <h2>Unsere Leistungen für Unternehmen</h2>
          <p>Je nach Projekt unterstützen wir Sie unter anderem bei:</p>
          <ul className="business-service-list">{services.map(item=><li key={item}><CheckIcon/><span>{item}</span></li>)}</ul>
          <p className="business-note">Auch individuelle Aufgaben außerhalb dieser Bereiche können nach vorheriger Abstimmung übernommen werden.</p>
        </div>
      </div>
    </section>

    <section className="section business-experience">
      <div className="container business-feature-grid">
        <div className="business-feature-copy business-copy">
          <div><p className="eyebrow">ERFAHRUNG & ABLAUF</p><h2>Erfahrung im gewerblichen Bereich</h2></div>
          <p>Wir verfügen bereits über praktische Erfahrung bei Arbeiten für größere Handelsunternehmen und auf gewerblich genutzten Verkaufsflächen.</p>
          <p>Unter anderem wurden Montage- und Einrichtungsarbeiten im Umfeld von <strong>Globus Baumarkt</strong> und <strong>BAUHAUS</strong> durchgeführt.</p>
          <p>Diese Erfahrung hilft uns, uns schnell in bestehende Abläufe einzufinden und auch größere oder strukturierte Projekte zuverlässig umzusetzen.</p>
          <p className="invoice-note"><CheckIcon/><span>Für Geschäftskunden stellen wir selbstverständlich eine ordnungsgemäße Rechnung aus.</span></p>
        </div>
        <ProjectPhoto file="partner-baumarkt-08.png" alt="Montagearbeit von Saarmontage im gewerblichen Bereich"/>
      </div>
    </section>

    <section className="section business-contact">
      <div className="container business-contact-grid">
        <div><p className="eyebrow">AUFTRAG & KOOPERATION</p><h2>Auftrag, Kooperation oder langfristige Zusammenarbeit</h2></div>
        <div><p>Sie suchen einen zuverlässigen Partner für einen einzelnen Auftrag, regelmäßige Montagearbeiten oder eine langfristige Zusammenarbeit?</p><p>Senden Sie uns eine kurze Beschreibung, den Einsatzort sowie nach Möglichkeit Fotos oder Pläne. Wir prüfen Ihre Anfrage und melden uns kurzfristig mit einer ersten Einschätzung.</p><div className="business-actions"><WhatsAppButton inquiry={{service:'Gewerblicher Montageauftrag'}}>Projekt anfragen</WhatsAppButton><a className="button button-secondary" href={`mailto:${site.email}?subject=${encodeURIComponent('Anfrage für Geschäftskunden')}`}>{site.email}<ArrowIcon/></a></div></div>
      </div>
    </section>

    <section className="section business-gallery">
      <div className="container"><div className="section-heading"><div><p className="eyebrow">REALE PROJEKTFOTOS</p><h2>Einblicke in ausgeführte Arbeiten</h2></div><p>Originalaufnahmen aus Montage-, Einrichtungs- und Sortierarbeiten auf gewerblichen Flächen. Jedes Bild lässt sich öffnen und im Detail ansehen.</p></div><PhotoLightbox photos={photos}/></div>
    </section>
  </>;
}
