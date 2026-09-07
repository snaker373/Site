'use client';
import Image from 'next/image';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { categories, projects, type Category } from '@/lib/site';
import { ArrowIcon } from './Icons';
export function Portfolio() {
  const [category, setCategory] = useState<Category>('Все работы');
  const reduced = useReducedMotion();
  const filtered = projects.filter(project => category === 'Все работы' || project.category === category);
  return <section id="portfolio" className="portfolio-section section" aria-labelledby="portfolio-title"><div className="container"><div className="section-heading"><div><p className="eyebrow">02 / Наши работы</p><h2 id="portfolio-title">Результат говорит за нас.</h2></div><p>Шкафы, кухни и любимая мебель.<br/>Фотографии с наших сборок.</p></div><div className="filters" role="group" aria-label="Фильтр работ по типу мебели">{categories.map(item => <button key={item} type="button" className={`filter-button rounded-2xl ${category === item ? 'is-active' : ''}`} aria-pressed={category === item} aria-controls="portfolio-results" onClick={() => setCategory(item)}>{item}{item === 'Все работы' && <span>{projects.length.toString().padStart(2, '0')}</span>}</button>)}</div><p className="sr-only" role="status">{category}: {filtered.length} работ</p><div id="portfolio-results" className="portfolio-grid">{filtered.map(project => <motion.article key={project.image} layout={!reduced} initial={false} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .25 }} className="project-card rounded-2xl shadow-sm"><div className="project-image"><Image src={`/assets/${project.image}`} alt={`${project.detail}. Фотография выполненной работы`} fill loading="lazy" sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover"/><span>{project.category}</span></div><div className="project-copy"><p>{project.detail}</p><h3>{project.title}</h3></div></motion.article>)}</div><a href="/referenzen/" className="text-link portfolio-more">Все фотографии проектов<ArrowIcon/></a></div></section>;
}
