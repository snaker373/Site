import Image from 'next/image';
import { site } from '@/lib/site';
import { WhatsAppButton } from './WhatsAppButton';
import { ContactForm } from './ContactForm';
export function Contact() {
  return <section id="contact" className="section contact-section" aria-labelledby="contact-title"><div className="container contact-grid"><div className="contact-intro"><p className="eyebrow">04 / Давайте начнём</p><h2 id="contact-title">Меньше хлопот.<br/><span className="text-accent">Больше дома.</span></h2><p className="section-description">Напишите, какую мебель нужно собрать.<br/>Обсудим стоимость и удобную дату лично.</p><WhatsAppButton/><p className="response-time"><span/>{site.responseTime}<br/><span className="hours">Пн–Сб · 08:00–20:00</span></p><div className="contact-person"><Image src="/assets/andrii-photo.jpg" alt="Андрей Рындя, мастер по сборке мебели" width={58} height={58} className="rounded-full object-cover"/><div><strong>Андрей Рындя</strong><span>Ваш мастер. На связи лично.</span></div></div><a href="tel:+4915172377683" className="contact-phone">{site.phone}</a><a href={`mailto:${site.email}`} className="contact-email">{site.email}</a></div><ContactForm/></div></section>;
}
