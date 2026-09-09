'use client';
import { useId, useRef, useState } from 'react';
import { ResponsivePhoto } from './ResponsivePhoto';

type Props = { before?: string; after?: string; beforeAlt?: string; afterAlt?: string; initialPosition?: number; title?: string };

/** Native range provides touch, mouse, arrow keys, Home/End and screen-reader support. */
export function BeforeAfterSlider({ before = '/assets/karton.jpg', after = '/assets/Bettt2.jpg', beforeAlt = 'Möbelkartons vor der Montage', afterAlt = 'Fertig montiertes Bett', initialPosition = 50, title = 'Bettmontage' }: Props) {
  const id = useId();
  const [position, setPosition] = useState(Math.min(100, Math.max(0, Number.isFinite(initialPosition) ? initialPosition : 50)));
  const pointer=useRef<number|null>(null),input=useRef<HTMLInputElement>(null);
  function fromX(x:number,el:HTMLDivElement){const box=el.getBoundingClientRect();if(box.width)setPosition(Math.round(Math.max(0,Math.min(100,(x-box.left)/box.width*100))));}
  return <figure className="comparison-figure">
    <div className="comparison-stage rounded-2xl shadow-sm" onPointerDown={event=>{if(event.button!==0||!event.isPrimary)return;pointer.current=event.pointerId;event.currentTarget.setPointerCapture(event.pointerId);event.preventDefault();input.current?.focus({preventScroll:true});fromX(event.clientX,event.currentTarget);}} onPointerMove={event=>{if(pointer.current===event.pointerId)fromX(event.clientX,event.currentTarget);}} onPointerUp={event=>{if(pointer.current!==event.pointerId)return;fromX(event.clientX,event.currentTarget);pointer.current=null;if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);}} onPointerCancel={()=>{pointer.current=null;}} onLostPointerCapture={()=>{pointer.current=null;}} onDragStart={event=>event.preventDefault()}>
      <ResponsivePhoto file={after} alt={afterAlt} sizes="(max-width: 767px) calc(100vw - 36px), 48vw" className="comparison-image"/>
      <div className="comparison-before" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}><ResponsivePhoto file={before} alt={beforeAlt} sizes="(max-width: 767px) calc(100vw - 36px), 48vw" className="comparison-image"/></div>
      <span className="comparison-badge comparison-badge-before" style={{opacity:Math.min(1,position/15)}} aria-hidden="true">Vorher</span><span className="comparison-badge comparison-badge-after" style={{opacity:Math.min(1,(100-position)/15)}} aria-hidden="true">Nachher</span>
      <div className="comparison-divider" style={{ left: `${position}%` }} aria-hidden="true"><span className="comparison-handle"><svg width="26" height="20" viewBox="0 0 26 20" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m9 5-5 5 5 5m8-10 5 5-5 5M13 4v12"/></svg></span></div>
      <label htmlFor={id} className="sr-only">Vorher-Nachher-Vergleich {title}</label>
      <input ref={input} id={id} className="comparison-range" type="range" min="0" max="100" step="1" value={position} onChange={event => setPosition(Number(event.target.value))} aria-describedby={`${id}-hint`} aria-valuetext={`Vorher: ${position} Prozent; Nachher: ${100 - position} Prozent`}/>
    </div>
    <figcaption className="comparison-caption" id={`${id}-hint`}><strong>{title}</strong><span>Direkt im Foto ziehen ↔</span></figcaption>
  </figure>;
}

