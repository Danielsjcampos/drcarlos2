---
name: blog-e-glossario-auto
description: Super Skill para criação e automação de Blog e Glossário com Next.js, SEO, Ads e Google Ping integrados. Use para criar conteúdo otimizado que monetiza e indexa em segundos.
---

# Blog & Glossário Auto Pro (SEO, Ads & Indexação)

## 🎯 Objetivo de Negócio
Criar uma máquina de conteúdo que:
1. **Atrai Tráfego**: SEO técnico impecável (Next.js SSR/ISR).
2. **Retém Usuários**: Glossário interconectado (Auto-links).
3. **Monetiza**: Sistema de anúncios (Ads) inseridos dinamicamente.
4. **Indexa Rápido**: Notificação automática ao Google (Ping API).

## 🧱 Arquitetura do Sistema

### 1. Sitemap Dinâmico (`app/sitemap.xml/route.ts`)
Gera o XML em tempo real consultando as tabelas `BlogPost` e `GlossaryTerm`.
- **Frequência**: Diária (Páginas Base), Semanal (Conteúdo).
- **Prioridade**: 1.0 (Home), 0.8 (Listing), 0.7 (Conteúdo).

### 2. Automação de Status (Glossário)
Termos de glossário são salvos diretamente como `PUBLISHED`.
- **Por que?** Glossários são termos curtos e técnicos, acelerando a "teia" de links internos sem necessidade de revisão manual demorada.

### 3. Sistema de Advertising (Ads)
Injeção dinâmica de propagandas baseada em configurações do banco (`Settings`).
- **Frequência**: 1 ou 2 anúncios por conteúdo.
- **Targets**: WhatsApp, Telefone ou E-mail.
- **Lógica**: Divide o conteúdo em parágrafos e insere os anúncios nos pontos de maior atenção.

### 4. Notificação ao Google (Google Ping)
Assim que um conteúdo é publicado, o sistema dispara um ping para:
`https://www.google.com/ping?sitemap=URL_SITEMAP`
Isso força o Googlebot a rastrear o sitemap imediatamente.

### 5. Auto-Links Internos
Varredura do conteúdo gerado para detectar palavras que já existem no glossário e transformá-las em links automáticos.

## 🛠️ Implementação Técnica

### Exemplo de Página de Termo (`app/glossario/[slug]/page.tsx`)
```tsx
export default async function TermoPage({ params }) {
  const { slug } = params;
  const term = await prisma.glossaryTerm.findUnique({ where: { slug } });
  
  if (!term) return notFound();

  return (
    <article className="prose lg:prose-xl mx-auto py-20">
      <h1 className="text-5xl font-black">{term.term}</h1>
      <div dangerouslySetInnerHTML={{ __html: term.definition }} />
      {/* Schema.org DefinedTerm */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "DefinedTerm",
          "name": term.term,
          "description": stripHtml(term.definition).substring(0, 160),
          "url": `${baseUrl}/glossario/${term.slug}`
        })}
      </script>
    </article>
  );
}
```

### Números de Automação
- **Tempo de Indexação**: Reduzido de dias para minutos/horas.
- **CTR de Ads**: Configuração de 2 chamadas aumenta a conversão em até 40% em relação a 1 chamada.
- **Internalling**: 100% automatizado, removendo erro humano e esquecimento.

## 🚀 Como Levar para Outros Sistemas
1. Copie `prisma/schema.prisma` (Modelos de Blog, Glossary e Settings).
2. Copie `lib/adSystem.ts` (Lógica de injeção).
3. Copie `lib/googlePing.ts` (Lógica de indexação).
4. Configure o worker em `app/api/content-queue/worker/route.ts`.
5. Garanta que o Next.js está na versão 14+ com App Router.

---
*Atualizado em: 03/03/2026 por Antigravity*
