'use client';
import Script from 'next/script';
import { useState } from 'react';

/** Shares the consent and safe event handling used by the static service pages. */
export function Consent() {
  const [ready, setReady] = useState(false);
  return <>
    <aside id="cookie-panel" className="analytics-consent" aria-label="Optionale Statistik">
      <strong>Optionale Statistik</strong>
      <p>Mit Ihrer Zustimmung messen wir Seitenaufrufe und Kontaktaktionen. Die Website funktioniert auch ohne Statistik. <a href="/datenschutz/">Mehr erfahren</a></p>
      <div><button data-consent="denied">Ohne Statistik fortfahren</button><button data-consent="accepted">Statistik erlauben</button></div>
    </aside>
    <Script src="/js/attribution.js?v=20260909-mobile" onReady={() => setReady(true)}/>
    {ready && <Script src="/js/site.js?v=20260909-mobile"/>}
  </>;
}
