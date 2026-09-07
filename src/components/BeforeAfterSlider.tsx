'use client';
import Image from 'next/image';
import { useId, useState } from 'react';

type Props = { before?: string; after?: string; beforeAlt?: string; afterAlt?: string; initialPosition?: number };

/** Native range provides touch, mouse, arrow keys, Home/End and screen-reader support. */
export function BeforeAfterSlider({ before = '/assets/karton.jpg', after = '/assets/gallery-hero.jpg', beforeAlt = 'Коробки IKEA перед сборкой шкафа', afterAlt = 'Готовый шкаф IKEA PAX после сборки', initialPosition = 50 }: Props) {
  const id = useId();
  const [position, setPosition] = useState(Math.min(100, Math.max(0, Number.isFinite(initialPosition) ? initialPosition : 50)));
  return <figure className="comparison-figure">
    <div className="comparison-stage rounded-2xl shadow-sm">
      <Image src={after} alt={afterAlt} fill sizes="(max-width: 767px) 100vw, 70vw" className="comparison-image" loading="lazy"/>
      <div className="comparison-before" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}><Image src={before} alt={beforeAlt} fill sizes="(max-width: 767px) 100vw, 70vw" className="comparison-image" loading="lazy"/></div>
      <span className="comparison-badge comparison-badge-before" aria-hidden="true">До сборки</span><span className="comparison-badge comparison-badge-after" aria-hidden="true">Готово к жизни</span>
      <div className="comparison-divider" style={{ left: `${position}%` }} aria-hidden="true"><span className="comparison-handle"><svg width="26" height="20" viewBox="0 0 26 20" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m9 5-5 5 5 5m8-10 5 5-5 5M13 4v12"/></svg></span></div>
      <label htmlFor={id} className="sr-only">Сравнение до и после сборки шкафа IKEA PAX</label>
      <input id={id} className="comparison-range" type="range" min="0" max="100" step="1" value={position} onChange={event => setPosition(Number(event.target.value))} aria-describedby={`${id}-hint`} aria-valuetext={`До сборки: ${position} процентов; после сборки: ${100 - position} процентов`}/>
    </div>
    <figcaption className="comparison-caption" id={`${id}-hint`}><span>IKEA PAX <span className="text-muted">/ пример этапов сборки</span></span><span>Перетащите ползунок ↔</span></figcaption>
  </figure>;
}

