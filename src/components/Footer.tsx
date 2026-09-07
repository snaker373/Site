import { Brand } from './Header';
import { WhatsAppButton } from './WhatsAppButton';
export function Footer() { return <><footer className="container footer"><div><Brand/><p>Аккуратная сборка. Спокойный дом.</p></div><nav aria-label="Юридическая информация"><a href="/impressum/">Impressum</a><a href="/datenschutz/">Datenschutz</a><a href="/agb/">AGB</a></nav><p>© {new Date().getFullYear()} Andrii Ryndia Solutions<br/><span>Независимый сервис. Не связан с IKEA.</span></p></footer><aside className="mobile-contact" aria-label="Быстрый контакт"><WhatsAppButton/></aside></>; }
