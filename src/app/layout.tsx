import type { Metadata } from 'next';
import { Consent } from '@/components/Consent';
import './globals.css';
import './redesign.css';
import '../../css/navigation.css';
const isPublic = process.env.SITE_PUBLIC === 'true';
const origin = isPublic ? 'https://saarmontage.de' : 'https://saarmontage.cuddly-spool-0095.chatgpt.site';
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: 'Möbelmontage & Küchenmontage im Saarland | Andrii Ryndia',
  description: 'Möbel- und Küchenmontage im Saarland: IKEA PAX, Schränke, Betten und Büromöbel. Persönlicher Montageservice von Andrii Ryndia. Jetzt anfragen.',
  keywords: ['Möbelmontage Saarland','Möbelmontage Saarbrücken','Küchenmontage Saarland','IKEA Möbelmontage','IKEA PAX Montage','Schrankmontage','Saarmontage'],
  category: 'Möbelmontage und Küchenmontage',
  other: { 'geo.region':'DE-SL', 'geo.placename':'Saarbrücken' },
  alternates: { canonical: '/' },
  robots: isPublic ? { index: true, follow: true } : { index: false, follow: false },
  icons: { icon: '/favicon.svg' },
  openGraph: { title: 'Andrii Ryndia Solutions · Saarmontage', description: 'Von den Kartons bis zum fertigen Möbel. Persönliche Montage im Saarland.', url: '/', siteName:'Saarmontage · Andrii Ryndia Solutions', locale: 'de_DE', type: 'website', images:[{url:'/opengraph-image',width:1200,height:630,alt:'Saarmontage – Möbel- und Küchenmontage im Saarland'}] },
  twitter:{card:'summary_large_image',title:'Andrii Ryndia Solutions · Saarmontage',description:'Möbel- und Küchenmontage im Saarland.',images:['/opengraph-image']},
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de"><body data-page="/" data-service="Möbelmontage" data-city="" data-analytics={isPublic?'G-0XY9QDMYG3':'disabled'}><a href="#main" className="skip-link">Zum Inhalt springen</a>{children}<Consent/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'LocalBusiness',name:'Andrii Ryndia Solutions',alternateName:'Saarmontage',url:origin,telephone:'+4915172377683',email:'info@saarmontage.de',areaServed:[{'@type':'AdministrativeArea',name:'Saarland'},{'@type':'AdministrativeArea',name:'Rheinland-Pfalz'}]})}}/></body></html>;
}

