import gallery from '../../content/gallery.json';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { PhotoLightbox } from './PhotoLightbox';

const groups=[['kuechen','Küchen'],['pax','IKEA PAX'],['schraenke','Schränke'],['betten','Betten'],['buero','Büro & Homeoffice'],['moebel','Wohnmöbel']];

export function ProjectReferencesPage(){
  return <>
    <section className="page-intro-next references-intro section">
      <div className="container"><p className="eyebrow">UNSERE ARBEITEN</p><h1>Vom Karton zum<br/>fertigen Zuhause.</h1><p>Originalfotos aus dem Montagealltag, übersichtlich nach Möbelart geordnet. Jedes Bild lässt sich vergrößern.</p></div>
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
