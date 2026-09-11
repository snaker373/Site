export const site = {
  name: 'Andrii Ryndia Solutions',
  phone: '+49 151 72377683',
  whatsappNumber: '4915172377683',
  email: 'info@saarmontage.de',
  responseTime: 'Persönliche Rückmeldung zu Ihrer Anfrage',
};

export type Inquiry = { name?: string; city?: string; details?: string; service?: string; code?: string; page?: string };
export function whatsappUrl({ name, city, details, service = 'Möbelmontage', code, page }: Inquiry = {}) {
  const message = [
    `Guten Tag, ich möchte ${service} bei Ihnen anfragen.`,
    name?.trim() && `Mein Name: ${name.trim()}`,
    city?.trim() && `Montageort: ${city.trim()}`,
    details?.trim() && `Mein Projekt: ${details.trim()}`,
    'Können Sie mir ein Angebot und einen möglichen Termin nennen?',
    `Quelle: saarmontage.de${page?.startsWith('/')?page:'/'}`,
    code && `Anfragecode: ${code}`,
  ].filter(Boolean).join('\n');
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const categories = ['Alle Arbeiten', 'Schränke', 'Küchen', 'Betten', 'Büro'] as const;
export type Category = typeof categories[number];
export const projects: { image: string; title: string; category: Category; detail: string }[] = [
  { image: 'gallery-hero.jpg', title: 'Stauraum, der zu Ihrem Zuhause passt.', category: 'Schränke', detail: 'IKEA PAX · Kleiderschrank' },
  { image: 'kueche-schwarz-montage-01.png', title: 'Eine Küche. Viele sorgfältige Details.', category: 'Küchen', detail: 'Küche · Schränke und Arbeitsplatte' },
  { image: 'gallery-3.jpg', title: 'Ein guter Platz zum Abschalten.', category: 'Betten', detail: 'IKEA HEMNES · Tagesbett' },
  { image: 'g248.jpg', title: 'Bereit für einen produktiven Tag.', category: 'Büro', detail: 'IKEA MITTZON · Schreibtisch' },
  { image: 'g132.jpg', title: 'Für jede Sache den richtigen Platz.', category: 'Schränke', detail: 'IKEA PAX · Innenausstattung' },
  { image: 'g37.jpg', title: 'Aus Ihrem Plan wird Ihre Küche.', category: 'Küchen', detail: 'Küchenmontage · Originalfoto' },
];

export const serviceItems = [
  {slug:'kuechenmontage',name:'Küchenmontage',image:'kueche-schwarz-montage-01.png',text:'Vom Küchenplan bis zu sauber ausgerichteten Fronten.',label:'Für das Herz Ihres Zuhauses'},
  {slug:'pax-montage',name:'IKEA PAX Montage',image:'g132.jpg',text:'Korpusse, Innenausstattung und Türen, die zusammenpassen.',label:'Ordnung bis ins Detail'},
  {slug:'moebelmontage',name:'Möbelmontage',image:'project-2026-19.jpg',text:'Regale, Kommoden, Schränke und Wohnmöbel fachgerecht aufbauen.',label:'Für jeden Raum'},
  {slug:'ikea-moebelmontage',name:'IKEA Möbelmontage',image:'g09.jpg',text:'KALLAX, BESTÅ, HEMNES und weitere IKEA Möbel.',label:'Ihr Einkauf, fertig aufgebaut'},
  {slug:'schrankmontage',name:'Schrankmontage',image:'g124.jpg',text:'Kleiderschränke und Garderoben sorgfältig montieren.',label:'Mehr Platz für Ihren Alltag'},
  {slug:'bettmontage',name:'Bettmontage',image:'g030.jpg',text:'Bettgestelle und Stauraumbetten nach Anleitung aufbauen.',label:'Entspannt in den Feierabend'},
  {slug:'bueromoebelmontage',name:'Büromöbelmontage',image:'g248.jpg',text:'Schreibtische und Stauraum für Büro und Homeoffice.',label:'Ein Arbeitsplatz, der passt'},
];
export const inquiryOptions = [
  { value: 'Möbelmontage', label: 'Möbelmontage' },
  { value: 'IKEA Möbelmontage', label: 'IKEA Möbelmontage (inkl. PAX)' },
  { value: 'Küchenmontage', label: 'Küchenmontage' },
  { value: 'Schrankmontage', label: 'Schrankmontage' },
  { value: 'Bettmontage', label: 'Bettmontage' },
  { value: 'Büromöbelmontage', label: 'Büromöbelmontage' },
  { value: 'Demontage & Wiederaufbau', label: 'Demontage & Wiederaufbau' },
  { value: 'Kompletteinrichtung', label: 'Mehrere Möbel / Kompletteinrichtung' },
  { value: 'Marktservice für Geschäftskunden', label: 'Gewerblicher Auftrag / Baumarkt' },
  { value: 'Sonstiges', label: 'Sonstiges' },
] as const;
export const locations = [
  {slug:'saarbruecken',name:'Saarbrücken',latitude:49.2402,longitude:6.9969},
  {slug:'voelklingen',name:'Völklingen',latitude:49.2516,longitude:6.8587},
  {slug:'saarlouis',name:'Saarlouis',latitude:49.3137,longitude:6.7526},
  {slug:'homburg',name:'Homburg',latitude:49.3264,longitude:7.3387},
  {slug:'neunkirchen',name:'Neunkirchen',latitude:49.3445,longitude:7.1800},
  {slug:'st-ingbert',name:'St. Ingbert',latitude:49.2765,longitude:7.1169},
  {slug:'merzig',name:'Merzig',latitude:49.4433,longitude:6.6387},
  {slug:'zweibruecken',name:'Zweibrücken',latitude:49.2490,longitude:7.3640},
];

