'use client';
import { useEffect, useState } from 'react';
import { WhatsAppButton } from './WhatsAppButton';
export function Brand() { return <a href="/" aria-label="Andrii Ryndia Solutions — главная" className="brand"><span className="brand-mark" aria-hidden="true">AR<span>↗</span></span><span>Andrii Ryndia<span className="brand-subtitle">SOLUTIONS</span></span></a>; }
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const update = () => setScrolled(window.scrollY > 12); update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update); }, []);
  return <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}><div className="container flex min-h-22 items-center justify-between gap-4"><Brand/><nav aria-label="Основная навигация" className="hidden items-center gap-7 text-sm font-medium lg:flex"><a href="#transformation">Как это выглядит</a><a href="#portfolio">Наши работы</a><a href="#area">География</a><a href="#contact">Контакты</a></nav><WhatsAppButton className="header-cta">WhatsApp</WhatsAppButton></div></header>;
}
