export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const sitemapUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sporthealth.com.br'}/sitemap.xml`;
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

    // A chamada é em background para o Google
    const response = await fetch(googlePingUrl);
    
    if (response.ok) {
      console.log(`[SEO Ping] Google notificado com sucesso do sitemap. URL: ${sitemapUrl}`);
      return NextResponse.json({ success: true, message: 'Google notificado' });
    } else {
      console.error(`[SEO Ping] O Google retornou status ${response.status}`);
      return NextResponse.json({ error: 'Falha ao notificar o Google' }, { status: response.status });
    }
  } catch (error) {
    console.error(`[SEO Ping] Falha na requisição de ping:`, error);
    return NextResponse.json({ error: 'Erro interno no ping' }, { status: 500 });
  }
}
