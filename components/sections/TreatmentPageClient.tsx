'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, MessageCircle, ArrowLeft, ChevronRight, Activity } from 'lucide-react'
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
      <div className="pt-24 md:pt-32 pb-4 bg-[#fafafa]">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/tratamentos" className="text-sm text-gray-400 hover:text-[#0a4d2c] flex items-center gap-1 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Voltar para tratamentos
          </Link>
        </div>
      </div>

      <section className="pb-24 bg-[#fafafa]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold font-outfit mb-8 text-[#1a1a1a]"
            >
              {title}
            </motion.h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl mb-12">
              {intro}
            </p>
            <Button className="bg-[#0a4d2c] hover:bg-[#083d23] text-white rounded-full py-8 px-10 text-lg font-bold shadow-xl shadow-[#0a4d2c]/20">
              Agendar Avaliação
              <MessageCircle className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 border-y border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-3xl font-bold font-outfit mb-8">Sinais de alerta: quando procurar?</h2>
              <div className="space-y-4">
                {whenToSeek.map((item, i) => (
                  <div key={i} className="flex gap-4 items-start pb-4 border-b border-gray-100 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                      <Activity className="h-5 w-5" />
                    </div>
                    <p className="text-lg text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0a4d2c]/5 rounded-bl-[100px]"></div>
              <h2 className="text-3xl font-bold font-outfit mb-8">Nosso Protocolo</h2>
              <div className="space-y-8 relative">
                {protocol.map((step, i) => (
                  <div key={i} className="flex gap-6 relative">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-[#0a4d2c] text-white flex items-center justify-center font-bold relative z-10 shrink-0">
                        {i + 1}
                      </div>
                      {i < protocol.length - 1 && <div className="w-px h-full bg-gray-100 absolute top-10"></div>}
                    </div>
                    <p className="text-lg text-gray-700 py-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#fafafa]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-8">Principais Benefícios</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {benefits.map((benefit, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200/50 shadow-sm flex items-center gap-4">
                    <div className="p-2 bg-[#22c55e]/10 rounded-lg shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-[#22c55e]" />
                    </div>
                    <span className="font-bold text-[#1a1a1a]">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 bg-[#0a4d2c] p-12 rounded-3xl text-white">
              <h3 className="text-2xl font-bold font-outfit mb-6">Pronto para começar?</h3>
              <p className="text-white/70 mb-10 leading-relaxed">
                Não deixe a dor limitar sua vida. Agende uma avaliação agora e recupere sua performance.
              </p>
              <Button className="w-full bg-[#22c55e] hover:bg-[#1db954] text-[#0a4d2c] font-bold py-8 rounded-2xl text-lg">
                Falar com Dr. Carlos agora
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-outfit mb-12 text-center underline decoration-[#0a4d2c] decoration-4 underline-offset-8">Dúvidas Frequentes</h2>
            <div className="space-y-12">
              {faq.map((item, i) => (
                <div key={i} className="space-y-4">
                  <h4 className="text-xl font-bold font-outfit flex items-center gap-2">
                    <ChevronRight className="h-5 w-5 text-[#0a4d2c]" />
                    {item.q}
                  </h4>
                  <p className="text-gray-600 leading-relaxed ml-7">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
