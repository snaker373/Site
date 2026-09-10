import type { MetadataRoute } from 'next';
export const dynamic='force-static';
export default function robots():MetadataRoute.Robots{const isPublic=process.env.SITE_PUBLIC==='true';const origin=isPublic?'https://saarmontage.de':'https://saarmontage.cuddly-spool-0095.chatgpt.site';return {rules:{userAgent:'*',allow:isPublic?'/':undefined,disallow:isPublic?undefined:'/'},sitemap:`${origin}/sitemap.xml`};}
