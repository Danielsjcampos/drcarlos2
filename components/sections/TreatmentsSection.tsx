'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Target } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const treatments = [
  { title: 'Dor no Ombro', desc: 'Reabilitação, mobilidade e prevenção de recidivas.', slug: '/tratamentos/ombro' },
  { title: 'Dor Lombar', desc: 'Exercício terapêutico, correção postural e alívio.', slug: '/tratamentos/coluna-lombar' },
  { title: 'Dor no Joelho', desc: 'Reabilitação não invasiva e retorno ao esporte.', slug: '/tratamentos/joelho' },
  { title: 'Fascite Plantar', desc: 'Tratamento conservador e órteses.', slug: '/tratamentos/tornozelo-e-pe' },
]

export function TreatmentsSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-4">O que está te impedindo hoje?</h2>
          <p className="text-gray-600">Tratamentos especializados para que a dor não seja mais um obstáculo na sua vida.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {treatments.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Card className="h-full border-gray-100 hover:border-[#0a4d2c]/20 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-lg bg-[#0a4d2c]/5 flex items-center justify-center mb-6 group-hover:bg-[#0a4d2c] group-hover:text-white transition-colors">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold font-outfit mb-3">{t.title}</h3>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">{t.desc}</p>
                  <Link href={t.slug} className="text-[#0a4d2c] font-bold text-sm flex items-center group-hover:underline">
                    Saiba mais
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
