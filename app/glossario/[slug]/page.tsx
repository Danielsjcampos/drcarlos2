import { notFound } from 'next/navigation'
import prisma from '@/lib/db'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

// Dynamic metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = await prisma.glossaryTerm.findUnique({
    where: { slug: params.slug },
  })

  if (!item) {
    return { title: 'Termo não encontrado' }
  }

  return {
    title: `O que é ${item.term}? | Glossário Sport Health`,
    description: item.definition.substring(0, 160).replace(/<[^>]*>/g, ''),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/glossario/${item.slug}`
    }
  }
}

export default async function GlossaryTermPage({ params }: { params: { slug: string } }) {
  const item = await prisma.glossaryTerm.findUnique({
    where: { slug: params.slug },
  })

  if (!item || item.status !== 'PUBLISHED') {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: item.term,
    description: item.definition.substring(0, 160).replace(/<[^>]*>/g, ''),
    inDefinedTermSet: `${process.env.NEXT_PUBLIC_SITE_URL}/glossario`
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="pt-32 pb-32 px-6">
        <article className="max-w-3xl mx-auto">
          <Link href="/glossario" className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors mb-10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Glossário
          </Link>

          <div className="p-8 md:p-12 bg-slate-50 border border-slate-100 rounded-[40px]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Definição
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black font-outfit text-slate-900 mb-8 pb-8 border-b border-slate-200/60">
              {item.term}
            </h1>

            <div 
              className="prose prose-lg prose-emerald max-w-none prose-headings:font-outfit prose-headings:font-black prose-p:font-medium prose-p:text-slate-600"
              dangerouslySetInnerHTML={{ __html: item.definition }}
            />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
