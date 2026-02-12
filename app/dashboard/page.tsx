'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Calendar as CalendarIcon, TrendingUp, ArrowUpRight, Clock, Target, Activity, Zap, X, DollarSign, TrendingDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function DashboardOverview() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [showAgendaModal, setShowAgendaModal] = useState(false)
  const [showFinanceModal, setShowFinanceModal] = useState<{show: boolean, type: 'INCOME' | 'EXPENSE'}>({ show: false, type: 'INCOME' })
  
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '', interest: 'Geral', origin: 'Dashboard' })
  const [agendaForm, setAgendaForm] = useState({ patientName: '', phone: '', date: new Date().toISOString().split('T')[0], time: '09:00', type: 'AVALIACAO', notes: '' })
  const [financeForm, setFinanceForm] = useState({ description: '', amount: '', category: 'Geral', date: new Date().toISOString().split('T')[0] })

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard/stats')
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
    } finally {
      setLoading(false)
    }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData() }, [])

  const handleSaveLead = async () => {
    if (!leadForm.name || !leadForm.phone) return
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadForm)
    })
    setShowLeadModal(false)
    setLeadForm({ name: '', phone: '', email: '', interest: 'Geral', origin: 'Dashboard' })
    fetchData()
  }

  const handleSaveAppointment = async () => {
    if (!agendaForm.patientName || !agendaForm.phone) return
    await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agendaForm)
    })
    setShowAgendaModal(false)
    setAgendaForm({ patientName: '', phone: '', date: new Date().toISOString().split('T')[0], time: '09:00', type: 'AVALIACAO', notes: '' })
    fetchData()
  }

  const handleSaveFinance = async () => {
    if (!financeForm.description || !financeForm.amount) return
    await fetch('/api/financeiro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...financeForm, type: showFinanceModal.type })
    })
    setShowFinanceModal({ show: false, type: 'INCOME' })
    setFinanceForm({ description: '', amount: '', category: 'Geral', date: new Date().toISOString().split('T')[0] })
    fetchData()
  }

  if (loading) return (
    <DashboardLayout>
      <div className="h-full flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full" />
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      {/* Welcome & Quick Actions Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start gap-10 mb-14">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex-1"
        >
          <div className="flex items-center gap-3 mb-3">
             <div className="h-2 w-12 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Performance Cockpit</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-outfit text-slate-900 tracking-tight leading-none mb-4">
            Painel <span className="text-emerald-500 italic">Estratégico</span>
          </h1>
          <p className="text-slate-500 font-bold max-w-xl text-base md:text-lg leading-relaxed">
            Bem-vindo de volta, Dr. Carlos. <br className="hidden md:block" /> 
            Sua clínica está operando com <span className="text-emerald-600 font-black uppercase text-sm tracking-widest">{data?.stats.conversionRate > 20 ? 'Alta' : 'Normal'} Eficiência</span> hoje.
          </p>
        </motion.div>

        {/* Quick Access Buttons */}
        <div className="flex flex-wrap gap-4 w-full xl:w-auto">
          <Button 
            onClick={() => setShowFinanceModal({ show: true, type: 'INCOME' })}
            className="flex-1 sm:flex-none h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl px-6 shadow-xl shadow-blue-500/10 gap-2 hover:-translate-y-1 transition-all"
          >
            <DollarSign className="h-4 w-4" />
            Receita
          </Button>
          <Button 
            onClick={() => setShowFinanceModal({ show: true, type: 'EXPENSE' })}
            className="flex-1 sm:flex-none h-14 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl px-6 shadow-xl shadow-red-500/10 gap-2 hover:-translate-y-1 transition-all"
          >
            <TrendingDown className="h-4 w-4" />
            Despesa
          </Button>
          <Button 
            onClick={() => setShowLeadModal(true)}
            className="flex-1 sm:flex-none h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl px-6 shadow-xl shadow-emerald-500/20 gap-2 hover:-translate-y-1 transition-all"
          >
            <Users className="h-4 w-4" />
            Paciente
          </Button>
          <Button 
            onClick={() => setShowAgendaModal(true)}
            className="flex-1 sm:flex-none h-14 bg-[#0a4d2c] hover:bg-[#083d23] text-white font-black rounded-2xl px-6 shadow-xl shadow-emerald-950/20 gap-2 hover:-translate-y-1 transition-all"
          >
            <CalendarIcon className="h-4 w-4" />
            Agenda
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
        <StatCard 
          title="Leads Totais" 
          value={data?.stats.totalLeads.toString()} 
          change={`${data?.stats.newLeads} novos`} 
          icon={<Users className="h-6 w-6" />} 
          variant="primary"
          delay={0.1}
        />
        <StatCard 
          title="Posts Gerados" 
          value={data?.stats.totalPosts.toString()} 
          change="IA Ativa" 
          icon={<Zap className="h-6 w-6" />} 
          variant="accent"
          delay={0.2}
        />
        <StatCard 
          title="Taxa de Conversão" 
          value={`${data?.stats.conversionRate}%`} 
          change="+2.4% vs média" 
          icon={<Target className="h-6 w-6" />} 
          variant="white"
          delay={0.3}
        />
      </div>

      {/* Main Grid: Appointments & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Today's Appointments Section */}
         <Card className="lg:col-span-12 xl:col-span-8 rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden bg-white/70 backdrop-blur-xl border border-white/40">
            <CardHeader className="p-8 md:p-10 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarIcon className="h-4 w-4 text-emerald-500" />
                    <CardTitle className="text-xl md:text-2xl font-black font-outfit tracking-tight">Consultas do Dia</CardTitle>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Seus horários agendados para hoje</p>
               </div>
               <Badge className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                  {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
               </Badge>
            </CardHeader>
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hora</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Paciente</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {data?.todayAppointments?.length > 0 ? (
                         data.todayAppointments.map((app: any, i: number) => (
                           <tr key={i} className="hover:bg-slate-50/50 transition-colors group cursor-default">
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3 text-emerald-500" />
                                    <span className="text-sm font-black font-outfit text-slate-700 tracking-tight">{app.time}</span>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex items-center justify-between gap-4">
                                   <div>
                                     <p className="text-sm font-black text-slate-800 tracking-tight leading-none group-hover:text-emerald-700 transition-colors uppercase">{app.patientName}</p>
                                     <p className="text-[10px] text-slate-400 font-bold mt-1 tracking-wider">{app.phone}</p>
                                   </div>
                                   {app.lead?.accessCode && (
                                     <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] px-2 py-0.5 rounded-lg shrink-0">
                                       PIN: {app.lead.accessCode}
                                     </Badge>
                                   )}
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 text-[9px] font-black px-3 rounded-lg">
                                    {app.type}
                                 </Badge>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-2">
                                    <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", app.status === 'CONFIRMED' ? 'bg-emerald-500' : 'bg-blue-500')} />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{app.status}</span>
                                 </div>
                              </td>
                           </tr>
                         ))
                       ) : (
                         <tr>
                            <td colSpan={4} className="px-8 py-20 text-center">
                               <CalendarIcon className="h-10 w-10 text-slate-100 mx-auto mb-4" />
                               <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Nenhuma consulta agendada para hoje</p>
                            </td>
                         </tr>
                       )}
                    </tbody>
                 </table>
               </div>
            </CardContent>
         </Card>

         {/* Right Sidebar: Recents & Insights */}
         <div className="lg:col-span-12 xl:col-span-4 space-y-10">
            {/* Live Activity Board */}
            <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden bg-white/70 backdrop-blur-xl border border-white/40">
               <CardHeader className="p-8 border-b border-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="h-4 w-4 text-emerald-500" />
                        <CardTitle className="text-xl font-black font-outfit tracking-tight">Atividade</CardTitle>
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Últimas 24h</p>
                    </div>
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y divide-slate-50">
                     {data?.activities.map((act: any) => (
                       <ActivitySmallItem 
                        key={act.id}
                        title={act.title} 
                        desc={act.desc} 
                        time={new Date(act.time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} 
                        type={act.type}
                       />
                     ))}
                  </div>
                  <div className="p-6 bg-slate-50/50 flex justify-center border-t border-slate-50">
                     <button className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-2">
                       Ver tudo
                       <ArrowUpRight className="h-3 w-3" />
                     </button>
                  </div>
               </CardContent>
            </Card>

            {/* Growth Suggestion Card (AI Insights) */}
            <Card className="rounded-[40px] border-none p-10 shadow-xl bg-emerald-50/80 border border-emerald-100 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/40 rounded-full blur-[60px] translate-x-10 -translate-y-10" />
               <h4 className="font-black font-outfit text-slate-800 text-lg mb-6 flex items-center gap-3 relative z-10">
                 <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20">
                   <TrendingUp className="h-5 w-5 text-white" />
                 </div>
                 Growth Engine
               </h4>
                <p className="text-base text-slate-600 leading-relaxed font-bold italic relative z-10">
                  &quot;Pico de procura por <span className="text-emerald-600 underline decoration-emerald-500/30 underline-offset-4">Performance</span> em SJC detectado.&quot;
                </p>
               <div className="mt-8 relative z-10">
                  <Button className="w-full bg-white hover:bg-slate-50 text-emerald-700 font-black rounded-2xl h-12 shadow-md border-none transition-all text-xs">
                    Criar Post de Campanha
                  </Button>
               </div>
            </Card>
         </div>
      </div>

      {/* New Lead Modal */}
      <AnimatePresence>
        {showLeadModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]" onClick={() => setShowLeadModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none" >
              <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden">
                <div className="bg-[#0a4d2c] p-10 text-white flex justify-between items-center">
                  <h2 className="text-2xl font-black font-outfit tracking-tight uppercase italic">Novo <span className="text-emerald-400">Cliente</span></h2>
                  <button onClick={() => setShowLeadModal(false)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20"><X className="h-5 w-5" /></button>
                </div>
                <div className="p-10 space-y-6">
                  <div className="space-y-4">
                    <input type="text" placeholder="Nome do Cliente" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold" value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} />
                    <input type="tel" placeholder="WhatsApp" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold" value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})} />
                  </div>
                  <Button onClick={handleSaveLead} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black h-16 rounded-2xl shadow-xl shadow-emerald-500/20">Cadastrar Agora</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* New Appointment Modal */}
      <AnimatePresence>
        {showAgendaModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]" onClick={() => setShowAgendaModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none" >
              <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden">
                <div className="bg-[#0a4d2c] p-10 text-white flex justify-between items-center">
                  <h2 className="text-2xl font-black font-outfit tracking-tight uppercase italic">Marcar <span className="text-emerald-400">Agenda</span></h2>
                  <button onClick={() => setShowAgendaModal(false)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20"><X className="h-5 w-5" /></button>
                </div>
                <div className="p-10 space-y-4">
                  <input type="text" placeholder="Nome do Paciente" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold" value={agendaForm.patientName} onChange={e => setAgendaForm({...agendaForm, patientName: e.target.value})} />
                  <input type="tel" placeholder="WhatsApp" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold" value={agendaForm.phone} onChange={e => setAgendaForm({...agendaForm, phone: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="date" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" value={agendaForm.date} onChange={e => setAgendaForm({...agendaForm, date: e.target.value})} />
                    <input type="time" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" value={agendaForm.time} onChange={e => setAgendaForm({...agendaForm, time: e.target.value})} />
                  </div>
                  <Button onClick={handleSaveAppointment} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black h-16 rounded-2xl shadow-xl shadow-emerald-500/20 mt-4">Confirmar Agendamento</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Finance Modal */}
      <AnimatePresence>
        {showFinanceModal.show && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]" onClick={() => setShowFinanceModal({ show: false, type: 'INCOME' })} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none" >
              <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden">
                <div className={cn("p-10 text-white flex justify-between items-center", showFinanceModal.type === 'INCOME' ? 'bg-blue-600' : 'bg-red-500')}>
                  <h2 className="text-2xl font-black font-outfit tracking-tight uppercase italic flex items-center gap-3">
                    {showFinanceModal.type === 'INCOME' ? <DollarSign className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                    Nova <span className="opacity-70">{showFinanceModal.type === 'INCOME' ? 'Receita' : 'Despesa'}</span>
                  </h2>
                  <button onClick={() => setShowFinanceModal({ show: false, type: 'INCOME' })} className="p-2 rounded-xl bg-white/10 hover:bg-white/20"><X className="h-5 w-5" /></button>
                </div>
                <div className="p-10 space-y-4">
                  <div className="space-y-4">
                    <input type="text" placeholder="Descrição" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold" value={financeForm.description} onChange={e => setFinanceForm({...financeForm, description: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="number" placeholder="Valor (R$)" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold" value={financeForm.amount} onChange={e => setFinanceForm({...financeForm, amount: e.target.value})} />
                      <input type="date" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" value={financeForm.date} onChange={e => setFinanceForm({...financeForm, date: e.target.value})} />
                    </div>
                    <select className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" value={financeForm.category} onChange={e => setFinanceForm({...financeForm, category: e.target.value})}>
                      <option value="Serviços">Serviços</option>
                      <option value="Materiais">Materiais</option>
                      <option value="Aluguel">Aluguel</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                  <Button onClick={handleSaveFinance} className={cn("w-full text-white font-black h-16 rounded-2xl shadow-xl mt-4", showFinanceModal.type === 'INCOME' ? 'bg-blue-600 shadow-blue-500/20' : 'bg-red-500 shadow-red-500/20')}>
                    Lançar Agora
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

function StatCard({ title, value, change, icon, variant, delay }: any) {
  const styles: any = {
    primary: "bg-[#0a4d2c] text-white shadow-emerald-950/20",
    white: "bg-white text-slate-900 border border-slate-100 shadow-slate-200/50",
    accent: "bg-emerald-500 text-white shadow-emerald-500/20"
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Card className={`rounded-[40px] border-none shadow-2xl p-10 flex flex-col justify-between min-h-[260px] relative overflow-hidden ${styles[variant]}`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
        <div className="flex justify-between items-start relative z-10">
          <div className={cn(
            "p-5 rounded-3xl shadow-lg transition-transform hover:rotate-12 duration-500",
            variant === 'primary' ? 'bg-white/10 text-emerald-400' : 'bg-slate-100 text-emerald-600'
          )}>
            {icon}
          </div>
          <Badge className={cn(
            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border-none shadow-none",
            variant === 'primary' ? 'bg-white/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
          )}>
            {change}
          </Badge>
        </div>
        <div className="relative z-10">
          <h3 className="text-6xl font-black font-outfit mb-3 tracking-tighter leading-none">{value}</h3>
          <p className={cn(
            "text-[11px] font-black uppercase tracking-[0.25em]",
            variant === 'primary' ? 'text-white/40' : 'text-slate-400'
          )}>{title}</p>
        </div>
      </Card>
    </motion.div>
  )
}

function ActivitySmallItem({ title, desc, time, type }: any) {
   const icons: any = {
      NEW_LEAD: <Users className="h-4 w-4" />,
      APPOINTMENT: <CalendarIcon className="h-4 w-4" />,
      POST: <Zap className="h-4 w-4" />,
   }

   return (
      <div className="p-6 flex gap-5 hover:bg-slate-50/50 transition-all duration-300 group cursor-default">
         <div className="h-12 w-12 shrink-0 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm text-slate-400 group-hover:text-emerald-500 group-hover:border-emerald-100 transition-all">
            {icons[type] || <Activity className="h-4 w-4" />}
         </div>
         <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
               <p className="text-[11px] font-black font-outfit text-slate-800 tracking-tight uppercase group-hover:text-emerald-700 transition-colors truncate">{title}</p>
               <span className="text-[9px] font-black text-slate-300 uppercase shrink-0">{time}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-bold leading-relaxed truncate">{desc}</p>
         </div>
      </div>
   )
}

