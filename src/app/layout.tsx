import type { Metadata } from 'next';
import './globals.css';
const isPublic = process.env.SITE_PUBLIC === 'true';
const origin = isPublic ? 'https://saarmontage.de' : 'https://saarmontage.cuddly-spool-0095.chatgpt.site';
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: 'Сборка мебели в Сааре и Рейнланд-Пфальце | Andrii Ryndia Solutions',
  description: 'Профессиональная сборка шкафов, кухонь, кроватей и столов. Andrii Ryndia Solutions — обсудите мебель, стоимость и дату напрямую в WhatsApp.',
  alternates: { canonical: '/' },
  robots: isPublic ? { index: true, follow: true } : { index: false, follow: false },
  icons: { icon: '/favicon.svg' },
  openGraph: { title: 'Andrii Ryndia Solutions — сборка мебели', description: 'От коробок до готовой мебели. Сборка в Сааре и Рейнланд-Пфальце.', url: '/', locale: 'ru_RU', type: 'website' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body><a href="#main" className="skip-link">Перейти к содержимому</a>{children}</body></html>;
}
