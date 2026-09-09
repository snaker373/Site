/** Only categorical context is forwarded; the shared handler enforces consent. */
export function contactEvent(event: 'whatsapp_click' | 'generate_lead', service?: string, city?: string) {
  document.dispatchEvent(new CustomEvent('saar-contact', { detail: { event, service, city } }));
}
