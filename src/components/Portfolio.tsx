'use client';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { categories, projects, type Category } from '@/lib/site';
import { ArrowIcon } from './Icons';
import { ResponsivePhoto } from './ResponsivePhoto';
export function Portfolio() {
  const [category, setCategory] = useState<Category>('Alle Arbeiten');
  const reduced = useReducedMotion();
  const filtered = projects.filter(project => category === 'Alle Arbeiten' || project.category === category);
  return <section id="portfolio" className="portfolio-section section" aria-labelledby="portfolio-title"><div className="container"><div className="section-heading"><div><p className="eyebrow">Einblicke in meine Arbeit</p><h2 id="portfolio-title">Handwerk, das man sehen kann.</h2></div><p>Küchen, Schränke und Lieblingsmöbel.<br/>Echte Einblicke in meine Montagearbeiten.</p></div><div className="filters" role="group" aria-label="Projektfotos nach Möbelart filtern">{categories.map(item => <button key={item} type="button" className={`filter-button rounded-2xl ${category === item ? 'is-active' : ''}`} aria-pressed={category === item} aria-controls="portfolio-results" onClick={() => setCategory(item)}>{item}{item === 'Alle Arbeiten' && <span>{projects.length.toString().padStart(2, '0')}</span>}</button>)}</div><p className="sr-only" role="status">{category}: {filtered.length} Projektfotos</p><div id="portfolio-results" className="portfolio-grid">{filtered.map(project => <motion.article key={project.image} layout={!reduced} initial={false} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .25 }} className="project-card rounded-2xl shadow-sm"><div className="project-image"><ResponsivePhoto file={project.image} alt={`${project.detail}. Originalfoto der fertig montierten Möbel`} sizes="(max-width: 639px) calc(100vw - 36px), (max-width: 1023px) 50vw, 33vw" className="object-cover"/><span>{project.category}</span></div><div className="project-copy"><p>{project.detail}</p><h3>{project.title}</h3></div></motion.article>)}</div><a href="/referenzen/" className="text-link portfolio-more">Alle Projektfotos ansehen<ArrowIcon/></a></div></section>;
}

