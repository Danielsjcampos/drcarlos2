'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, MessageCircle, ArrowLeft, ChevronRight, ChevronDown, Activity, Zap, ShieldCheck, Heart, Sparkles, Clock, Star } from 'lucide-react'
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

function FaqItem({ item, index }: { item: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="border-b border-gray-100 last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-8 text-left group"
      >
        <div className="flex items-start gap-5 pr-4">
          <span className="text-[#0a4d2c]/40 font-outfit font-black text-lg tabular-nums mt-0.5">0{index + 1}</span>
          <span className="text-xl md:text-2xl font-bold font-outfit text-[#1a1a1a] group-hover:text-[#0a4d2c] transition-colors">{item.q}</span>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${open ? 'bg-[#0a4d2c] text-white rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-[#0a4d2c]/10 group-hover:text-[#0a4d2c]'}`}>
          <ChevronDown className="h-5 w-5" />
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <p className="text-lg text-gray-500 leading-relaxed pb-8 pl-12 pr-4 font-inter border-l-2 border-[#0a4d2c]/20 ml-6">{item.a}</p>
      </motion.div>
    </motion.div>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export function TreatmentPageClient({ title, intro, whenToSeek, protocol, benefits, faq }: TreatmentPageProps) {
  return (
    <>
      {/* HERO — Full-width gradient with floating particles */}
      <section className="relative min-h-[80vh] flex items-end overflow-hidden bg-[#fafafa]">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(10,77,44,0.12),transparent)]" />
          <motion.div
            animate={{ x: [0, 30, -30, 0], y: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-[#0a4d2c]/10 to-[#22c55e]/10 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -20, 20, 0], y: [0, -20, 10, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
            className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-gradient-to-tl from-emerald-300/10 to-[#0a4d2c]/5 blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 pt-32 pb-20 md:pt-44 md:pb-28">
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/60 backdrop-blur-md border border-gray-100 text-sm font-bold text-gray-400 hover:text-[#0a4d2c] transition-all group shadow-sm mb-10">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a4d2c]/5 text-[#0a4d2c] text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Activity className="h-4 w-4 text-[#16a34a]" />
              Protocolo Clínico Especializado
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-outfit mb-10 text-[#1a1a1a] leading-[1.05]">
              <span className="text-gradient leading-relaxed">{title}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-2xl mb-12 font-inter">
              {intro}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <Button className="bg-[#0a4d2c] hover:bg-[#0d5c35] text-white rounded-[2rem] h-16 md:h-20 px-10 md:px-12 text-lg md:text-xl font-black font-outfit shadow-2xl shadow-[#0a4d2c]/30 hover:scale-105 active:scale-95 transition-all">
                Iniciar Tratamento
                <MessageCircle className="ml-3 h-5 w-5 md:h-6 md:w-6" />
              </Button>

              {/* Stats pills */}
              <div className="flex items-center gap-6 pl-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#22c55e]/10 flex items-center justify-center">
                    <Star className="h-5 w-5 text-[#22c55e]" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#1a1a1a]">4.9/5</p>
                    <p className="text-[10px] text-gray-400 font-bold">Avaliação</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#0a4d2c]/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-[#0a4d2c]" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#1a1a1a]">60 min</p>
                    <p className="text-[10px] text-gray-400 font-bold">Por sessão</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* RED FLAGS — Premium card layout */}
      <section className="py-24 md:py-40 bg-white relative z-20 rounded-t-[3rem] md:rounded-t-[4rem] -mt-10 shadow-[0_-40px_80px_-40px_rgba(0,0,0,0.08)]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                  <Zap className="h-3.5 w-3.5" />
                  Sinais de Alerta
                </div>
                <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-4 leading-tight text-[#1a1a1a]">Quando acender<br />o sinal de alerta?</h2>
                <p className="text-gray-400 mb-12 text-lg">Identifique se você se encaixa em alguma dessas situações.</p>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid gap-4"
              >
                {whenToSeek.map((item, i) => (
                  <motion.div 
                    key={i}
                    variants={itemVariants}
                    whileHover={{ x: 8, scale: 1.01 }}
                    className="flex gap-5 items-center p-6 md:p-8 rounded-2xl md:rounded-[2rem] bg-gradient-to-r from-gray-50 to-transparent border border-transparent hover:border-red-100 hover:from-red-50/40 transition-all duration-300 group cursor-default"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 group-hover:bg-red-500 group-hover:text-white group-hover:shadow-red-200 transition-all duration-500">
                      <Zap className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <p className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">{item}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Protocol — Glassmorphism timeline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/60 backdrop-blur-xl p-10 md:p-14 lg:p-16 rounded-[2.5rem] md:rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden sticky top-32"
            >
              <div className="absolute top-0 right-0 w-40 h-40 md:w-48 md:h-48 bg-gradient-to-bl from-[#0a4d2c]/5 to-transparent rounded-bl-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#22c55e]/5 to-transparent rounded-tr-[80px] pointer-events-none" />
              
              <h2 className="text-2xl md:text-3xl font-black font-outfit mb-10 md:mb-12 flex items-center gap-3">
                <span className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#0a4d2c] text-white flex items-center justify-center text-xs font-bold">
                  <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
                </span>
                Metodologia Sport Health
              </h2>
              <div className="space-y-0 relative">
                {/* Connecting line */}
                <div className="absolute left-[23px] md:left-[27px] top-6 bottom-6 w-px bg-gradient-to-b from-[#0a4d2c]/30 via-[#22c55e]/20 to-transparent" />
                
                {protocol.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex gap-6 md:gap-8 relative group py-5 md:py-6"
                  >
                    <div className="flex flex-col items-center z-10">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white border-2 border-gray-100 text-[#0a4d2c] flex items-center justify-center font-black relative shrink-0 shadow-sm transition-all duration-300 group-hover:bg-[#0a4d2c] group-hover:text-white group-hover:scale-110 group-hover:border-[#0a4d2c] group-hover:shadow-[#0a4d2c]/20 group-hover:shadow-lg">
                        {i + 1}
                      </div>
                    </div>
                    <div className="flex-1 pt-2 md:pt-3">
                      <p className="text-base md:text-lg font-bold text-gray-900 group-hover:text-[#0a4d2c] transition-colors">{step}</p>
                      <div className="h-0.5 w-0 bg-gradient-to-r from-[#0a4d2c] to-[#22c55e] group-hover:w-24 transition-all duration-500 mt-3 rounded-full" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BENEFITS — Bento grid with gradient accents */}
      <section className="py-24 md:py-40 bg-[#fafafa] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#0a4d2c]/5 to-transparent rounded-full blur-3xl -z-10" aria-hidden />
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <ShieldCheck className="h-3.5 w-3.5" />
                Resultados
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-6 leading-tight">Principais Ganhos</h2>
              <p className="text-lg text-gray-400 mb-12">Resultados reais que nossos pacientes experimentam.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                {benefits.map((benefit, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 shadow-lg shadow-gray-100/50 flex items-start gap-4 md:gap-5 hover:shadow-xl hover:shadow-[#0a4d2c]/5 hover:border-[#0a4d2c]/10 transition-all duration-300"
                  >
                    <div className="p-2.5 md:p-3 bg-gradient-to-br from-emerald-50 to-[#22c55e]/10 rounded-xl shrink-0">
                      <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-[#16a34a]" />
                    </div>
                    <span className="font-bold text-gray-900 font-outfit leading-snug text-base md:text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* CTA Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="lg:w-1/2 bg-gradient-to-br from-[#0a4d2c] via-[#0d5c35] to-[#0a4d2c] p-10 md:p-14 lg:p-16 rounded-[3rem] md:rounded-[4rem] text-white shadow-3xl shadow-[#0a4d2c]/40 relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 p-10 md:p-12 opacity-[0.07]" aria-hidden>
                <Heart className="h-32 w-32 md:h-40 md:w-40" />
              </div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-tr-[100px]" aria-hidden />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/70 text-[10px] font-bold uppercase tracking-widest mb-8">
                  <Star className="h-3 w-3" /> Próximo Passo
                </div>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black font-outfit mb-6 leading-tight">Retome sua <br />liberdade física.</h3>
                <p className="text-white/50 mb-10 md:mb-12 text-base md:text-lg leading-relaxed font-inter max-w-sm">
                  Investimos tempo em sua avaliação para que o resultado seja sustentável a longo prazo.
                </p>
                <Button className="w-full bg-white hover:bg-gray-50 text-[#0a4d2c] font-black py-8 md:py-10 rounded-[2rem] md:rounded-[2.5rem] text-xl md:text-2xl shadow-2xl shadow-black/20 group hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Agendar Agora
                  <ChevronRight className="ml-2 h-6 w-6 md:h-7 md:w-7 group-hover:translate-x-2 transition-transform" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ — Accordion style */}
      <section className="py-24 md:py-40 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16 md:mb-20 space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                Dúvidas Frequentes
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-outfit">Sua dúvida é importante.</h2>
              <p className="text-gray-400 font-medium text-lg">Esclarecimentos diretos sobre nosso tratamento.</p>
            </motion.div>
            <div>
              {faq.map((item, i) => (
                <FaqItem key={i} item={item} index={i} />
              ))}
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 md:mt-20 text-center"
            >
              <p className="text-gray-400 mb-6 font-medium">Ainda tem dúvidas? Fale conosco.</p>
              <Button className="bg-[#0a4d2c] hover:bg-[#083d23] text-white rounded-full px-10 h-14 text-lg font-bold shadow-xl shadow-[#0a4d2c]/20 hover:scale-105 active:scale-95 transition-all">
                <MessageCircle className="mr-2 h-5 w-5" />
                Conversar pelo WhatsApp
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
