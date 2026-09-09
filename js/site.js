(function () {
  'use strict';
  const A=window.SaarAttribution, body=document.body;
  if(!A) return;
  const page=A.cleanPath(body.dataset.page), measurement=body.dataset.analytics;
  const analyticsEnabled=/^G-[A-Z0-9]+$/.test(measurement) && ['saarmontage.de','www.saarmontage.de','andrii-ryndia.de','www.andrii-ryndia.de'].includes(location.hostname);
  const consentKey='saarmontage-consent-v3', sessionKey='saarmontage-entry-v1';
  let consent=null, analyticsStarted=false, entry={page,...A.campaign(location.search)};
  function storageRead(store,key){try{return JSON.parse(store.getItem(key));}catch{return null;}}
  function getStore(kind){try{return window[kind];}catch{return {getItem(){},setItem(){},removeItem(){}};}}
  const local=getStore('localStorage'), session=getStore('sessionStorage');
  const saved=storageRead(local,consentKey);
  if(saved && ['accepted','denied'].includes(saved.value) && Number.isFinite(saved.at) && Date.now()-saved.at<183*86400000) consent=saved.value;
  function saveConsent(value){consent=value;try{local.setItem(consentKey,JSON.stringify({value,at:Date.now()}));}catch{}}
  function cleanReferrer(){try{return new URL(document.referrer).origin+'/';}catch{return '';}}
  function setEntry(){
    const stored=storageRead(session,sessionKey);
    if(stored && typeof stored.page==='string') entry={page:A.cleanPath(stored.page),...A.campaign('?utm_source='+encodeURIComponent(stored.source||'')+'&utm_medium='+encodeURIComponent(stored.medium||'')+'&utm_campaign='+encodeURIComponent(stored.campaign||''))};
    try{session.setItem(sessionKey,JSON.stringify(entry));}catch{}
  }
  function startAnalytics(){
    if(!analyticsEnabled || consent!=='accepted' || analyticsStarted) return;
    analyticsStarted=true; setEntry();
    window['ga-disable-'+measurement]=false;
    window.dataLayer=window.dataLayer||[];
    window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
    const cleanUrl=location.origin+page;
    window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    window.gtag('js',new Date());
    window.gtag('config',measurement,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:cleanUrl,page_referrer:cleanReferrer()});
    window.gtag('event','page_view',{page_location:cleanUrl,page_title:document.title,page_referrer:cleanReferrer()});
    const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+measurement;script.id='saar-analytics';document.head.append(script);
  }
  function track(event,service,city,placement){
    if(consent!=='accepted' || !analyticsEnabled || typeof window.gtag!=='function') return;
    window.gtag('event',event,{service:A.serviceKey(service),city:A.cityKey(city),page_path:page,entry_page:entry.page,contact_placement:placement,source_group:entry.source||'direct_or_referral',campaign_group:entry.campaign||'none',transport_type:'beacon'});
  }
  function clearAnalytics(){
    window['ga-disable-'+measurement]=true;
    try{session.removeItem(sessionKey);}catch{}
    // Disable first, then reload. No consent-mode ping is sent on withdrawal.
    document.cookie.split(';').forEach(c=>{const name=c.split('=')[0].trim();if(!/^_ga(?:_|$)/.test(name))return;const parts=location.hostname.split('.');const domains=['',location.hostname,...parts.map((_,i)=>'.'+parts.slice(i).join('.'))];domains.forEach(domain=>{document.cookie=name+'=; Max-Age=0; path=/'+(domain?'; domain='+domain:'')+'; SameSite=Lax';});});
    document.getElementById('saar-analytics')?.remove();
  }
  const panel=document.getElementById('cookie-panel');
  if(panel) panel.hidden=Boolean(consent);
  document.querySelectorAll('[data-cookie-settings]').forEach(button=>button.addEventListener('click',()=>{panel.hidden=false;panel.querySelector('button').focus();}));
  document.querySelectorAll('[data-consent]').forEach(button=>button.addEventListener('click',()=>{
    const value=button.dataset.consent;saveConsent(value);panel.hidden=true;
    if(value==='accepted')startAnalytics();else{const reload=analyticsStarted;clearAnalytics();if(reload)location.reload();}
  }));
  if(consent==='accepted')startAnalytics();
  document.addEventListener('saar-contact',event=>{
    const detail=event.detail;
    if(!detail || !['whatsapp_click','generate_lead'].includes(detail.event))return;
    try{track(detail.event,detail.service,detail.city,'homepage');}catch{}
  });
  // Capture before third-party listeners. Keep message contents out of automatic outbound-click events.
  function onWhatsApp(event){
    const anchor=event.target.closest?.('[data-whatsapp]');if(!anchor || (event.type==='auxclick'&&event.button!==1))return;
    event.stopImmediatePropagation();
    const service=anchor.dataset.service||body.dataset.service,city=anchor.dataset.city||body.dataset.city;
    anchor.href=A.whatsappUrl({service,city,page});
    try{track('whatsapp_click',service,city,anchor.dataset.placement||'content');}catch{}
    // The anchor's native navigation still runs, including keyboard and modifier clicks.
  }
  window.addEventListener('click',onWhatsApp,true);window.addEventListener('auxclick',onWhatsApp,true);
  const nav=document.getElementById('navigation'), toggle=document.querySelector('.menu-toggle');
  function closeMenu(){nav?.classList.remove('open');toggle?.setAttribute('aria-expanded','false');toggle?.setAttribute('aria-label','Menü öffnen');}
  toggle?.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Menü schließen':'Menü öffnen');});
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  window.addEventListener('resize',()=>{if(window.innerWidth>960)closeMenu();});
  document.addEventListener('click',event=>{document.querySelectorAll('.dropdown[open]').forEach(d=>{if(!d.contains(event.target))d.open=false;});if(nav?.classList.contains('open')&&!event.target.closest('.header'))closeMenu();});
  document.querySelectorAll('.dropdown').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)document.querySelectorAll('.dropdown').forEach(other=>{if(other!==d)other.open=false;});}));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(nav?.classList.contains('open')){closeMenu();toggle.focus();}document.querySelectorAll('.dropdown[open]').forEach(d=>{d.open=false;d.querySelector('summary').focus();});}});
  const sections=[...document.querySelectorAll('#gallery-categories [data-gallery-category]')],filters=[...document.querySelectorAll('[data-filter]')];
  function filterPhotos(){
    const hash=location.hash.slice(1),category=sections.some(s=>s.dataset.galleryCategory===hash)?hash:'all';
    sections.forEach(s=>s.hidden=category!=='all'&&s.dataset.galleryCategory!==category);
    filters.forEach(f=>{if(f.dataset.filter===category)f.setAttribute('aria-current','true');else f.removeAttribute('aria-current');});
    const status=document.getElementById('filter-status');if(status)status.textContent=category==='all'?'Alle Projektkategorien werden angezeigt.':filters.find(f=>f.dataset.filter===category)?.textContent+' wird angezeigt.';
  }
  if(sections.length){filterPhotos();window.addEventListener('hashchange',filterPhotos);filters.forEach(f=>f.addEventListener('click',event=>{event.preventDefault();history.pushState(null,'',f.getAttribute('href'));filterPhotos();}));window.addEventListener('popstate',filterPhotos);}
  const dialog=document.getElementById('photo-dialog');let photos=[],photoIndex=0;
  function showPhoto(){const item=photos[photoIndex];if(!item)return;dialog.querySelector('figure img').src=item.dataset.photo;dialog.querySelector('figure img').alt=item.dataset.caption;dialog.querySelector('figcaption').textContent=`${item.dataset.caption} · ${photoIndex+1} / ${photos.length}`;}
  document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{
    photos=[...document.querySelectorAll('[data-photo]')].filter(b=>!b.closest('[hidden]')&&(!b.closest('.more-photos')||b.closest('.more-photos').open));photoIndex=photos.indexOf(button);showPhoto();dialog.showModal();
  }));
  dialog?.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  function step(delta){photoIndex=(photoIndex+delta+photos.length)%photos.length;showPhoto();}
  dialog?.querySelector('.photo-prev').addEventListener('click',()=>step(-1));dialog?.querySelector('.photo-next').addEventListener('click',()=>step(1));
  dialog?.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  dialog?.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();step(-1);}if(event.key==='ArrowRight'){event.preventDefault();step(1);}});
  dialog?.addEventListener('close',()=>{dialog.querySelector('figure img').removeAttribute('src');photos[photoIndex]?.focus();});
  const form=document.getElementById('contact-form');
  if(form){
    const q=new URLSearchParams(location.search),f=form.elements,status=document.getElementById('form-status');
    const requestedService=q.get('service');
    if(requestedService==='pax-montage')f.service.value='ikea-moebelmontage';
    else if(Object.hasOwn(A.services,requestedService))f.service.value=requestedService;
    if(A.cities.includes(q.get('city')))f.city.value=q.get('city');
    const otherWrap=form.querySelector('[data-other-service]');
    const updateOther=()=>{const active=f.service.value==='sonstiges';otherWrap.hidden=!active;f.otherService.required=active;if(!active)f.otherService.value='';};
    const updateContext=()=>{updateOther();body.dataset.service=A.services[f.service.value];body.dataset.city=f.city.value;document.querySelectorAll('[data-whatsapp]').forEach(a=>{a.dataset.service=body.dataset.service;a.dataset.city=body.dataset.city;});};updateContext();f.service.addEventListener('change',()=>{updateContext();if(f.service.value==='sonstiges')f.otherService.focus();});f.city.addEventListener('input',updateContext);
    [f.phone,f.email].forEach(input=>input.addEventListener('input',()=>f.phone.setCustomValidity('')));
    form.querySelector('[value="whatsapp"]').addEventListener('click',()=>f.phone.setCustomValidity(''));
    let pending=false;
    form.addEventListener('submit',async event=>{
      event.preventDefault();event.stopImmediatePropagation();if(pending)return;
      const channel=event.submitter?.value||'whatsapp';f.phone.setCustomValidity('');
      if(channel==='email'&&!f.phone.value.trim()&&!f.email.value.trim())f.phone.setCustomValidity('Bitte geben Sie eine Telefonnummer oder E-Mail-Adresse an.');
      if(!form.reportValidity()||f.botcheck.value)return;
      const otherService=f.service.value==='sonstiges'?f.otherService.value.trim():'';
      const details=(otherService?'Gewünschte Leistung: '+otherService+'\n\n':'')+f.message.value.trim();
      const data={service:f.service.value,city:f.city.value.trim(),name:f.name.value.trim(),phone:f.phone.value.trim(),email:f.email.value.trim(),details,page};
      if(!data.name||!data.city||!data.details){status.className='error';status.textContent='Bitte füllen Sie Name, Montageort und Projektbeschreibung aus.';return;}
      status.className='';
      if(channel==='whatsapp'){
        const url=A.whatsappUrl(data);
        try{track('whatsapp_click',data.service,data.city,'contact-form');}catch{}
        window.open(url,'_blank','noopener,noreferrer');
        status.textContent='Der Nachrichtentext ist vorbereitet. Bitte senden Sie ihn in WhatsApp ab. Falls sich kein Fenster öffnet: ';
        const retry=document.createElement('a');retry.href=url;retry.target='_blank';retry.rel='noopener noreferrer';retry.textContent='WhatsApp öffnen';retry.style.textDecoration='underline';retry.addEventListener('click',ev=>ev.stopImmediatePropagation(),true);status.append(retry);return;
      }
      pending=true;const buttons=[...form.querySelectorAll('[type="submit"]')];buttons.forEach(b=>b.disabled=true);status.textContent='Ihre Anfrage wird gesendet …';
      const controller=new AbortController(), timeout=setTimeout(()=>controller.abort(),15000);
      try{
        const serviceLabel=A.services[data.service]+(otherService?' – '+otherService:'');
        const payload={access_key:'3ffcab5f-8a20-4624-8bf7-bbebddd8b882',from_name:'Saarmontage Website',subject:'Montageanfrage – '+serviceLabel,name:data.name,phone:data.phone,service:serviceLabel,city:data.city,message:A.message(data),botcheck:''};if(data.email)payload.email=data.email;
        const response=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal});
        const result=await response.json();if(!response.ok||!result.success)throw new Error('submission failed');
        status.textContent='Vielen Dank! Ihre Anfrage wurde übermittelt. Andrii meldet sich bei Ihnen.';
        try{track('generate_lead',data.service,data.city,'email-form');}catch{}
        form.reset();f.phone.setCustomValidity('');updateContext();
      }catch{status.className='error';status.textContent='Der Versand konnte nicht bestätigt werden. Ihre Angaben bleiben erhalten. Bitte versuchen Sie es erneut oder nutzen Sie WhatsApp bzw. Telefon.';}
      finally{clearTimeout(timeout);pending=false;buttons.forEach(b=>b.disabled=false);}
    });
  }
})();
