'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Instagram, MessageCircle, Clock, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createLead } from '@/lib/actions'

export function ContactPageContent() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interest: 'Geral',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await createLead({ ...formData, origin: 'Pagina Contato' })
    setLoading(false)
    if (res.success) {
      setSuccess(true)
      setFormData({ name: '', phone: '', email: '', interest: 'Geral', message: '' })
    }
  }

  return (
    <>
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 bg-[#fafafa]">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-outfit mb-6">Fale Conosco</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Estamos prontos para tirar suas dúvidas e agendar sua avaliação. Escolha o canal de sua preferência.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold font-outfit mb-8">Informações de Contato</h2>
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-[#0a4d2c]/5 text-[#0a4d2c] flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Endereço</h4>
                      <p className="text-gray-600">Av. Linneu de Moura, s/n - Condomínio ..., São José dos Campos - SP, 12244-380</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-[#0a4d2c]/5 text-[#0a4d2c] flex items-center justify-center shrink-0">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Telefone / WhatsApp</h4>
                      <p className="text-gray-600">(12) 99715-0819</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-[#0a4d2c]/5 text-[#0a4d2c] flex items-center justify-center shrink-0">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Email</h4>
                      <p className="text-gray-600">contato@sporthealthsjc.com.br</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold font-outfit mb-8">Horário de Atendimento</h2>
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-[#0a4d2c]/5 text-[#0a4d2c] flex items-center justify-center shrink-0">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <span className="text-gray-600">Segunda - Sexta</span>
                    <span className="font-bold">08:00 - 20:00</span>
                    <span className="text-gray-600">Sábado</span>
                    <span className="font-bold">08:00 - 12:00</span>
                    <span className="text-gray-600">Domingo</span>
                    <span className="font-bold">Fechado</span>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-[#0a4d2c] rounded-3xl text-white">
                <h3 className="text-2xl font-bold font-outfit mb-4">Atendimento de Urgência?</h3>
                <p className="text-white/70 mb-6">Precisa de um encaixe para uma lesão aguda? Clique abaixo e fale direto comigo no WhatsApp.</p>
                <Button className="w-full bg-[#22c55e] hover:bg-[#1db954] text-[#0a4d2c] font-bold py-6 text-lg">
                  Chamar no WhatsApp
                  <MessageCircle className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-2xl">
              <h2 className="text-3xl font-bold font-outfit mb-8">Envie uma Mensagem</h2>
              {success ? (
                <div className="bg-green-50 text-green-700 p-8 rounded-2xl text-center">
                  <Send className="h-12 w-12 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold mb-2">Mensagem Enviada!</h4>
                  <p>Obrigado! Recebemos seus dados e entraremos em contato em breve.</p>
                  <Button variant="outline" className="mt-6 border-green-200" onClick={() => setSuccess(false)}>Enviar outra mensagem</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Seu Nome</label>
                    <input 
                      required
                      type="text" 
                      className="w-full p-4 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0a4d2c] transition-all outline-none" 
                      placeholder="Como podemos te chamar?"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Seu Telefone</label>
                      <input 
                        required
                        type="tel" 
                        className="w-full p-4 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0a4d2c] transition-all outline-none" 
                        placeholder="(12) 99999-9999"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Seu E-mail (Opcional)</label>
                      <input 
                        type="email" 
                        className="w-full p-4 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0a4d2c] transition-all outline-none" 
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Assunto / Interesse</label>
                    <select 
                      className="w-full p-4 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0a4d2c] transition-all outline-none"
                      value={formData.interest}
                      onChange={e => setFormData({...formData, interest: e.target.value})}
                    >
                      <option>Agendar Avaliação</option>
                      <option>Dúvida sobre Tratamento</option>
                      <option>Parcerias / Eventos</option>
                      <option>Outro</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Sua Mensagem</label>
                    <textarea 
                      rows={4}
                      className="w-full p-4 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0a4d2c] transition-all outline-none" 
                      placeholder="Conte um pouco sobre o que você está sentindo..."
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full py-8 text-lg font-bold bg-[#0a4d2c] hover:bg-[#083d23] rounded-xl shadow-lg shadow-[#0a4d2c]/20">
                    {loading ? 'Enviando...' : 'Enviar Mensagem'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
