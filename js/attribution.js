(function (root) {
  'use strict';
  const services = {
    moebelmontage: 'Möbelmontage', 'ikea-moebelmontage': 'IKEA Möbelmontage',
    'pax-montage': 'IKEA PAX Montage', kuechenmontage: 'Küchenmontage',
    schrankmontage: 'Schrankmontage', bettmontage: 'Bettmontage', bueromoebelmontage: 'Büromöbelmontage',
    demontage: 'Demontage & Wiederaufbau', kompletteinrichtung: 'Kompletteinrichtung',
    gewerbekunden: 'Marktservice für Geschäftskunden', sonstiges: 'Sonstiges'
  };
  const cities = ['Saarbrücken','Völklingen','Saarlouis','Homburg','Neunkirchen','St. Ingbert','Merzig','Zweibrücken'];
  function serviceKey(value) { return Object.keys(services).find(k => k === value || services[k] === value) || 'moebelmontage'; }
  function cityKey(value) { return cities.find(c => String(value).toLocaleLowerCase('de').includes(c.toLocaleLowerCase('de'))) || 'other'; }
  function cleanPath(value) { const p=String(value || '/').split(/[?#]/)[0]; return /^\/(?:[a-z0-9-]+\/)*$/.test(p) ? p : '/'; }
  function campaign(search) {
    const q=new URLSearchParams(search);
    // Only known campaign labels are sent to analytics. Never pass arbitrary URL input.
    const pick=(key,allowed)=>allowed.includes(q.get(key))?q.get(key):q.get(key)?'other':'';
    return { source:pick('utm_source',['google','bing','facebook','instagram','flyer','google_business']),
      medium:pick('utm_medium',['cpc','organic','social','referral','print']),
      campaign:pick('utm_campaign',['kueche','pax','moebel','regional']) };
  }
  function inquiryId() {
    if (root.crypto && root.crypto.randomUUID) return 'SM-' + root.crypto.randomUUID().replaceAll('-','').slice(0,12).toUpperCase();
    return 'SM-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2,7).toUpperCase();
  }
  function message({service='Möbelmontage',city='',page='/',id=inquiryId(),name='',phone='',email='',details=''}) {
    let text=`Guten Tag, ich möchte ${services[serviceKey(service)]}${city?' in '+String(city).trim():''} bei Ihnen anfragen. Können Sie mir ein Angebot und einen möglichen Termin nennen?`;
    if(name) text+='\n\nMein Name: '+name;
    if(phone) text+='\nTelefon: '+phone;
    if(email) text+='\nE-Mail: '+email;
    if(details) text+='\n\nMein Projekt:\n'+details;
    return text+`\n\nQuelle: saarmontage.de${cleanPath(page)}\nAnfragecode: ${id}`;
  }
  function whatsappUrl(input) { return 'https://wa.me/4915172377683?text=' + encodeURIComponent(message(input)); }
  root.SaarAttribution={services,cities,serviceKey,cityKey,cleanPath,campaign,inquiryId,message,whatsappUrl};
})(typeof window==='undefined'?globalThis:window);
