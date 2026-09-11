'use client';

import { useEffect, useRef, useState, type TouchEvent } from 'react';
import { ResponsivePhoto } from './ResponsivePhoto';

type Photo = { file:string; alt:string; caption?:string };

export function PhotoLightbox({photos,numbered=false}:{photos:Photo[];numbered?:boolean}) {
  const [active,setActive]=useState<number|null>(null);
  const closeRef=useRef<HTMLButtonElement>(null);
  const touchStart=useRef<number|null>(null);
  const showPrevious=()=>setActive(index=>index===null?null:(index-1+photos.length)%photos.length);
  const showNext=()=>setActive(index=>index===null?null:(index+1)%photos.length);

  useEffect(()=>{
    if(active===null)return;
    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    closeRef.current?.focus();
    const onKeyDown=(event:KeyboardEvent)=>{
      if(event.key==='Escape')setActive(null);
      if(event.key==='ArrowLeft')showPrevious();
      if(event.key==='ArrowRight')showNext();
    };
    window.addEventListener('keydown',onKeyDown);
    return()=>{document.body.style.overflow=previousOverflow;window.removeEventListener('keydown',onKeyDown);};
  },[active,photos.length]);

  function finishSwipe(event:TouchEvent) {
    if(touchStart.current===null)return;
    const distance=event.changedTouches[0].clientX-touchStart.current;
    if(Math.abs(distance)>55)(distance>0?showPrevious:showNext)();
    touchStart.current=null;
  }

  return <>
    <div className="clickable-photo-grid">{photos.map((photo,index)=><figure key={photo.file} className="clickable-photo-card"><button type="button" onClick={()=>setActive(index)} aria-label={`${photo.alt} – Bild vergrößern`}><div><ResponsivePhoto file={photo.file} alt={photo.alt} sizes="(max-width:599px) 50vw, (max-width:999px) 33vw, 380px"/></div>{numbered&&<span className="photo-index">{String(index+1).padStart(2,'0')}</span>}<span className="photo-zoom" aria-hidden="true">＋</span></button><figcaption>{photo.caption||photo.alt}</figcaption></figure>)}</div>
    {active!==null&&<div className="photo-lightbox" role="dialog" aria-modal="true" aria-label={`Vergrößerte Projektaufnahme ${active+1} von ${photos.length}`} onMouseDown={event=>{if(event.target===event.currentTarget)setActive(null);}} onTouchStart={event=>{touchStart.current=event.changedTouches[0].clientX;}} onTouchEnd={finishSwipe}>
      <div className="lightbox-toolbar"><span>{String(active+1).padStart(2,'0')} / {String(photos.length).padStart(2,'0')}</span><button ref={closeRef} type="button" onClick={()=>setActive(null)} aria-label="Bildansicht schließen">Schließen ×</button></div>
      <button className="lightbox-arrow lightbox-previous" type="button" onClick={showPrevious} aria-label="Vorheriges Bild">‹</button>
      <figure><div><ResponsivePhoto file={photos[active].file} alt={photos[active].alt} sizes="100vw" eager/></div><figcaption>{photos[active].caption||photos[active].alt}</figcaption></figure>
      <button className="lightbox-arrow lightbox-next" type="button" onClick={showNext} aria-label="Nächstes Bild">›</button>
    </div>}
  </>;
}
