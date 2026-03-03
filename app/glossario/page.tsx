import React from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import prisma from '@/lib/db'
import Link from 'next/link'
import { BookA } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Glossário Médico | Sport Health',
  description: 'Termos médicos e fisioterapêuticos explicados de forma simples e direta.',
}

export default async function GlossaryListingPage() {
  const terms = await prisma.glossaryTerm.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { term: 'asc' },
  })

  // Agrupar por letra inicial
  const groupedTerms = terms.reduce((acc: any, term: any) => {
    const firstLetter = term.term.charAt(0).toUpperCase()
    if (!acc[firstLetter]) acc[firstLetter] = []
    acc[firstLetter].push(term)
    return acc
  }, {} as Record<string, typeof terms>)

  const alphabet = Object.keys(groupedTerms).sort()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookA className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-outfit text-slate-900 mb-4">
            Glossário <span className="text-emerald-600">Esportivo</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            Uma enciclopédia completa de termos de fisioterapia, anatomia e medicina esportiva para ajudar você a entender melhor o seu corpo.
          </p>
        </div>

        {terms.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-medium">
            Nenhum termo publicado ainda.
          </div>
        ) : (
          <div className="space-y-12">
            {alphabet.map((letter) => (
              <div key={letter} className="relative">
                <div className="sticky top-24 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-white font-black text-2xl font-outfit shadow-xl mb-6 z-10">
                  {letter}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedTerms[letter].map((item: any) => (
                    <Link 
                      key={item.id} 
                      href={`/glossario/${item.slug}`}
                      className="p-6 rounded-3xl border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-100 transition-all group"
                    >
                      <h3 className="text-lg font-black font-outfit text-slate-800 group-hover:text-emerald-700 transition-colors mb-2">
                        {item.term}
                      </h3>
                      <p className="text-sm text-slate-500 font-medium line-clamp-3">
                        {item.definition.replace(/<[^>]*>/g, '')}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
