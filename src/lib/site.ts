export const site = {
  name: 'Andrii Ryndia Solutions',
  phone: '+49 151 72377683',
  whatsappNumber: '4915172377683',
  email: '7007779@gmail.com',
  // Values supplied in the redesign brief; verify before public launch.
  rating: '4.9',
  projects: '100+',
  responseTime: 'Обычно в течение рабочего дня',
};

export type Inquiry = { name?: string; city?: string; details?: string };
export function whatsappUrl({ name, city, details }: Inquiry = {}) {
  const message = [
    'Здравствуйте, Андрей! Хочу заказать сборку мебели.',
    name?.trim() && `Меня зовут: ${name.trim()}`,
    city?.trim() && `Город: ${city.trim()}`,
    details?.trim() && `Мебель и пожелания: ${details.trim()}`,
    'Подскажите стоимость и ближайшую дату.',
    'Quelle: saarmontage.de/',
  ].filter(Boolean).join('\n');
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const categories = ['Все работы', 'Шкафы', 'Кухни', 'Кровати', 'Столы'] as const;
export type Category = typeof categories[number];
export const projects: { image: string; title: string; category: Category; detail: string }[] = [
  { image: 'gallery-hero.jpg', title: 'Продумано до последней полки', category: 'Шкафы', detail: 'IKEA PAX · система хранения' },
  { image: 'g43.jpg', title: 'Кухня, готовая к жизни', category: 'Кухни', detail: 'Кухонный гарнитур · сборка и установка' },
  { image: 'gallery-3.jpg', title: 'Место для спокойного отдыха', category: 'Кровати', detail: 'IKEA HEMNES · кровать с хранением' },
  { image: 'g248.jpg', title: 'Порядок на рабочем месте', category: 'Столы', detail: 'IKEA MITTZON · рабочие столы' },
  { image: 'g132.jpg', title: 'У каждой вещи своё место', category: 'Шкафы', detail: 'IKEA PAX · гардеробная система' },
  { image: 'gallery-2.jpg', title: 'Аккуратность в каждой детали', category: 'Шкафы', detail: 'IKEA PAX · сборка шкафа' },
];

