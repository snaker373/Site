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
  { image: 'g43.jpg', title: 'Eine Küche. Viele sorgfältige Details.', category: 'Küchen', detail: 'Küche · Schränke und Arbeitsplatte' },
  { image: 'gallery-3.jpg', title: 'Ein guter Platz zum Abschalten.', category: 'Betten', detail: 'IKEA HEMNES · Tagesbett' },
  { image: 'g248.jpg', title: 'Bereit für einen produktiven Tag.', category: 'Büro', detail: 'IKEA MITTZON · Schreibtisch' },
  { image: 'g132.jpg', title: 'Für jede Sache den richtigen Platz.', category: 'Schränke', detail: 'IKEA PAX · Innenausstattung' },
  { image: 'g37.jpg', title: 'Aus Ihrem Plan wird Ihre Küche.', category: 'Küchen', detail: 'Küchenmontage · Originalfoto' },
];

export const serviceItems = [
  {slug:'kuechenmontage',name:'Küchenmontage',image:'g43.jpg',text:'Vom Küchenplan bis zu sauber ausgerichteten Fronten.',label:'Für das Herz Ihres Zuhauses'},
  {slug:'pax-montage',name:'IKEA PAX Montage',image:'g132.jpg',text:'Korpusse, Innenausstattung und Türen, die zusammenpassen.',label:'Ordnung bis ins Detail'},
  {slug:'moebelmontage',name:'Möbelmontage',image:'g155.jpg',text:'Regale, Kommoden und Wohnmöbel fachgerecht aufbauen.',label:'Für jeden Raum'},
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
  {slug:'saarbruecken',name:'Saarbrücken'}, {slug:'voelklingen',name:'Völklingen'},
  {slug:'saarlouis',name:'Saarlouis'}, {slug:'homburg',name:'Homburg'},
  {slug:'neunkirchen',name:'Neunkirchen'}, {slug:'st-ingbert',name:'St. Ingbert'},
  {slug:'merzig',name:'Merzig'}, {slug:'zweibruecken',name:'Zweibrücken'},
];

