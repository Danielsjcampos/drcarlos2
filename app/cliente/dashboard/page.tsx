'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Phone, LogOut, Loader2, AlertCircle } from 'lucide-react'

interface Appointment {
  id: string
  date: string
  time: string
  type: string
  status: string
}

interface Lead {
  name: string
  accessCode?: string
  appointments: Appointment[]
}

export default function ClientDashboard() {
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const code = localStorage.getItem('clientAccessCode')
    if (!code) {
      router.push('/cliente/login')
      return
    }

    fetch(`/api/cliente/dashboard?code=${code}`)
      .then(res => {
        if (!res.ok) throw new Error('Falha ao carregar')
        return res.json()
      })
      .then(data => {
        setLead(data)
        setLoading(false)
      })
      .catch(() => {
        localStorage.removeItem('clientAccessCode')
        router.push('/cliente/login')
      })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('clientAccessCode')
    router.push('/cliente/login')
  }

  const handleReschedule = (apt: Appointment) => {
    const message = `Olá, gostaria de reagendar meu atendimento do dia ${new Date(apt.date).toLocaleDateString('pt-BR')} às ${apt.time}.`
    window.open(`https://wa.me/5512997150819?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleCancel = (apt: Appointment) => {
    const message = `Olá, preciso cancelar meu atendimento do dia ${new Date(apt.date).toLocaleDateString('pt-BR')} às ${apt.time}.`
    window.open(`https://wa.me/5512997150819?text=${encodeURIComponent(message)}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0a4d2c]" />
      </div>
    )
  }

  const nextAppointment = lead?.appointments.find(a => new Date(a.date) >= new Date() && a.status !== 'CANCELLED')
  const history = lead?.appointments.filter(a => a.id !== nextAppointment?.id) || []

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />

      <div className="pt-32 pb-20 md:pt-48 md:pb-32 container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-outfit text-[#1a1a1a]">
              Olá, {lead?.name.split(' ')[0]}
            </h1>
            <p className="text-gray-500">Gerencie seus agendamentos e histórico.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Seu Código</span>
              <span className="font-mono font-bold text-[#0a4d2c] text-sm bg-white px-3 py-1 rounded-lg border border-[#0a4d2c]/10 shadow-sm">
                {typeof window !== 'undefined' ? localStorage.getItem('clientAccessCode') : ''}
              </span>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="text-red-500 hover:bg-red-50 hover:text-red-600 gap-2 rounded-xl">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Próximo Agendamento */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold font-outfit mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#0a4d2c]" />
              Próximo Agendamento
            </h2>
            
            {nextAppointment ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-[#0a4d2c]/10 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-[#e6f4ea] text-[#0a4d2c] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Confirmado
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-1">{nextAppointment.type}</p>
                    <h3 className="text-3xl font-bold font-outfit mb-6 text-[#1a1a1a]">
                      {new Date(nextAppointment.date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Clock className="h-5 w-5 text-[#0a4d2c]" />
                        <span className="font-bold text-lg">{nextAppointment.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <MapPin className="h-5 w-5 text-[#0a4d2c]" />
                        <span>Clínica Sport Health - SJC</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Phone className="h-5 w-5 text-[#0a4d2c]" />
                        <span>(12) 99715-0819</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-end gap-3">
                    <Button 
                      onClick={() => handleReschedule(nextAppointment)}
                      className="w-full bg-[#0a4d2c] hover:bg-[#083d23] text-white font-bold h-12 rounded-xl shadow-lg shadow-[#0a4d2c]/20"
                    >
                      Reagendar Horário
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleCancel(nextAppointment)}
                      className="w-full border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold h-12 rounded-xl"
                    >
                      Cancelar Agendamento
                    </Button>
                    <p className="text-xs text-gray-400 text-center mt-2">
                      Cancelamentos com menos de 24h estão sujeitos a taxa.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-gray-200">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhum agendamento futuro</h3>
                <p className="text-gray-500 mb-6">Que tal marcar sua próxima sessão?</p>
                <Button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-booking'))}
                  className="bg-[#0a4d2c] text-white font-bold rounded-full px-8"
                >
                  Agendar Agora
                </Button>
              </div>
            )}
          </div>

          {/* Histórico */}
          <div>
            <h2 className="text-xl font-bold font-outfit mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              Histórico
            </h2>
            <div className="space-y-4">
              {history.length > 0 ? (
                history.map((apt) => (
                  <div key={apt.id} className="bg-white p-5 rounded-2xl border border-gray-100 opacity-60 hover:opacity-100 transition-opacity">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-[#1a1a1a]">
                        {new Date(apt.date).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-bold uppercase">
                        {apt.status === 'DONE' ? 'Concluído' : apt.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{apt.type}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
                  <p className="text-gray-400 text-sm">Sem histórico recente.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
