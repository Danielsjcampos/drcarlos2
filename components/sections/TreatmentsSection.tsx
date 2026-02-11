'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Target, Activity, ShieldCheck, Zap } from 'lucide-react'

const treatments = [
  { 
    title: 'Coluna & Lombar', 
    desc: 'Tratamento especializado para hérnias e dores crônicas com foco em mobilidade.', 
    slug: '/tratamentos/coluna-lombar',
    icon: <Activity className="h-5 w-5 text-emerald-400" />,
    className: 'md:col-span-2 md:row-span-2 bg-[#0a4d2c]/90 text-white overflow-hidden group backdrop-blur-md'
  },
  { 
    title: 'Performance Esportiva', 
    desc: 'Recuperação acelerada para atletas de elite.', 
    slug: '/tratamentos/joelho',
    icon: <Zap className="h-5 w-5 text-cyan-400" />,
    className: 'md:col-span-1 md:row-span-1 bg-white/85 border border-white/60 group backdrop-blur-md'
  },
  { 
    title: 'Reabilitação Pós-Op', 
    desc: 'Protocolos rigorosos para retorno seguro.', 
    slug: '/tratamentos/pos-operatorio',
    icon: <ShieldCheck className="h-5 w-5 text-blue-500" />,
    className: 'md:col-span-1 md:row-span-2 bg-white/85 border border-white/60 group backdrop-blur-md'
  },
  { 
    title: 'Quiropraxia', 
    desc: 'Ajustes precisos para alinhamento biomecânico.', 
    slug: '/tratamentos/quiropraxia',
    icon: <Target className="h-5 w-5 text-orange-500" />,
    className: 'md:col-span-1 md:row-span-1 bg-white/85 border border-white/60 group backdrop-blur-md'
  },
]

export function TreatmentsSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Full section blurred background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/treatments-bg.webp"
          alt=""
          fill
          className="object-cover blur-[6px] brightness-[0.85] scale-105"
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-white/70"></div>
      </div>

      {/* Content on top */}
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#0a4d2c]/10 text-[#0a4d2c] text-[10px] font-bold uppercase tracking-widest mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse"></div>
            Especialidades Médicas
          </div>
          <h2 className="text-4xl md:text-[5rem] font-bold font-outfit leading-tight mb-6">
            Tratamentos de <br />
            <span className="text-gradient">Alta Precisão.</span>
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto font-inter text-lg">
            Combinamos inteligência clínica com tecnologia de ponta para resultados visíveis desde a primeira sessão.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-3 md:gap-4 max-w-6xl mx-auto">
          {treatments.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`relative rounded-2xl md:rounded-[1.5rem] p-6 md:p-8 flex flex-col justify-between transition-all duration-500 ${t.className} hover:shadow-xl hover:scale-[1.02] cursor-pointer`}
            >
              {t.className.includes('bg-[#0a4d2c]') && (
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[50px] -mr-20 -mt-20"></div>
              )}
              
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${t.className.includes('bg-[#0a4d2c]') ? 'bg-white/10 text-white' : 'bg-white text-gray-900 border border-gray-50 shadow-sm'}`}>
                  {t.icon}
                </div>
                <h3 className="text-lg md:text-2xl font-bold font-outfit mb-2 leading-tight">
                  {t.title}
                </h3>
                <p className={`text-sm leading-relaxed ${t.className.includes('bg-[#0a4d2c]') ? 'text-white/70' : 'text-gray-600'}`}>
                  {t.desc}
                </p>
              </div>

              <div className="relative z-10 flex justify-end mt-4">
                <Link 
                  href={t.slug} 
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${t.className.includes('bg-[#0a4d2c]') ? 'bg-white/10 hover:bg-white text-white hover:text-[#0a4d2c]' : 'bg-[#0a4d2c] hover:bg-[#16a34a] text-white'}`}
                >
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
