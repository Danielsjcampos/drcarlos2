'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, ChevronLeft, ChevronRight, Clock, User, Phone,
  Calendar as CalendarIcon, X, Check, Ban, AlertCircle
} from 'lucide-react'

const timeSlots = ['08:00','09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00']
const dayNames = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB']
const typeLabels: Record<string, string> = {
  AVALIACAO: 'Avaliação',
  RETORNO: 'Retorno',
  TRATAMENTO: 'Tratamento',
  CONSULTA: 'Consulta',
}
const statusColors: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-600',
}
const statusLabels: Record<string, string> = {
  SCHEDULED: 'Agendado',
  CONFIRMED: 'Confirmado',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
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
}

export default function AgendaPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [weekOffset, setWeekOffset] = useState(0)
  const [form, setForm] = useState({
    patientName: '', phone: '', date: '', time: '09:00', type: 'AVALIACAO', notes: ''
  })

  const fetchAppointments = () => {
    fetch('/api/appointments').then(r => r.json()).then(data => {
      setAppointments(Array.isArray(data) ? data : [])
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

  const handleCreate = async () => {
    if (!form.patientName || !form.phone || !form.date || !form.time) return
    await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setShowModal(false)
    setForm({ patientName: '', phone: '', date: '', time: '09:00', type: 'AVALIACAO', notes: '' })
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

  const deleteAppointment = async (id: string) => {
    if (!confirm('Deseja excluir este agendamento?')) return
    await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' })
    fetchAppointments()
  }

  const isToday = (d: Date) => {
    const t = new Date()
    return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear()
  }

  if (loading) return <DashboardLayout><div className="p-10 text-center">Carregando agenda...</div></DashboardLayout>

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-gray-900">Agenda</h1>
          <p className="text-gray-500">Gerencie seus agendamentos da semana.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl p-1">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={() => setWeekOffset(w => w - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="rounded-lg text-xs font-bold" onClick={() => setWeekOffset(0)}>
              Hoje
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={() => setWeekOffset(w => w + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => setShowModal(true)} className="bg-[#0a4d2c] hover:bg-[#083d23] gap-2 rounded-xl px-6">
            <Plus className="h-5 w-5" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Hoje', value: appointments.filter(a => { const d = new Date(a.date); return isToday(d) }).length, color: 'bg-blue-50 text-blue-700' },
          { label: 'Esta Semana', value: appointments.filter(a => { const d = new Date(a.date); return weekDays.some(w => w.toISOString().split('T')[0] === d.toISOString().split('T')[0]) }).length, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Confirmados', value: appointments.filter(a => a.status === 'CONFIRMED').length, color: 'bg-green-50 text-green-700' },
          { label: 'Cancelados', value: appointments.filter(a => a.status === 'CANCELLED').length, color: 'bg-red-50 text-red-600' },
        ].map((s, i) => (
          <Card key={i} className={`p-4 ${s.color} border-none`}>
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">{s.label}</p>
            <h3 className="text-3xl font-bold">{s.value}</h3>
          </Card>
        ))}
      </div>

      {/* Weekly Calendar Grid */}
      <Card className="border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="w-20 px-3 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest text-left">Hora</th>
                {weekDays.map((d, i) => (
                  <th key={i} className={`px-2 py-3 text-center ${isToday(d) ? 'bg-[#0a4d2c]/5' : ''}`}>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">{dayNames[d.getDay()]}</span>
                    <span className={`text-lg font-bold ${isToday(d) ? 'text-[#0a4d2c]' : 'text-gray-900'}`}>{d.getDate()}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(time => (
                <tr key={time} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-3 py-2 text-xs font-bold text-gray-400 align-top pt-3">{time}</td>
                  {weekDays.map((day, di) => {
                    const slotApps = getAppointmentsForSlot(day, time)
                    return (
                      <td key={di} className={`px-1 py-1 align-top min-h-[60px] ${isToday(day) ? 'bg-[#0a4d2c]/[0.02]' : ''}`}>
                        {slotApps.map(app => (
                          <div
                            key={app.id}
                            className="bg-[#0a4d2c] text-white rounded-lg p-2 mb-1 text-[10px] cursor-pointer group relative"
                          >
                            <p className="font-bold truncate">{app.patientName}</p>
                            <p className="opacity-70">{typeLabels[app.type] || app.type}</p>
                            <div className="hidden group-hover:flex absolute top-1 right-1 gap-0.5">
                              <button onClick={() => updateStatus(app.id, 'CONFIRMED')} className="p-1 bg-white/20 rounded hover:bg-white/40" title="Confirmar">
                                <Check className="h-3 w-3" />
                              </button>
                              <button onClick={() => updateStatus(app.id, 'COMPLETED')} className="p-1 bg-white/20 rounded hover:bg-white/40" title="Concluir">
                                <Clock className="h-3 w-3" />
                              </button>
                              <button onClick={() => updateStatus(app.id, 'CANCELLED')} className="p-1 bg-red-400/50 rounded hover:bg-red-400/80" title="Cancelar">
                                <Ban className="h-3 w-3" />
                              </button>
                              <button onClick={() => deleteAppointment(app.id)} className="p-1 bg-red-500/50 rounded hover:bg-red-500/80" title="Excluir">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
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
                    <h2 className="text-xl font-bold font-outfit">Novo Agendamento</h2>
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
                        type="text" placeholder="Nome do paciente"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0a4d2c]/10 focus:border-[#0a4d2c] outline-none"
                        value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })}
                      />
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
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0a4d2c]/10 focus:border-[#0a4d2c] outline-none resize-none"
                      value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleCreate} className="w-full bg-[#0a4d2c] hover:bg-[#083d23] font-bold rounded-xl h-12">
                    Agendar Consulta
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
