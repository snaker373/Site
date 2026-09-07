'use client';
import { useRef, useState, type FormEvent } from 'react';
import { site, whatsappUrl } from '@/lib/site';
import { ArrowIcon, WhatsAppIcon } from './Icons';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const contactRef = useRef<HTMLInputElement>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const inquiry = { name: String(values.get('name') || ''), city: String(values.get('city') || ''), details: String(values.get('details') || '') };
    const channel = (event.nativeEvent as SubmitEvent).submitter?.getAttribute('value') || 'whatsapp';
    if (channel === 'whatsapp') { window.location.assign(whatsappUrl(inquiry)); return; }
    const contact = String(values.get('contact') || '').trim();
    if (!contact) { contactRef.current?.setCustomValidity('Укажите телефон или email, чтобы мы могли ответить.'); contactRef.current?.reportValidity(); return; }
    setStatus('pending'); setError('');
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(15000),
        body: JSON.stringify({ access_key: '3ffcab5f-8a20-4624-8bf7-bbebddd8b882', from_name: site.name, subject: `Запрос на сборку — ${inquiry.city}`, name: inquiry.name, ...(contact.includes('@') ? { email: contact } : { phone: contact }), city: inquiry.city, message: `${inquiry.details}\nКонтакт: ${contact}\nQuelle: saarmontage.de/`, botcheck: values.get('botcheck') || '' }),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error('Rejected');
      setStatus('success'); form.reset();
    } catch { setStatus('error'); setError('Не удалось передать заявку. Данные сохранены — попробуйте ещё раз или откройте WhatsApp.'); }
  }
  return <form className="contact-form rounded-2xl shadow-sm" onSubmit={submit} aria-label="Заявка на сборку мебели"><h3>Расскажите о вашей мебели</h3><p>Пара деталей — и начнём с конкретики.</p><div className="form-row"><label>Ваше имя<input name="name" autoComplete="name" placeholder="Как к вам обращаться" maxLength={80} required/></label><label>Город или индекс<input name="city" autoComplete="address-level2" placeholder="Например, Saarbrücken" maxLength={100} required/></label></div><label>Что нужно собрать?<textarea name="details" rows={3} placeholder="Модель мебели, размеры или ссылка на товар…" maxLength={2000} required/></label><label>Телефон или email <span className="label-note">для обратной связи</span><input ref={contactRef} name="contact" autoComplete="email" placeholder="+49 … или ваш email" maxLength={150} onInput={() => contactRef.current?.setCustomValidity('')}/></label><input name="botcheck" type="checkbox" tabIndex={-1} className="hidden" aria-hidden="true"/><p className="form-privacy">Нажимая кнопку, вы передаёте данные для ответа на запрос. <a href="/datenschutz/">Конфиденциальность</a></p><button type="submit" name="channel" value="whatsapp" className="button button-whatsapp w-full"><WhatsAppIcon/>Продолжить в WhatsApp<ArrowIcon/></button><p className="whatsapp-note">Откроется готовый текст. Отправьте его в чате.</p><button type="submit" name="channel" value="email" className="email-submit" disabled={status === 'pending'}>{status === 'pending' ? 'Передаём заявку…' : 'Или отправить заявку на email'}<ArrowIcon/></button><div aria-live="polite" aria-atomic="true">{status === 'success' && <p className="form-success" role="status">Сервис принял заявку. Андрей свяжется с вами по указанному контакту.</p>}{status === 'error' && <p className="form-error" role="alert">{error}</p>}</div></form>;
}
