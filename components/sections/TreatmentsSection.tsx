'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight, Target, Activity, ShieldCheck, Zap } from 'lucide-react'

const treatments = [
  { 
    title: 'Coluna & Lombar', 
    desc: 'Tratamento especializado para hérnias e dores crônicas com foco em mobilidade.', 
    slug: '/tratamentos/coluna-lombar',
    icon: <Activity className="h-6 w-6 text-emerald-500" />,
    className: 'md:col-span-2 md:row-span-2 bg-[#0a4d2c] text-white overflow-hidden group'
  },
  { 
    title: 'Performance Esportiva', 
    desc: 'Recuperação acelerada para atletas de elite.', 
    slug: '/tratamentos/joelho',
    icon: <Zap className="h-6 w-6 text-cyan-400" />,
    className: 'md:col-span-1 md:row-span-1 bg-white border border-gray-100 group'
  },
  { 
    title: 'Reabilitação Pós-Op', 
    desc: 'Protocolos rigorosos para retorno seguro.', 
    slug: '/tratamentos/pos-operatorio',
    icon: <ShieldCheck className="h-6 w-6 text-blue-500" />,
    className: 'md:col-span-1 md:row-span-2 bg-gray-50 border border-gray-100 group'
  },
  { 
    title: 'Quiropraxia', 
    desc: 'Ajustes precisos para alinhamento biomecânico.', 
    slug: '/tratamentos/quiropraxia',
    icon: <Target className="h-6 w-6 text-orange-500" />,
    className: 'md:col-span-1 md:row-span-1 bg-white border border-gray-100 group'
  },
]

export function TreatmentsSection() {
  return (
    <section className="py-24 md:py-40 bg-mesh overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a4d2c]/5 text-[#0a4d2c] text-[10px] font-bold uppercase tracking-widest mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse"></div>
              Especialidades Médicas
            </div>
            <h2 className="text-4xl md:text-6xl font-bold font-outfit leading-tight">
              Tratamentos de <br />
              <span className="text-gradient">Alta Precisão.</span>
            </h2>
          </div>
          <p className="text-gray-500 max-w-sm font-inter text-lg">
            Combinamos inteligência clínica com tecnologia de ponta para resultados visíveis desde a primeira sessão.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 h-full min-h-[600px]">
          {treatments.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between transition-all duration-500 ${t.className} hover:shadow-2xl hover:scale-[1.02] cursor-pointer`}
            >
              {t.className.includes('bg-[#0a4d2c]') && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
              )}
              
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-sm ${t.className.includes('bg-[#0a4d2c]') ? 'bg-white/10 text-white' : 'bg-white text-gray-900 border border-gray-50'}`}>
                  {t.icon}
                </div>
                <h3 className={`text-2xl md:text-3xl font-bold font-outfit mb-4 leading-tight`}>
                  {t.title}
                </h3>
                <p className={`text-base leading-relaxed ${t.className.includes('bg-[#0a4d2c]') ? 'text-white/60' : 'text-gray-500'}`}>
                  {t.desc}
                </p>
              </div>

              <div className="relative z-10 flex justify-end mt-8">
                <Link 
                  href={t.slug} 
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${t.className.includes('bg-[#0a4d2c]') ? 'bg-white/10 hover:bg-white text-white hover:text-[#0a4d2c]' : 'bg-[#0a4d2c] hover:bg-[#16a34a] text-white'}`}
                >
                  <ArrowUpRight className="h-6 w-6" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
