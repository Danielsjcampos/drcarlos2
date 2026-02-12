'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Phone, LogOut, Loader2, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-12 gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-5xl font-black font-outfit text-slate-900 tracking-tight leading-tight">
              Olá, <span className="text-emerald-700">{lead?.name.split(' ')[0]}</span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium tracking-tight">Gerencie seus agendamentos e histórico completo.</p>
          </div>
          
          <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
            <div className="flex flex-col items-start md:items-end p-4 bg-white rounded-2xl border border-slate-100 shadow-sm md:shadow-none">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Código de Acesso</span>
              <span className="font-mono font-black text-emerald-800 text-sm md:text-base tracking-widest">
                {typeof window !== 'undefined' ? localStorage.getItem('clientAccessCode') : ''}
              </span>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="h-14 md:h-12 px-6 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 font-black text-xs uppercase tracking-widest flex items-center gap-3">
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
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-emerald-900/5 border border-slate-100 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -translate-y-24 translate-x-24" />
                
                <div className="absolute top-8 right-8">
                  <Badge className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border-none">
                    Confirmado
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                       <div className="w-8 h-1 bg-emerald-500 rounded-full" />
                       <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{nextAppointment.type}</span>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black font-outfit mb-8 text-slate-900 tracking-tighter leading-tight italic">
                      {new Date(nextAppointment.date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-emerald-50 transition-colors">
                        <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                          <Clock className="h-6 w-6 text-emerald-600" />
                        </div>
                        <span className="font-black text-xl md:text-2xl text-slate-800 tracking-tight">{nextAppointment.time}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 px-2">
                        <MapPin className="h-5 w-5 text-emerald-500 shadow-emerald-500/20" />
                        <span className="text-sm font-bold text-slate-500">Clínica Sport Health - SJC</span>
                      </div>
                      <div className="flex items-center gap-4 px-2">
                        <Phone className="h-5 w-5 text-emerald-500 shadow-emerald-500/20" />
                        <span className="text-sm font-bold text-slate-500">(12) 99715-0819</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-end gap-4">
                    <Button 
                      onClick={() => handleReschedule(nextAppointment)}
                      className="w-full bg-slate-950 hover:bg-emerald-700 text-white font-black h-16 rounded-2xl shadow-xl shadow-slate-900/10 transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-xs"
                    >
                      Reagendar via WhatsApp
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleCancel(nextAppointment)}
                      className="w-full border-2 border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 font-black h-16 rounded-2xl transition-all uppercase tracking-widest text-xs"
                    >
                      Cancelar Agendamento
                    </Button>
                    <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest">
                      Cancelamentos com menos de <span className="text-slate-600">24h</span> estão sujeitos a taxa administrativa.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white p-12 md:p-20 rounded-[40px] text-center border-2 border-dashed border-slate-100 hover:border-emerald-200 transition-colors group">
                <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <Calendar className="h-10 w-10 text-slate-200 group-hover:text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black font-outfit text-slate-800 mb-4 tracking-tight">Nenhum agendamento ativo</h3>
                <p className="text-sm text-slate-500 font-medium mb-10 max-w-sm mx-auto">Sua próxima evolução física começa aqui. Vamos agendar uma sessão?</p>
                <Button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-booking'))}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl h-14 px-10 shadow-xl shadow-emerald-900/10 transition-all hover:scale-105"
                >
                  Agendar Consulta Agora
                </Button>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-black font-outfit mb-8 flex items-center gap-3">
              <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                <Clock className="h-4 w-4" />
              </div>
              Histórico
            </h2>
            <div className="space-y-4">
              {history.length > 0 ? (
                history.map((apt) => (
                  <div key={apt.id} className="bg-white p-6 rounded-[24px] border border-slate-50 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 tracking-tight">
                          {new Date(apt.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1">Sessão Realizada</span>
                      </div>
                      <Badge className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border-none shadow-none",
                        apt.status === 'DONE' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                      )}>
                        {apt.status === 'DONE' ? 'Concluído' : apt.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">{apt.type}</p>
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500/5 rounded-tl-full" />
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
