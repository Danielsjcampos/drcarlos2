'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Activity, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const treatments = [
  { title: 'Dor no Ombro', desc: 'Reabilitação, mobilidade e prevenção de recidivas.', slug: '/tratamentos/ombro' },
  { title: 'Coluna Lombar', desc: 'Exercício terapêutico, correção postural e alívio.', slug: '/tratamentos/coluna-lombar' },
  { title: 'Reabilitação de Joelho', desc: 'Reabilitação não invasiva e retorno ao esporte.', slug: '/tratamentos/joelho' },
  { title: 'Tornozelo e Pé', desc: 'Fascite plantar, entorses e biomecânica da marcha.', slug: '/tratamentos/tornozelo-e-pe' },
  { title: 'Lesões Esportivas', desc: 'Tratamento especializado para atletas de todas as idades.', slug: '/tratamentos/lesoes-esportivas' },
  { title: 'Pós-Operatório', desc: 'Protocolos de reabilitação acelerada e segura.', slug: '/tratamentos/pos-operatorio' },
  { title: 'Terapia Manual', desc: 'Mobilização articular e técnicas de liberação miofascial.', slug: '/tratamentos/terapia-manual' },
  { title: 'Quiropraxia', desc: 'Ajustes articulares para melhora funcional e alívio.', slug: '/tratamentos/quiropraxia' },
  { title: 'Acupuntura', desc: 'Tratamento de dor e equilíbrio sistêmico.', slug: '/tratamentos/acupuntura' },
  { title: 'Ventosa', desc: 'Melhora da circulação e recuperação muscular.', slug: '/tratamentos/ventosa' },
  { title: 'Bandagem Elástica', desc: 'Suporte articular e auxílio no controle motor.', slug: '/tratamentos/bandagem-elastica' },
]

export function TreatmentsPageContent() {
  return (
    <>
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 bg-[#0a4d2c] text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-outfit mb-6">Nossos Tratamentos</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Combinamos tecnologia, evidência científica e anos de experiência em alto rendimento para oferecer o melhor cuidado para o seu corpo.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {treatments.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={t.slug}>
                  <Card className="h-full group hover:border-[#22c55e] hover:shadow-2xl hover:shadow-[#22c55e]/5 transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="w-12 h-12 rounded-xl bg-[#0a4d2c]/5 flex items-center justify-center mb-6 group-hover:bg-[#0a4d2c] group-hover:text-white transition-colors">
                        <Activity className="h-6 w-6" />
                      </div>
                      <h3 className="text-2xl font-bold font-outfit mb-4 group-hover:text-[#0a4d2c] transition-colors">{t.title}</h3>
                      <p className="text-gray-600 mb-8 leading-relaxed">
                        {t.desc}
                      </p>
                      <div className="flex items-center text-[#0a4d2c] font-bold text-sm tracking-widest uppercase">
                        Ver detalhes
                        <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-2 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
