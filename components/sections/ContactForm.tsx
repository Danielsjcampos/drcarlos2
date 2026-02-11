'use client'

import React, { useState } from 'react'
import { Calendar, MessageCircle, ShieldCheck, MapPin, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simular envio
    setTimeout(() => {
        alert('Solicitação recebida com sucesso! Dr. Carlos entrará em contato em breve.')
        setLoading(false)
    }, 1500)
  }

  return (
    <section className="py-24 md:py-40 bg-mesh relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 w-[500px] h-[500px] bg-[#0a4d2c]/5 rounded-full blur-[120px]"></div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 -z-10 w-[500px] h-[500px] bg-[#16a34a]/5 rounded-full blur-[120px]"></div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Lead Content */}
            <div className="lg:w-1/2 space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0a4d2c]/5 text-[#0a4d2c] text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                  <Activity className="h-4 w-4 text-[#16a34a]" />
                  Próximo Passo
                </div>
                <h2 className="text-4xl md:text-7xl font-bold font-outfit leading-[1.1] text-[#1a1a1a]">
                  Pronto para uma nova <span className="text-gradient">jornada?</span>
                </h2>
                <p className="text-lg text-gray-500 font-inter leading-relaxed max-w-lg">
                  Não permita que a dor limite seu potencial. Agende hoje uma consulta detalhada e receba um plano de ação personalizado.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
                  <div className="w-12 h-12 rounded-2xl bg-[#0a4d2c] text-white flex items-center justify-center mb-4 shadow-lg shadow-[#0a4d2c]/20">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Localização Privilegiada</h4>
                  <p className="text-sm text-gray-500">São José dos Campos - SP</p>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
                  <div className="w-12 h-12 rounded-2xl bg-[#16a34a] text-white flex items-center justify-center mb-4 shadow-lg shadow-[#16a34a]/20">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Garantia Técnica</h4>
                  <p className="text-sm text-gray-500">Resultados baseados em ciência</p>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className="lg:w-1/2 w-full">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="glass p-10 md:p-14 rounded-[3.5rem] border border-white relative z-10 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.08)]"
              >
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Seu Nome Completo</label>
                      <input 
                        required 
                        type="text" 
                        className="w-full p-5 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#0a4d2c]/5 focus:border-[#0a4d2c] transition-all outline-none font-bold text-gray-900 placeholder:text-gray-300 shadow-sm" 
                        placeholder="Ex: João da Silva" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">WhatsApp para Contato</label>
                      <input 
                        required 
                        type="tel" 
                        className="w-full p-5 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#0a4d2c]/5 focus:border-[#0a4d2c] transition-all outline-none font-bold text-gray-900 placeholder:text-gray-300 shadow-sm" 
                        placeholder="(12) 99999-9999" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Motivo do Contato</label>
                      <select className="w-full p-5 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#0a4d2c]/5 focus:border-[#0a4d2c] transition-all outline-none font-bold text-gray-900 shadow-sm appearance-none">
                        <option>Dor Crônica</option>
                        <option>Reabilitação Pós-Cirúrgica</option>
                        <option>Performance Esportiva</option>
                        <option>Quiropraxia / Ajuste</option>
                        <option>Outros</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 px-1">
                    <input required type="checkbox" id="lgpd" className="mt-1 w-5 h-5 rounded-lg border-gray-200 accent-[#0a4d2c] transition-all" />
                    <label htmlFor="lgpd" className="text-[11px] text-gray-400 leading-tight font-medium">
                      Estou de acordo com o processamento dos meus dados para fins de agendamento e contato profissional pela Sport Health.
                    </label>
                  </div>

                  <Button disabled={loading} className="w-full h-20 text-xl font-black font-outfit bg-[#0a4d2c] hover:bg-[#0d5c35] text-white rounded-[2rem] shadow-2xl shadow-[#0a4d2c]/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                      </div>
                    ) : (
                      'Confirmar Solicitação'
                    )}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
