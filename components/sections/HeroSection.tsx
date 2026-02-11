'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star, ChevronRight, Target, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div className="absolute top-0 right-0 -z-10 bg-gradient-to-l from-[#0a4d2c]/5 to-transparent w-1/2 h-full rounded-l-[100px]"></div>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a4d2c]/10 text-[#0a4d2c] text-xs font-bold uppercase tracking-wider mb-6">
              <Star className="h-3 w-3 fill-[#0a4d2c]" />
              Referência em SJC
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-outfit leading-tight mb-6 text-[#1a1a1a]">
              Volte a se movimentar <span className="text-[#0a4d2c]">sem dor.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
              Fisioterapia esportiva e ortopédica em São José dos Campos — tratamento personalizado por Dr. Carlos Prado, com experiência em alto rendimento.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-[#0a4d2c] hover:bg-[#083d23] text-white rounded-full py-8 px-8 text-lg font-bold group shadow-xl shadow-[#0a4d2c]/20">
                Agende sua avaliação
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="rounded-full py-8 px-8 text-lg font-bold border-gray-200">
                Conheça os tratamentos
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"></div>
                ))}
              </div>
              <span>+500 pacientes recuperados este ano</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl z-10">
              <div className="absolute inset-0 bg-[#0a4d2c]/10 mix-blend-multiply"></div>
              <div className="bg-gray-300 w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center p-8">
                  <Target className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="font-outfit font-bold">Imagem do Dr. Carlos em atendimento</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl z-20 flex items-center gap-4 max-w-[240px]">
              <div className="bg-[#22c55e]/10 p-3 rounded-xl">
                <ShieldCheck className="h-8 w-8 text-[#22c55e]" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-tight">8+ anos de experiência</p>
                <p className="text-xs text-gray-500 mt-1">Fisioterapeuta do SJ Basquetebol</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
