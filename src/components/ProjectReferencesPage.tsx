import gallery from '../../content/gallery.json';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { PhotoLightbox } from './PhotoLightbox';

const groups=[
  ['kuechen','Küchen','Küchenzeilen, Fronten und Arbeitsplatten'],
  ['pax','IKEA PAX','Korpusse, Innenausstattung und Türen'],
  ['schraenke','Schränke','Kleider-, Schiebe- und Stauraumschränke'],
  ['betten','Betten','Bettgestelle, Tages- und Hochbetten'],
  ['buero','Büro & Homeoffice','Schreibtische, Regale und Arbeitsplätze'],
  ['moebel','Wohnmöbel','Kommoden, Vitrinen, Regale und Sofas'],
];

export function ProjectReferencesPage(){
  return <>
    <section className="page-intro-next references-intro section">
      <div className="container"><p className="eyebrow">REFERENZEN</p><h1>Unsere Arbeitsbeispiele.<br/>Sauber montiert.</h1><p>Sehen Sie, wie Küchen, IKEA PAX Systeme, Schränke und weitere Möbel nach der Montage aussehen. Alle Aufnahmen stammen aus tatsächlich ausgeführten Projekten.</p></div>
    </section>
    <section className="reference-directory section" aria-labelledby="reference-directory-title">
      <div className="container"><div className="reference-directory-heading"><p className="eyebrow">PROJEKTE NACH BEREICH</p><h2 id="reference-directory-title">Direkt zur passenden Referenz.</h2><p>Wählen Sie eine Kategorie oder scrollen Sie durch die vollständige Sammlung.</p></div><nav className="reference-category-nav" aria-label="Referenzkategorien">{groups.map(([id,label,description])=><a key={id} href={`#${id}`}><span><strong>{label}</strong><small>{description}</small></span><b aria-hidden="true">↓</b></a>)}</nav></div>
    </section>
    <section className="reference-transformation section" aria-labelledby="reference-comparison-title">
      <div className="container reference-comparison-wrap">
        <div className="reference-comparison-heading"><p className="eyebrow">VORHER & NACHHER</p><h2 id="reference-comparison-title">Das Ergebnis direkt vergleichen.</h2><p>Ziehen Sie die Trennlinie im Bild und sehen Sie, wie aus gelieferten Kartons ein fertig montiertes Möbelstück wird.</p></div>
        <div className="reference-comparison-card"><BeforeAfterSlider before="/assets/karton.jpg" after="/assets/Bettt2.jpg" beforeAlt="Möbelkartons vor der Montage" afterAlt="Fertig montiertes Bett mit Stauraum" title="Bettmontage"/></div>
      </div>
    </section>
    {groups.map(([id,label])=>{const photos=gallery.filter(item=>item.category===id);return <section className="section reference-group" id={id} key={id}><div className="container"><div className="reference-group-heading"><h2>{label}</h2><span>{photos.length} Projekte</span></div><PhotoLightbox photos={photos} initialVisible={3}/></div></section>})}
  </>;
}
