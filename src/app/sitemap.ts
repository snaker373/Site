import type { MetadataRoute } from 'next';
import { routeSlugs } from '@/lib/page-content';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap{const origin=process.env.SITE_PUBLIC==='true'?'https://saarmontage.de':'https://saarmontage.cuddly-spool-0095.chatgpt.site';return ['',...routeSlugs].map(slug=>({url:`${origin}/${slug}${slug?'/':''}`,changeFrequency:slug?'monthly':'weekly',priority:slug?0.7:1}));}
