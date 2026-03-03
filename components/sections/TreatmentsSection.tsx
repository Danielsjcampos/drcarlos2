'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Target, Activity, ShieldCheck, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const treatments = [
  { 
    title: 'Coluna & Lombar', 
    desc: 'Tratamento especializado para hérnias discais, ciatalgia e dores crônicas com foco em descompressão e mobilidade.', 
    slug: '/tratamentos/coluna-lombar',
    icon: <Activity className="h-6 w-6" />,
    color: 'bg-emerald-500'
  },
  { 
    title: 'Joelho & Quadril', 
    desc: 'Protocolos de recuperação acelerada para lesões ligamentares, meniscais e artrose.', 
    slug: '/tratamentos/joelho',
    icon: <Zap className="h-6 w-6" />,
    color: 'bg-blue-500'
  },
  { 
    title: 'Ombro & Cervical', 
    desc: 'Reabilitação de manguito rotador, tendinopatias e cervicalgias com técnicas manuais.', 
    slug: '/tratamentos/ombro',
    icon: <Target className="h-6 w-6" />,
    color: 'bg-orange-500'
  },
  { 
    title: 'Atletas de Elite', 
    desc: 'Prevenção e recovery de alta performance com a mesma metodologia utilizada no NBB.', 
    slug: '/servicos-para-atletas',
    icon: <ShieldCheck className="h-6 w-6" />,
    color: 'bg-slate-900'
  },
]

export function TreatmentsSection() {
  return (
    <section className="py-24 md:py-40 bg-white overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-[2px] bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Especialidades</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black font-outfit text-slate-900 leading-[1.1] mb-6">
              Tratamentos de <br />
              <span className="text-emerald-600">Alta Precisão.</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Combinamos evidência científica com prática clínica de alto rendimento para entregar resultados sustentáveis.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/tratamentos">
              <Button variant="outline" className="rounded-2xl h-14 px-8 border-slate-200 hover:bg-slate-50 font-bold transition-all group">
                Ver todos os tratamentos
                <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {treatments.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <Link href={t.slug} className="block h-full">
                <div className="bg-slate-50 rounded-[40px] p-10 h-full flex flex-col justify-between border border-transparent hover:border-emerald-500/20 hover:bg-white hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[80px] -translate-y-10 translate-x-10 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-700" />
                  
                  <div>
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-10 text-white shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3", t.color)}>
                      {t.icon}
                    </div>
                    <h3 className="text-2xl font-black font-outfit text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors">
                      {t.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10">
                      {t.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 group-hover:gap-4 transition-all">
                    Explorar Protocolo
                    <ArrowUpRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
