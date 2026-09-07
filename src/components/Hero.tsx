import Image from 'next/image';
import { site } from '@/lib/site';
import { ArrowIcon, CheckIcon, PinIcon } from './Icons';
import { WhatsAppButton } from './WhatsAppButton';
import { Reveal } from './Reveal';

export function Hero() {
  return <section className="hero container" aria-labelledby="hero-title">
    <Reveal className="hero-copy">
      <p className="eyebrow"><span className="status-dot"/>Мебель собрана. Вы отдыхаете.</p>
      <h1 id="hero-title">Профессиональная сборка мебели <span>в Сааре и Рейнланд-Пфальце</span></h1>
      <p className="hero-description">{site.projects} успешных сборок без стресса и ошибок</p>
      <p className="hero-support">От коробок до последнего винтика — берём сборку на себя. Вам остаётся наслаждаться домом.</p>
      <div className="hero-actions"><WhatsAppButton/><a href="#portfolio" className="button button-secondary">Смотреть работы<ArrowIcon/></a></div>
      <div className="hero-proof"><div className="rating"><span className="stars" aria-label="Пять звёзд">★★★★★</span><span><strong>{site.rating}/5</strong><span className="text-muted"> · оценка клиентов</span></span></div><span className="proof-divider"/><p><CheckIcon/>Лично. Аккуратно.<br/>С вниманием к вашему дому.</p></div>
    </Reveal>
    <Reveal className="hero-visual">
      <div className="hero-photo"><Image src="/assets/gallery-hero.jpg" alt="Собранный белый шкаф IKEA PAX с закрытыми фасадами" fill priority sizes="(max-width: 767px) 100vw, 48vw" className="object-cover"/><span className="photo-label"><span/>Реальная работа</span><div className="photo-caption"><span>IKEA PAX</span><p>Всё на своих местах.</p></div></div>
      <div className="craft-card rounded-2xl shadow-sm"><span className="craft-icon"><CheckIcon/></span><div><strong>Собрано с заботой</strong><span>О мебели. О доме. О вас.</span></div></div>
      <div className="image-footnote"><span><PinIcon/>Saarland & Rheinland-Pfalz</span><span>01 / IKEA PAX</span></div>
    </Reveal>
    <div className="hero-bottom"><span>Ваша мебель — в надёжных руках</span><div><span>IKEA</span><span>PAX</span><span>HEMNES</span><span>BESTÅ</span></div><span className="hero-bottom-note">Независимый сервис сборки</span></div>
  </section>;
}

