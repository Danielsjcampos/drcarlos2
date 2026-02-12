'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, ChevronLeft, ChevronRight, Clock, User, Phone,
  Calendar as CalendarIcon, X, Check, Ban, AlertCircle,
  Globe, MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'

const dayNames = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB']
const typeLabels: Record<string, string> = {
  AVALIACAO: 'Avaliação',
  RETORNO: 'Retorno',
  TRATAMENTO: 'Tratamento',
  CONSULTA: 'Consulta',
  BLOCK: 'Indisponível',
}
const statusColors: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-600',
  BLOCK: 'bg-slate-200 text-slate-600',
}
const statusLabels: Record<string, string> = {
  SCHEDULED: 'Agendado',
  CONFIRMED: 'Confirmado',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
  BLOCK: 'Bloqueado',
}

interface Appointment {
  id: string
  patientName: string
  phone: string
  date: string
  time: string
  duration: number
  type: string
  status: string
  notes?: string
  leadId?: string
}

export default function AgendaPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [blockedSlots, setBlockedSlots] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [weekOffset, setWeekOffset] = useState(0)
  const [blockMode, setBlockMode] = useState(false)
  const [form, setForm] = useState<any>({
    id: null, patientName: '', phone: '', date: '', time: '09:00', type: 'AVALIACAO', notes: '', leadId: null
  })
  const [patientSearch, setPatientSearch] = useState('')

  // Dynamic time slots based on settings
  const timeSlots = React.useMemo(() => {
    const slots = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
    
    const startH = parseInt((settings?.workingStart || '08:00').split(':')[0])
    const endH = parseInt((settings?.workingEnd || '19:00').split(':')[0])

    return slots.filter(time => {
      const h = parseInt(time.split(':')[0])
      return h >= startH && h < endH
    })
  }, [settings])

  const fetchAppointments = () => {
    Promise.all([
      fetch('/api/appointments').then(r => r.json()),
      fetch('/api/agenda/block').then(r => r.json()),
      fetch('/api/settings').then(r => r.json()),
      fetch('/api/patients').then(r => r.json())
    ]).then(([apps, blocked, sett, pat]) => {
      setAppointments(Array.isArray(apps) ? apps : [])
      setBlockedSlots(Array.isArray(blocked) ? blocked : [])
      setSettings(sett)
      setPatients(Array.isArray(pat) ? pat : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { fetchAppointments() }, [])

  const getWeekDays = () => {
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      return d
    })
  }

  const weekDays = getWeekDays()

  const getAppointmentsForSlot = (day: Date, time: string) => {
    const dayStr = day.toISOString().split('T')[0]
    return appointments.filter(a => {
      const aDate = new Date(a.date).toISOString().split('T')[0]
      return aDate === dayStr && a.time === time
    })
  }

  const handleSlotClick = (day: Date, time: string) => {
    if (blockMode) {
      toggleBlock(day.getDay(), time)
      return
    }

    const dayStr = day.toISOString().split('T')[0]
    const slotApps = getAppointmentsForSlot(day, time)
    
    if (isBlocked(day.getDay(), time)) return

    if (slotApps.length > 0) {
      const app = slotApps[0]
      setForm({
        id: app.id,
        patientName: app.patientName,
        phone: app.phone,
        date: dayStr,
        time: app.time,
        type: app.type,
        notes: app.notes || '',
        leadId: app.leadId || null
      })
    } else {
      setForm({
        id: null,
        patientName: '',
        phone: '',
        date: dayStr,
        time: time,
        type: 'AVALIACAO',
        notes: '',
        leadId: null
      })
    }
    setShowModal(true)
  }

  const toggleBlock = async (dayOfWeek: number, time: string) => {
    await fetch('/api/agenda/block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dayOfWeek, time })
    })
    fetchAppointments()
  }

  const isBlocked = (dayOfWeek: number, time: string) => {
    return blockedSlots.some((s: any) => s.dayOfWeek === dayOfWeek && s.time === time)
  }

  const handleSave = async () => {
    if (!form.patientName || !form.phone || !form.date || !form.time) return
    
    const method = form.id ? 'PATCH' : 'POST'
    await fetch('/api/appointments', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setShowModal(false)
    setForm({ id: null, patientName: '', phone: '', date: '', time: '09:00', type: 'AVALIACAO', notes: '', leadId: null })
    fetchAppointments()
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/appointments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    })
    fetchAppointments()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este agendamento?')) return
    await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' })
    setShowModal(false)
    fetchAppointments()
  }

  const isToday = (d: Date) => {
    const t = new Date()
    return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear()
  }

  if (loading) return <DashboardLayout><div className="p-10 text-center">Carregando agenda...</div></DashboardLayout>

  return (
    <DashboardLayout>
      {/* Header Enhancement */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-12 gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-1"
          >
            <div className="w-8 h-1 bg-emerald-500 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Gestão de Horários</span>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-black font-outfit text-slate-900 tracking-tight">Agenda</h1>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Gerencie seus agendamentos da semana de forma inteligente.</p>
        </div>
        
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full md:w-auto">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/api/auth/google'}
            className="border-slate-200 hover:bg-slate-50 gap-2 rounded-2xl md:rounded-2xl px-4 h-11 md:h-12 text-slate-600 font-black text-[10px] uppercase tracking-widest flex-1 lg:flex-none"
          >
            <Globe className="h-4 w-4" />
            Google Sync
          </Button>
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-2xl p-1 flex-1 lg:flex-none justify-center">
            <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10 rounded-xl" onClick={() => setWeekOffset(w => w - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="rounded-xl text-[10px] font-black uppercase tracking-widest px-4" onClick={() => setWeekOffset(0)}>
              Hoje
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10 rounded-xl" onClick={() => setWeekOffset(w => w + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button 
             variant={blockMode ? "destructive" : "outline"} 
             onClick={() => setBlockMode(!blockMode)}
             className="gap-2 rounded-2xl px-4 h-11 md:h-12 font-black text-[10px] uppercase tracking-widest flex-1 lg:flex-none"
          >
            <Ban className="h-4 w-4" />
            {blockMode ? 'Sair' : 'Bloquear'}
          </Button>
          <Button 
            onClick={() => setShowModal(true)} 
            className="bg-[#0a4d2c] hover:bg-[#0d5d36] text-white gap-2 rounded-2xl px-8 h-12 md:h-14 font-black shadow-xl shadow-emerald-900/10 transition-all hover:scale-[1.03] active:scale-[0.97] w-full md:w-auto mt-2 md:mt-0"
          >
            <Plus className="h-5 w-5" />
            Novo
          </Button>
        </div>
      </div>

      {/* Stats with Modern Aesthetics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Hoje', value: appointments.filter(a => { const d = new Date(a.date); return isToday(d) }).length, color: 'bg-blue-50 text-blue-700' },
          { label: 'Esta Semana', value: appointments.filter(a => { const d = new Date(a.date); return weekDays.some(w => w.toISOString().split('T')[0] === d.toISOString().split('T')[0]) }).length, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Confirmados', value: appointments.filter(a => a.status === 'CONFIRMED').length, color: 'bg-green-50 text-green-700' },
          { label: 'Cancelados', value: appointments.filter(a => a.status === 'CANCELLED').length, color: 'bg-red-50 text-red-600' },
        ].map((s, i) => (
          <Card key={i} className={cn("p-6 md:p-8 border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden relative group", s.color)}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-3xl -translate-y-12 translate-x-12" />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2 relative z-10">{s.label}</p>
            <h3 className="text-3xl md:text-5xl font-black font-outfit tracking-tighter relative z-10 group-hover:scale-110 transition-transform origin-left">{s.value}</h3>
          </Card>
        ))}
      </div>

      {/* Weekly Calendar Grid with Scrollable Viewport */}
      <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 bg-white overflow-hidden h-[calc(100vh-380px)] md:h-[calc(100vh-350px)]">
        <div className="overflow-auto h-full custom-scrollbar">
          <table className="w-full border-collapse min-w-[800px] md:min-w-[900px] table-fixed">
            <thead className="sticky top-0 z-20 bg-white">
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="w-20 px-3 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest text-left">Hora</th>
                {weekDays.map((d, i) => (
                  <th key={i} className={`px-2 py-3 text-center border-r border-gray-100 ${isToday(d) ? 'bg-[#0a4d2c]/5' : ''}`}>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">{dayNames[d.getDay()]}</span>
                    <span className={`text-lg font-bold ${isToday(d) ? 'text-[#0a4d2c]' : 'text-gray-900'}`}>{d.getDate()}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(time => (
                <tr key={time} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors h-16">
                  <td className="px-3 py-2 text-xs font-bold text-gray-400 align-top pt-3">{time}</td>
                  {weekDays.map((day, di) => {
                    const slotApps = getAppointmentsForSlot(day, time)
                    const blocked = isBlocked(day.getDay(), time)
                    return (
                      <td 
                        key={di} 
                        onClick={() => handleSlotClick(day, time)}
                        className={`px-1 py-1 align-top border-r border-gray-50 cursor-pointer transition-colors relative ${
                          blocked ? 'bg-stripe-gray' : (isToday(day) ? 'bg-[#0a4d2c]/[0.02]' : '')
                        } hover:bg-slate-50/80`}
                      >
                        {blocked && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-10 bg-black pointer-events-none">
                            <Ban className="h-6 w-6" />
                          </div>
                        )}
                        {slotApps.map(app => (
                          <div
                            key={app.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSlotClick(day, time)
                            }}
                            className="bg-[#0a4d2c] text-white rounded-lg p-2 mb-1 text-[10px] cursor-pointer group relative shadow-sm h-full overflow-hidden"
                          >
                            <p className="font-bold truncate">{app.patientName}</p>
                            <p className="opacity-70">{typeLabels[app.type] || app.type}</p>
                            <Badge className={`mt-1 text-[8px] px-1.5 py-0 ${statusColors[app.status] || ''}`}>
                              {statusLabels[app.status] || app.status}
                            </Badge>
                          </div>
                        ))}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Appointment Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden">
                <div className="bg-gradient-to-r from-[#0a4d2c] to-[#16a34a] p-6 text-white flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-6 w-6" />
                    <h2 className="text-xl font-bold font-outfit">{form.id ? 'Editar Agendamento' : 'Novo Agendamento'}</h2>
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-2 rounded-full bg-white/10 hover:bg-white/20">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Paciente</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text" placeholder="Buscar paciente..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0a4d2c]/10 focus:border-[#0a4d2c] outline-none"
                        value={form.patientName} 
                        onChange={e => {
                          setForm({ ...form, patientName: e.target.value })
                          setPatientSearch(e.target.value)
                        }}
                      />
                      {patientSearch && patients.filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase())).length > 0 && (
                        <div className="absolute z-[110] left-0 right-0 top-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl max-h-48 overflow-auto">
                          {patients
                            .filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase()))
                            .map(p => (
                              <button
                                key={p.id}
                                className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-none flex justify-between items-center"
                                onClick={() => {
                                  setForm({ ...form, patientName: p.name, phone: p.phone || '', leadId: p.id })
                                  setPatientSearch('')
                                }}
                              >
                                <span className="text-sm font-bold text-slate-700">{p.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{p.phone}</span>
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Telefone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="tel" placeholder="(12) 99999-9999"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0a4d2c]/10 focus:border-[#0a4d2c] outline-none"
                        value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Data</label>
                      <input
                        type="date"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0a4d2c]/10 focus:border-[#0a4d2c] outline-none"
                        value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Horário</label>
                      <select
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0a4d2c]/10 focus:border-[#0a4d2c] outline-none"
                        value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                      >
                        {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Tipo</label>
                    <select
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0a4d2c]/10 focus:border-[#0a4d2c] outline-none"
                      value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    >
                      {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Observações</label>
                    <textarea
                      placeholder="Notas do agendamento..."
                      rows={2}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0a4d2c]/10 focus:border-[#0a4d2c] outline-none resize-none font-medium"
                      value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                    />
                  </div>
                  
                  {form.id && (
                    <div className="flex gap-2">
                       <Button onClick={() => updateStatus(form.id, 'CONFIRMED')} className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 border-none rounded-xl h-11 text-xs font-bold">
                         Confirmar
                       </Button>
                       <Button onClick={() => updateStatus(form.id, 'COMPLETED')} className="flex-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none rounded-xl h-11 text-xs font-bold">
                         Finalizar
                       </Button>
                       <Button onClick={() => handleDelete(form.id)} className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 border-none rounded-xl h-11 text-xs font-bold">
                         Excluir
                       </Button>
                    </div>
                  )}

                  <Button onClick={handleSave} className="w-full bg-[#0a4d2c] hover:bg-[#083d23] font-bold rounded-xl h-12 shadow-lg">
                    {form.id ? 'Salvar Alterações' : 'Confirmar Agendamento'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
