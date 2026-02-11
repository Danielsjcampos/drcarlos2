'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, MessageCircle, ArrowLeft, ChevronRight, Activity, Zap, ShieldCheck, Heart } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface TreatmentPageProps {
  title: string
  intro: string
  whenToSeek: string[]
  protocol: string[]
  benefits: string[]
  faq: { q: string, a: string }[]
}

export function TreatmentPageClient({ title, intro, whenToSeek, protocol, benefits, faq }: TreatmentPageProps) {
  return (
    <>
      <div className="pt-24 md:pt-32 pb-8 bg-mesh">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 backdrop-blur-md border border-gray-100 text-sm font-bold text-gray-400 hover:text-[#0a4d2c] transition-all group shadow-sm">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Home
          </Link>
        </div>
      </div>

      <section className="pb-32 bg-mesh relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a4d2c]/5 text-[#0a4d2c] text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                <Activity className="h-4 w-4 text-[#16a34a]" />
                Protocolo Clínico Especializado
              </div>
              <h1 className="text-5xl md:text-8xl font-black font-outfit mb-10 text-[#1a1a1a] leading-[1.05]">
                <span className="text-gradient leading-relaxed">{title}</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-2xl mb-12 font-inter">
                {intro}
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Button className="bg-[#0a4d2c] hover:bg-[#0d5c35] text-white rounded-[2rem] h-20 px-12 text-xl font-black font-outfit shadow-2xl shadow-[#0a4d2c]/30 hover:scale-105 active:scale-95 transition-all">
                  Iniciar Tratamento
                  <MessageCircle className="ml-3 h-6 w-6" />
                </Button>
                <div className="flex items-center gap-4 px-6 border-l border-gray-100">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-gray-100 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=treat${i}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-tight">Média de 12 agendamentos <br />esta semana</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-[#0a4d2c]/5 rounded-full blur-[120px] -mr-300"></div>
      </section>

      <section className="py-24 md:py-40 bg-white relative z-20 rounded-t-[4rem] -mt-10 shadow-[0_-40px_80px_-40px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                Red Flags
              </div>
              <h2 className="text-4xl font-bold font-outfit mb-12 leading-tight text-[#1a1a1a]">Quando acender o sinal de alerta?</h2>
              <div className="grid gap-4">
                {whenToSeek.map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 10 }}
                    className="flex gap-6 items-center p-8 rounded-[2rem] bg-gray-50 border border-transparent hover:border-red-100 hover:bg-red-50/30 transition-all duration-300 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors duration-500">
                      <Zap className="h-6 w-6" />
                    </div>
                    <p className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass p-12 md:p-16 rounded-[3.5rem] border border-gray-100 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#0a4d2c]/5 rounded-bl-[100px] pointer-events-none"></div>
              <h2 className="text-3xl font-black font-outfit mb-12 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#0a4d2c] text-white flex items-center justify-center text-xs">P</span>
                Metodologia Sport Health
              </h2>
              <div className="space-y-12 relative">
                {protocol.map((step, i) => (
                  <div key={i} className="flex gap-8 relative group">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-[#0a4d2c] flex items-center justify-center font-black relative z-10 shrink-0 shadow-sm transition-all group-hover:bg-[#0a4d2c] group-hover:text-white group-hover:scale-110">
                        {i + 1}
                      </div>
                      {i < protocol.length - 1 && <div className="w-px h-full bg-gray-100 absolute top-12"></div>}
                    </div>
                    <div>
                        <p className="text-lg font-bold text-gray-900 group-hover:text-[#0a4d2c] transition-colors">{step}</p>
                        <div className="h-0.5 w-0 bg-[#0a4d2c] group-hover:w-20 transition-all duration-500 mt-2 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-40 bg-mesh relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                Outcomes
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-12 leading-tight">Principais Ganhos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {benefits.map((benefit, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.05 }}
                    className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/30 flex items-center gap-5"
                  >
                    <div className="p-3 bg-emerald-50 rounded-xl shrink-0">
                      <ShieldCheck className="h-6 w-6 text-[#16a34a]" />
                    </div>
                    <span className="font-black text-gray-900 font-outfit leading-tight">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <motion.div 
                whileHover={{ y: -10 }}
                className="lg:w-1/2 bg-gradient-to-br from-[#0a4d2c] to-[#0d5c35] p-12 md:p-16 rounded-[4rem] text-white shadow-3xl shadow-[#0a4d2c]/40 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <Heart className="h-40 w-40" />
              </div>
              <h3 className="text-3xl md:text-5xl font-black font-outfit mb-8 leading-tight">Retome sua <br />liberdade física.</h3>
              <p className="text-white/60 mb-12 text-lg leading-relaxed font-inter max-w-sm">
                Investimos tempo em sua avaliação para que o resultado seja sustentável a longo prazo.
              </p>
              <Button className="w-full bg-[#16a34a] hover:bg-[#1db954] text-white font-black py-10 rounded-[2.5rem] text-2xl shadow-2xl shadow-black/20 group">
                Agendar Agora
                <ChevronRight className="ml-2 h-7 w-7 group-hover:translate-x-2 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-40 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20 space-y-4">
                <h2 className="text-4xl md:text-6xl font-black font-outfit">Sua dúvida é importante.</h2>
                <p className="text-gray-500 font-medium">Esclarecimentos diretos sobre nosso tratamento especializado.</p>
            </div>
            <div className="grid gap-12">
              {faq.map((item, i) => (
                <motion.div 
                    key={i} 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="space-y-6 pb-12 border-b border-gray-50 last:border-0"
                >
                  <h4 className="text-2xl font-black font-outfit flex items-start gap-4">
                    <span className="text-[#0a4d2c] pt-1">0{i+1}</span>
                    <span className="flex-1">{item.q}</span>
                  </h4>
                  <p className="text-lg text-gray-500 leading-relaxed ml-12 font-inter pl-2 border-l-2 border-gray-100">{item.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
