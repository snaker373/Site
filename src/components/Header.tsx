'use client';
import { useEffect, useRef, useState } from 'react';
import navigation from '../../content/navigation.json';
import { WhatsAppButton } from './WhatsAppButton';
export function Brand() { return <a href="/" aria-label="Andrii Ryndia Solutions – Startseite" className="brand"><img src="/assets/logo-web.png" alt="Andrii Ryndia Solutions" width="420" height="280"/></a>; }
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => { if (!headerRef.current?.contains(event.target as Node)) setOpen(false); };
    const closeWide = () => { if (window.innerWidth > 960) setOpen(false); };
    document.addEventListener('pointerdown', closeOutside);
    window.addEventListener('resize', closeWide);
    return () => { document.removeEventListener('pointerdown', closeOutside); window.removeEventListener('resize', closeWide); };
  }, []);
  useEffect(() => { const update = () => setScrolled(window.scrollY > 12); update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update); }, []);
  return <header ref={headerRef} className={`site-header sm-header ${scrolled ? 'is-scrolled' : ''}`} onKeyDown={event=>{if(event.key==='Escape'){setOpen(false);menuRef.current?.focus();}}}><div className="container header-inner sm-header-inner"><Brand/><nav id="main-navigation" aria-label="Hauptnavigation" className={`main-navigation sm-nav${open?' is-open':''}`} onClick={()=>setOpen(false)}>{navigation.map(item=><a key={item.href} href={item.href}>{item.label}</a>)}</nav><div className="header-actions sm-header-actions"><WhatsAppButton className="header-cta sm-header-cta">WhatsApp</WhatsAppButton><button ref={menuRef} type="button" className="menu-button sm-menu-toggle" aria-label={open?'Menü schließen':'Menü öffnen'} aria-expanded={open} aria-controls="main-navigation" onClick={()=>setOpen(!open)}><span className="sm-menu-bars" aria-hidden="true"><i/><i/><i/></span></button></div></div></header>;
}
