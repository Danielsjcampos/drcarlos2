---
name: blog-e-glossario-auto
description: Guia para criação e automação de Blog e Glossário com Next.js, Next-Sitemap, SEO, GEO (Generative Engine Optimization) e IA. Use esta skill quando o usuário pedir para criar um blog, glossário, configurar SEO, SEO programático, automação de sitemap ou notificar o Google Search. Gatilhos: blog automático, glossário com IA, indexação Google, next-sitemap.
---

# Blog e Glossário Automático (SEO & GEO)

## Propósito
Este guia define os padrões e a arquitetura para criar um blog e glossário otimizados para mecanismos de busca (Google) e inteligências artificiais (SGE, ChatGPT, Claude), garantindo rápida indexação e alto rankeamento.

## Quando Usar
- Criação de novos blogs ou glossários no Next.js.
- Configuração de SEO e sitemaps automatizados.
- Integração com a API de indexação do Google (URL Inspection Ping).
- Melhoria de E-E-A-T (Experiência, Especialidade, Autoridade, Confiabilidade) e métricas de Core Web Vitals.
- Implementação de Schema.org (JSON-LD) para artigos e termos definidos.

## 1. A Escolha do Framework
- **Regra**: Use **Next.js** (que roda em Node.js).
- **Justificativa**: SSR (Server-Side Rendering) e SSG (Static Site Generation) fornecem HTML pronto, o que facilita a indexação imediata pelo Google e a leitura limpa pelas IAs.

## 2. Estrutura de Dados para Glossário e Blog (Schema.org / JSON-LD)
Garante que o Google e as IAs entendam o formato do conteúdo.

### Schema para Artigos de Blog (Injetar no `<head>`)
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "URL_DO_POST"
  },
  "headline": "Título do Post",
  "author": {
    "@type": "Person",
    "name": "Nome do Autor"
  }
}
```

### Schema para Glossário (Essencial: `DefinedTerm`)
Informa ao Google que é uma definição oficial.
```json
{
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  "name": "Termo",
  "description": "Definição do termo...",
  "inDefinedTermSet": "URL_DO_GLOSSARIO"
}
```

## 3. Automação de Sitemap
O Google descobre páginas novas principalmente através do `sitemap.xml`. Não crie manualmente.

- **Biblioteca**: `next-sitemap`
- **Instalação**: `npm install next-sitemap`
- **Arquivo de Configuração** (`next-sitemap.config.js`):
```javascript
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://seusite.com.br',
  generateRobotsTxt: true, // (optional)
  // ... outras configurações
}
```
- **Script no `package.json`**: Adicione `postbuild: "next-sitemap"` ou altere o script de build para `"build": "next build && next-sitemap"`.

**Estratégia de Atualização:**
Sempre que criar um post no banco de dados, o próximo build (ou revalidação on-demand do Next.js) deve regenerar o sitemap.

## 4. Notificando o Google (Para indexação rápida)
- ❌ **NÃO USE**: Google Indexing API (Pode gerar penalidade para blogs).
- ✅ **USE**: URL Inspection Ping (Método aprovado para sitemaps).

**Exemplo de Script Node.js (`pingGoogleSearch()`):**
```javascript
export async function pingGoogleSearch(sitemapUrl) {
  try {
    const url = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    await fetch(url);
    console.log("Ping enviado com sucesso ao Google.");
  } catch (error) {
    console.error("Erro ao enviar ping:", error);
  }
}
```
*Chame essa função após a rota de criação salvar o conteúdo no banco com sucesso.*

## 5. Integração com Google Search Console (GSC)
- Verifique a propriedade via Registro DNS ou arquivo HTML na pasta `public/`.
- Envie o `sitemap.xml` na aba Sitemaps.
- Use a *Search Console API* para monitorar erros de indexação programaticamente (opcional).

## 6. Otimização para IA (SGE) e Busca Geral
- **Respostas Diretas (Featured Snippets)**: O primeiro parágrafo de cada artigo/termo deve responder diretamente à pergunta principal (40-60 palavras).
- **Links Internos**: Varra o texto e crie links automaticamente para termos que já existem no glossário (teia de navegação).
- **Performance (Core Web Vitals)**: Imagens WebP/AVIF, Lazy Loading, componente `next/image`.
- **E-E-A-T**: Incluir página "Sobre o Autor" com link e mostrar data de atualização.

## 7. Fluxo de Trabalho Automatizado Backend
1. Usuário cria post/glossário no Admin.
2. Backend salva no Banco de Dados.
3. Backend aciona revalidação de cache (ISR) ou novo build.
4. Sistema gera novo `sitemap.xml` com a URL nova.
5. Sistema executa o `pingGoogleSearch()`.
6. Googlebot recebe o ping, agenda o crawl e indexa o conteúdo.

## 8. Código Exemplo de Rota de Publicação (Next.js API)
```javascript
// Exemplo App Router
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    // 1. Salvar no banco de dados (ex: Prisma/Supabase)
    const newPost = await savePost(body);
    
    // 2. Revalidar caminho (ISR)
    // revalidatePath('/blog');
    
    // 3. Fazer ping do sitemap no Google
    const sitemapUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`;
    await pingGoogleSearch(sitemapUrl);
    
    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    return NextResponse.json({ error: "Falha ao publicar" }, { status: 500 });
  }
}
```

## Checklist Final
- [ ] **Robots.txt**: Permite rastreamento (`User-agent: *`, `Allow: /`).
- [ ] **SSL (HTTPS)**: Obrigatório.
- [ ] **Canonical Tags**: Cada página possui `<link rel="canonical" href="URL_ATUAL" />`.
- [ ] **Monitoramento**: GSC acessado regularmente para revisar rastreamento e indexação.
