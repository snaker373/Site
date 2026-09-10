import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import routes from '../../../content/routes.json';
import { InternalPage } from '@/components/InternalPage';
import { regionPages, routeSlugs, servicePages } from '@/lib/page-content';

export const dynamicParams = false;
export function generateStaticParams(){return routeSlugs.map(slug=>({slug}));}

type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;const route=routes.find(item=>item.path===`/${slug}/`);if(!route)notFound();
 const service=servicePages.find(item=>item.slug===slug);const region=regionPages.find(item=>`moebelmontage-${item.slug}`===slug);
 const description=service?.description||(region?`Möbelmontage in ${region.name}: Küchen, Schränke, IKEA Möbel und PAX sorgfältig aufbauen lassen. Persönlicher Service in ${region.districts.join(', ')} und Umgebung.`:`${route.title}. Persönlicher Montageservice von Andrii Ryndia Solutions im Saarland.`);
 const keywords=region?[`Möbelmontage ${region.name}`,`Möbelaufbau ${region.name}`,`Küchenmontage ${region.name}`,`IKEA Montage ${region.name}`,`Schrankmontage ${region.name}`,`IKEA PAX Montage ${region.name}`]:service?[service.name,`${service.name} Saarland`,'Möbelmontage Saarbrücken','Saarmontage']:['Möbelmontage Saarland','Küchenmontage Saarland','Saarmontage'];
 return {title:route.title,description,keywords,alternates:{canonical:`/${slug}/`},openGraph:{title:route.title,description,url:`/${slug}/`,siteName:'Saarmontage · Andrii Ryndia Solutions',locale:'de_DE',type:'website',images:[{url:'/opengraph-image',width:1200,height:630,alt:'Saarmontage – Möbel- und Küchenmontage im Saarland'}]},twitter:{card:'summary_large_image',title:route.title,description,images:['/opengraph-image']}};
}
export default async function Page({params}:Props){const {slug}=await params;if(!routeSlugs.includes(slug))notFound();return <InternalPage slug={slug}/>;}
