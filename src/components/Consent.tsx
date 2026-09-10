'use client';
import { useEffect, useState } from 'react';

type ConsentChoice = 'accepted' | 'denied';

const consentKey = 'saarmontage-consent-v3';
const consentLifetime = 183 * 24 * 60 * 60 * 1000;

function readConsent(): ConsentChoice | null {
  try {
    const saved = JSON.parse(localStorage.getItem(consentKey) || 'null');
    if (saved && ['accepted', 'denied'].includes(saved.value) && Date.now() - saved.at < consentLifetime) return saved.value;
  } catch {}
  return null;
}

function cleanCampaign(value: string | null, allowed: string[]) {
  return value ? (allowed.includes(value) ? value : 'other') : '';
}

export function Consent() {
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  // Render the banner on the first HTML response; returning visitors are hidden
  // immediately after their saved choice is read in the browser.
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const saved = readConsent();
    setChoice(saved);
    setVisible(!saved);
  }, []);

  useEffect(() => {
    const showSettings = () => setVisible(true);
    const buttons = document.querySelectorAll<HTMLElement>('[data-cookie-settings]');
    buttons.forEach(button => button.addEventListener('click', showSettings));
    return () => buttons.forEach(button => button.removeEventListener('click', showSettings));
  }, []);

  useEffect(() => {
    if (choice !== 'accepted') return;
    const measurement = document.body.dataset.analytics || '';
    const allowedHost = ['saarmontage.de', 'www.saarmontage.de', 'andrii-ryndia.de', 'www.andrii-ryndia.de'].includes(location.hostname);
    if (!/^G-[A-Z0-9]+$/.test(measurement) || !allowedHost || document.getElementById('saar-analytics')) return;

    const params = new URLSearchParams(location.search);
    const source = cleanCampaign(params.get('utm_source'), ['google', 'bing', 'facebook', 'instagram', 'flyer', 'google_business']);
    const campaign = cleanCampaign(params.get('utm_campaign'), ['kueche', 'pax', 'moebel', 'regional']);
    const path = location.pathname.replace(/[^a-z0-9/\-]/gi, '') || '/';
    const dataLayer = ((window as typeof window & { dataLayer?: unknown[] }).dataLayer ||= []);
    const gtag = (...args: unknown[]) => dataLayer.push(args);
    (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag = gtag;
    gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    gtag('js', new Date());
    gtag('config', measurement, { page_path: path, allow_google_signals: false, allow_ad_personalization_signals: false, campaign_source: source, campaign_name: campaign });
    const script = document.createElement('script');
    script.id = 'saar-analytics';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurement}`;
    document.head.append(script);
  }, [choice]);

  useEffect(() => {
    const handler = (event: Event) => {
      if (choice !== 'accepted') return;
      const detail = (event as CustomEvent).detail;
      const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
      if (!detail || !['whatsapp_click', 'generate_lead'].includes(detail.event) || !gtag) return;
      gtag('event', detail.event, { service: detail.service || 'moebelmontage', city: detail.city || 'other', page_path: location.pathname });
    };
    document.addEventListener('saar-contact', handler);
    return () => document.removeEventListener('saar-contact', handler);
  }, [choice]);

  function save(next: ConsentChoice) {
    try { localStorage.setItem(consentKey, JSON.stringify({ value: next, at: Date.now() })); } catch {}
    if (next === 'denied') {
      const measurement = document.body.dataset.analytics || '';
      (window as typeof window & Record<string, unknown>)[`ga-disable-${measurement}`] = true;
      document.getElementById('saar-analytics')?.remove();
    }
    setChoice(next);
    setVisible(false);
  }

  return <aside id="cookie-panel" className="analytics-consent" aria-label="Optionale Statistik" hidden={!visible}>
      <strong>Optionale Statistik</strong>
      <p>Mit Ihrer Zustimmung messen wir Seitenaufrufe und Kontaktaktionen. Die Website funktioniert auch ohne Statistik. <a href="/datenschutz/">Mehr erfahren</a></p>
      <div><button data-consent="denied" onClick={() => save('denied')}>Ohne Statistik fortfahren</button><button data-consent="accepted" onClick={() => save('accepted')}>Statistik erlauben</button></div>
    </aside>;
}
