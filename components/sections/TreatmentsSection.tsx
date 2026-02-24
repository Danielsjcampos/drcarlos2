'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight, Target, Activity, ShieldCheck, Zap } from 'lucide-react'

const treatments = [
  { 
    title: 'Coluna & Lombar', 
    desc: 'Tratamento especializado para hérnias e dores crônicas com foco em restabelecer a sua mobilidade completa.', 
    slug: '/tratamentos/coluna-lombar',
    icon: <Activity className="h-6 w-6 text-emerald-400" />,
    className: 'md:col-span-8 bg-[#0a4d2c] text-white overflow-hidden',
    isDark: true
  },
  { 
    title: 'Performance Esportiva', 
    desc: 'Recuperação acelerada e estratégias de prevenção para atletas de elite.', 
    slug: '/tratamentos/joelho',
    icon: <Zap className="h-6 w-6 text-cyan-500" />,
    className: 'md:col-span-4 bg-white border border-gray-100',
    isDark: false
  },
  { 
    title: 'Reabilitação Pós-Op', 
    desc: 'Protocolos rigorosos baseados em evidência para um retorno cirúrgico totalmente seguro.', 
    slug: '/tratamentos/pos-operatorio',
    icon: <ShieldCheck className="h-6 w-6 text-blue-500" />,
    className: 'md:col-span-4 bg-white border border-gray-100',
    isDark: false
  },
  { 
    title: 'Quiropraxia', 
    desc: 'Ajustes guiados e precisos para o perfeito alinhamento biomecânico e alívio de tensões profundas.', 
    slug: '/tratamentos/quiropraxia',
    icon: <Target className="h-6 w-6 text-orange-500" />,
    className: 'md:col-span-8 bg-gradient-to-br from-[#fafafa] to-gray-50 border border-gray-100',
    isDark: false
  },
]

export function TreatmentsSection() {
  return (
    <section className="relative py-24 md:py-32 bg-[#fafafa] z-0 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-[#0a4d2c] text-[11px] font-bold uppercase tracking-widest mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16a34a] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16a34a]"></span>
            </span>
            Especialidades Médicas
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold font-outfit leading-tight mb-6 text-gray-900 tracking-tight">
            Tratamentos de <br className="hidden md:block"/>
            <span className="text-[#0a4d2c]">Alta Precisão.</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-inter text-lg leading-relaxed">
            Combinamos inteligência clínica com tecnologia de ponta para entregar resultados visíveis e sustentáveis desde a primeira sessão.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto">
          {treatments.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`group relative rounded-3xl p-8 md:p-10 flex flex-col justify-between hover:shadow-2xl hover:shadow-[#0a4d2c]/5 hover:-translate-y-1 transition-all duration-500 cursor-pointer ${t.className}`}
            >
              <Link href={t.slug} className="absolute inset-0 z-20"><span className="sr-only">{t.title}</span></Link>
              
              {/* Background Glows for darker cards */}
              {t.isDark && (
                <>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[60px] transform translate-x-1/3 -translate-y-1/3 group-hover:bg-white/10 transition-colors duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[40px] transform -translate-x-1/3 translate-y-1/3"></div>
                </>
              )}

              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 ${t.isDark ? 'bg-white/10 shadow-inner shadow-white/20 text-white' : 'bg-gray-50 text-gray-900 shadow-sm border border-gray-100'}`}>
                  {t.icon}
                </div>
                
                <h3 className={`text-2xl md:text-3xl font-bold font-outfit mb-4 leading-tight ${t.isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t.title}
                </h3>
                
                <p className={`text-base md:text-lg leading-relaxed max-w-md ${t.isDark ? 'text-white/80' : 'text-gray-600'}`}>
                  {t.desc}
                </p>
              </div>

              <div className="relative z-10 flex justify-end mt-8">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:rotate-45 ${t.isDark ? 'bg-white/10 text-white group-hover:bg-white group-hover:text-[#0a4d2c]' : 'bg-gray-50 text-gray-400 group-hover:bg-[#0a4d2c] group-hover:text-white'}`}>
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
