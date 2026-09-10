'use client';
import { useRef, useState, type FormEvent } from 'react';
import { site, whatsappUrl, inquiryOptions } from '@/lib/site';
import { contactEvent } from '@/lib/contact-events';
import { ArrowIcon, WhatsAppIcon } from './Icons';

export function ContactForm(){
 const [status,setStatus]=useState<'idle'|'pending'|'success'|'error'>('idle');
 const [selectedService,setSelectedService]=useState('Möbelmontage');
 const contactRef=useRef<HTMLInputElement>(null);
 const openedAt=useRef(Date.now());
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(status==='pending')return;
  const form=event.currentTarget,values=new FormData(form);if(values.get('botcheck'))return;
  const otherService=String(values.get('otherService')||'').trim();
  if(selectedService==='Sonstiges'&&!otherService)return;
  const service=selectedService==='Sonstiges'?`Sonstiges: ${otherService}`:selectedService;
  const inquiry={name:String(values.get('name')||'').trim(),city:String(values.get('city')||'').trim(),details:String(values.get('details')||'').trim(),service,code:'SM-'+crypto.randomUUID().replaceAll('-','').slice(0,12).toUpperCase()};
  if(!inquiry.name||!inquiry.city||!inquiry.details)return;
  const channel=(event.nativeEvent as SubmitEvent).submitter?.getAttribute('value')||'whatsapp';
  if(channel==='whatsapp'){contactEvent('whatsapp_click',selectedService,inquiry.city);window.location.assign(whatsappUrl(inquiry));return;}
  const contact=String(values.get('contact')||'').trim();
  if(!contact){contactRef.current?.setCustomValidity('Bitte geben Sie eine Telefonnummer oder E-Mail-Adresse an.');contactRef.current?.reportValidity();return;}
  if(Date.now()-openedAt.current<1800){setStatus('error');return;}
  let recent:number[]=[];
  try {
   const stored=JSON.parse(localStorage.getItem('sm-form-submissions')||'[]');
   if(Array.isArray(stored))recent=stored.filter((time):time is number=>typeof time==='number'&&Date.now()-time<600000);
  } catch {}
  if(recent.length>=3){setStatus('error');return;}
  setStatus('pending');
  try{
   const response=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(15000),body:JSON.stringify({access_key:process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY||'3ffcab5f-8a20-4624-8bf7-bbebddd8b882',from_name:site.name,subject:'Montageanfrage – '+service,name:inquiry.name,...(contact.includes('@')?{email:contact}:{phone:contact}),city:inquiry.city,service,message:inquiry.details+'\nKontakt: '+contact+'\nQuelle: saarmontage.de'+window.location.pathname+'\nAnfragecode: '+inquiry.code,botcheck:''})});
   const result=await response.json();if(!response.ok||!result.success)throw new Error('Rejected');
   localStorage.setItem('sm-form-submissions',JSON.stringify([...recent,Date.now()]));contactEvent('generate_lead',selectedService,inquiry.city);setStatus('success');form.reset();setSelectedService('Möbelmontage');openedAt.current=Date.now();
  }catch{setStatus('error');}
 }
 return <form className="contact-form" onSubmit={submit} aria-label="Montageanfrage"><h3>Was darf ich für Sie aufbauen?</h3><p>Ein paar Details helfen bei der Einschätzung.<br/>Pflichtfelder sind mit * markiert.</p><label>Leistung *<select name="service" value={selectedService} onChange={event=>setSelectedService(event.target.value)} required>{inquiryOptions.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</select></label>{selectedService==='Sonstiges'&&<label className="other-service-field">Was möchten Sie anfragen? *<input name="otherService" placeholder="Beschreiben Sie die gewünschte Arbeit" maxLength={160} autoFocus required/></label>}<div className="form-row"><label>Ihr Name *<input name="name" autoComplete="name" placeholder="Vor- und Nachname" maxLength={80} required/></label><label>Montageort / PLZ *<input name="city" autoComplete="address-level2" placeholder="z. B. Saarbrücken" maxLength={100} required/></label></div><label>Ihr Projekt *<textarea name="details" rows={4} placeholder="Möbelmodell, Anzahl, Produktlink oder Wunschtermin …" maxLength={2000} required/></label><label>Telefon oder E-Mail <span className="label-note">für eine Rückmeldung</span><input ref={contactRef} name="contact" placeholder="+49 … oder Ihre E-Mail-Adresse" maxLength={150} onInput={()=>contactRef.current?.setCustomValidity('')}/></label><input name="botcheck" type="text" tabIndex={-1} className="hidden" aria-hidden="true" autoComplete="off"/><p className="form-privacy">Ihre Angaben werden über Web3Forms zur Bearbeitung Ihrer Anfrage übermittelt. Weitere Informationen im <a href="/datenschutz/">Datenschutz</a>.</p><button type="submit" name="channel" value="whatsapp" onClick={()=>contactRef.current?.setCustomValidity('')} disabled={status==='pending'} className="button button-whatsapp w-full"><WhatsAppIcon/>In WhatsApp öffnen<ArrowIcon/></button><p className="whatsapp-note">Sie prüfen den vorbereiteten Text und senden ihn selbst ab.</p><button type="submit" name="channel" value="email" className="email-submit" disabled={status==='pending'}>{status==='pending'?'Anfrage wird gesendet …':'Lieber per E-Mail senden'}<ArrowIcon/></button><div aria-live="polite" aria-atomic="true">{status==='success'&&<p className="form-success" role="status">Vielen Dank! Ihre Anfrage wurde übermittelt. Andrii meldet sich bei Ihnen.</p>}{status==='error'&&<p className="form-error" role="alert">Der Versand ist momentan nicht möglich oder wurde zu häufig versucht. Bitte warten Sie kurz oder nutzen Sie WhatsApp bzw. Telefon.</p>}</div></form>;
}
