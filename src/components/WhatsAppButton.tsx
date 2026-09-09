'use client';
import { whatsappUrl, type Inquiry } from '@/lib/site';
import { contactEvent } from '@/lib/contact-events';
import { ArrowIcon, WhatsAppIcon } from './Icons';
export function WhatsAppButton({ children = 'Montage anfragen', className = '', inquiry = {} }: { children?: React.ReactNode; className?: string; inquiry?: Inquiry }) {
  return <a className={`button button-whatsapp ${className}`} href={whatsappUrl(inquiry)} onAuxClick={event=>{if(event.button===1)contactEvent('whatsapp_click',inquiry.service,inquiry.city);}} onClick={event => {contactEvent('whatsapp_click',inquiry.service,inquiry.city);event.currentTarget.href=whatsappUrl({...inquiry,code:'SM-'+crypto.randomUUID().replaceAll('-','').slice(0,12).toUpperCase()});}} target="_blank" rel="noopener noreferrer"><WhatsAppIcon/><span>{children}</span><ArrowIcon className="button-arrow"/></a>;
}

