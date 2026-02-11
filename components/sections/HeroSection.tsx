'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star, ChevronRight, Target, ShieldCheck, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-mesh min-h-[90vh] flex items-center">
      {/* Abstract Shapes */}
      <div className="absolute top-0 right-0 -z-10 w-[60%] h-full opacity-20 blur-[100px] pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#0a4d2c] rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-[#16a34a] rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-[#0a4d2c]/10 text-[#0a4d2c] text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
              <Activity className="h-4 w-4 text-[#16a34a]" />
              Fisioterapia de Alta Performance
            </div>
            <h1 className="text-6xl md:text-8xl font-bold font-outfit leading-[1.1] mb-8 text-[#1a1a1a]">
              Performance <br />
              <span className="text-gradient">sem limites.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600/80 mb-12 max-w-lg leading-relaxed font-inter">
              Recuperação inteligente para atletas e pacientes que buscam o mais alto padrão em fisioterapia esportiva e ortopédica em São José dos Campos.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent('open-booking'))}
                className="bg-[#0a4d2c] hover:bg-[#0d5c35] text-white rounded-2xl py-8 px-10 text-lg font-bold group shadow-2xl shadow-[#0a4d2c]/30 border-t border-white/10 transition-all hover:scale-105 active:scale-95"
              >
                Agendar Avaliação
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="ghost" className="rounded-2xl py-8 px-10 text-lg font-bold border border-gray-100 hover:bg-white/80 transition-all">
                Nossos Tratamentos
              </Button>
            </div>
            <div className="mt-14 flex items-center gap-6 text-sm text-gray-500">
              <div className="flex -space-x-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img 
                      src={`https://i.pravatar.cc/100?u=${i}`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <div className="flex text-yellow-500">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-current" />)}
                </div>
                <p className="font-bold text-gray-900">+1.200 Vidas transformadas</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] z-10 border-8 border-white group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a4d2c]/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700"></div>
              <Image 
                src="/dr-carlos.png"
                alt="Dr. Carlos Prado" 
                fill
                className="object-cover object-top transition-transform duration-1000 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute bottom-8 left-8 right-8 p-6 glass rounded-2xl z-20">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#0a4d2c] text-white flex items-center justify-center font-bold text-lg shadow-lg">
                    CP
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0a4d2c]">Dr. Carlos Prado</h4>
                    <p className="text-xs text-[#0a4d2c]/60 font-bold uppercase tracking-wider">CREFITO 3/241285-F</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Card */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl z-20 border border-gray-50 max-w-[200px]"
            >
              <div className="bg-[#16a34a] w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-white shadow-lg">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="text-sm font-black text-gray-900 leading-tight">Mestre em Reabilitação Escalonada</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
