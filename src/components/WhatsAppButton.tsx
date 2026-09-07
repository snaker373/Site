import { whatsappUrl, type Inquiry } from '@/lib/site';
import { ArrowIcon, WhatsAppIcon } from './Icons';
export function WhatsAppButton({ children = 'Написать в WhatsApp', className = '', inquiry = {} }: { children?: React.ReactNode; className?: string; inquiry?: Inquiry }) {
  return <a className={`button button-whatsapp ${className}`} href={whatsappUrl(inquiry)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon/><span>{children}</span><ArrowIcon className="button-arrow"/></a>;
}
