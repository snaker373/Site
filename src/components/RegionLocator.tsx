'use client';

import { useEffect, useState } from 'react';
import { locations } from '@/lib/site';
import { ArrowIcon, PinIcon } from './Icons';

const storageKey = 'saarmontage-nearest-region';
type Region = (typeof locations)[number];

function distance(latitude:number, longitude:number, region:Region) {
  const toRadians = (value:number) => value * Math.PI / 180;
  const latitudeDelta = toRadians(region.latitude - latitude);
  const longitudeDelta = toRadians(region.longitude - longitude);
  const a = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(toRadians(latitude)) * Math.cos(toRadians(region.latitude)) * Math.sin(longitudeDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function nearestRegion(latitude:number, longitude:number) {
  return [...locations].sort((a,b)=>distance(latitude,longitude,a)-distance(latitude,longitude,b))[0];
}

function saveRegion(region:Region) {
  sessionStorage.setItem(storageKey, JSON.stringify({slug:region.slug,name:region.name}));
  window.dispatchEvent(new CustomEvent('saarmontage-region',{detail:region}));
}

export function RememberRegion({slug}:{slug:string}) {
  useEffect(()=>{const region=locations.find(item=>item.slug===slug);if(region)saveRegion(region);},[slug]);
  return null;
}

export function RegionLocator() {
  const [region,setRegion]=useState<Region|null>(null);
  const [status,setStatus]=useState<'idle'|'loading'|'denied'|'unavailable'>('idle');

  function locate() {
    if(!navigator.geolocation){setStatus('unavailable');return;}
    setStatus('loading');
    navigator.geolocation.getCurrentPosition(position=>{
      const found=nearestRegion(position.coords.latitude,position.coords.longitude);
      setRegion(found);saveRegion(found);setStatus('idle');
    },error=>setStatus(error.code===error.PERMISSION_DENIED?'denied':'unavailable'),{enableHighAccuracy:false,timeout:7000,maximumAge:86400000});
  }

  useEffect(()=>{
    try {
      const saved=JSON.parse(sessionStorage.getItem(storageKey)||'null');
      const match=locations.find(item=>item.slug===saved?.slug);
      if(match){setRegion(match);return;}
    } catch {}
    if('permissions' in navigator) navigator.permissions.query({name:'geolocation'}).then(permission=>{if(permission.state==='granted')locate();}).catch(()=>{});
  },[]);

  return <div className="region-locator" aria-live="polite">
    <PinIcon/>
    <div>{region?<><small>NÄCHSTE SERVICEREGION</small><strong>{region.name}</strong><a href={`/moebelmontage-${region.slug}/`}>Regionale Leistungen ansehen <ArrowIcon/></a></>:<><strong>Leistungen in Ihrer Nähe finden</strong><span>{status==='denied'?'Standortfreigabe abgelehnt. Wählen Sie Ihren Ort aus der Liste.':status==='unavailable'?'Standort konnte nicht ermittelt werden. Wählen Sie Ihren Ort aus der Liste.':'Ihre Position wird nur im Browser mit unseren Serviceregionen verglichen.'}</span><button type="button" onClick={locate} disabled={status==='loading'}>{status==='loading'?'Standort wird ermittelt …':'Standort verwenden'}</button></>}</div>
  </div>;
}

export function getSavedRegionName() {
  try { return JSON.parse(sessionStorage.getItem(storageKey)||'null')?.name as string|undefined; } catch { return undefined; }
}
