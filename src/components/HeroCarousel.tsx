'use client';
import { useEffect, useState } from 'react';
import { ResponsivePhoto } from './ResponsivePhoto';

const photos=[
 {file:'kueche-schwarz-montage-01.png',label:'Küchenmontage',text:'Ihre Küche. Sorgfältig montiert.'},
 {file:'gallery-hero.jpg',label:'IKEA PAX Montage',text:'Alles an seinem Platz.'},
 {file:'g248.jpg',label:'Büro & Homeoffice',text:'Bereit für neue Ideen.'},
 {file:'g132.jpg',label:'Schrankmontage',text:'Stauraum bis ins Detail.'},
 {file:'gallery-3.jpg',label:'Bettmontage',text:'Fertig für einen ruhigen Abend.'},
];

export function HeroCarousel(){
 const [index,setIndex]=useState(0);
 useEffect(()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const id=setInterval(()=>setIndex(i=>(i+1)%photos.length),4800);return()=>clearInterval(id);},[]);
 const current=photos[index];
 return <div className="hero-visual"><div className="hero-collage" role="group" aria-label="Automatisch wechselnde Fotos meiner Montagearbeiten">
   <div className="collage-main">{photos.map((photo,i)=><div key={photo.file} className={`collage-slide ${i===index?'is-active':''}`} aria-hidden={i!==index}><ResponsivePhoto file={photo.file} alt={photo.label+' – montierte Möbel'} eager={i===0} sizes="(max-width: 767px) calc(100vw - 36px), 46vw"/></div>)}<div className="slide-caption"><span>{current.label}</span><p>{current.text}</p></div></div>
 </div><div className="hero-project-link"><span><strong>Mit einem Blick fürs Detail.</strong><small>Aufbau, Ausrichtung und saubere Übergänge.</small></span></div><p className="image-footnote"><span>Saarland · Rheinland-Pfalz nach Absprache</span><span>Persönlich. Sorgfältig.</span></p></div>;
}
