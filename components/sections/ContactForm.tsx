'use client'

import React, { useState } from 'react'
import { Calendar, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simular envio
    setTimeout(() => {
        alert('Obrigado! Entraremos em contato em breve.')
        setLoading(false)
    }, 1500)
  }

  return (
    <section className="py-24 bg-[#fafafa]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col md:flex-row">
          <div className="bg-[#0a4d2c] p-12 text-white md:w-2/5">
            <h2 className="text-3xl font-bold font-outfit mb-6">Agende seu horário.</h2>
            <p className="text-white/70 mb-8 leading-relaxed">Deixe seus dados e entraremos em contato para confirmar sua avaliação inicial.</p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="font-bold">Avaliação Inicial</h5>
                  <p className="text-xs text-white/50">Completa e personalizada</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="font-bold">WhatsApp Direto</h5>
                  <p className="text-xs text-white/50">Suporte 24h para pacientes</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-12 md:w-3/5">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Seu Nome</label>
                  <input required type="text" className="w-full p-4 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0a4d2c] transition-all outline-none" placeholder="João Silva" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Seu Telefone</label>
                  <input required type="tel" className="w-full p-4 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0a4d2c] transition-all outline-none" placeholder="(12) 99999-9999" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">O que você está sentindo?</label>
                <select className="w-full p-4 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0a4d2c] transition-all outline-none">
                  <option>Dor no Ombro</option>
                  <option>Dor Lombar</option>
                  <option>Dor no Joelho</option>
                  <option>Lesão Esportiva</option>
                  <option>Outro</option>
                </select>
              </div>
              <div className="flex items-start gap-3">
                <input required type="checkbox" id="lgpd" className="mt-1 w-4 h-4 rounded border-gray-300 transition-all checked:bg-[#0a4d2c]" />
                <label htmlFor="lgpd" className="text-xs text-gray-500 leading-normal">
                  Ao enviar meus dados, concordo que a Sport Health utilize as informações para contato e agendamento, conforme a Política de Privacidade.
                </label>
              </div>
              <Button disabled={loading} className="w-full py-8 text-lg font-bold bg-[#0a4d2c] hover:bg-[#083d23] rounded-xl shadow-lg shadow-[#0a4d2c]/20">
                {loading ? 'Enviando...' : 'Agendar minha avaliação'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
