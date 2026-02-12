'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Phone, User, Trash2, X, Mail, MessageCircle, Calendar as CalendarIcon, Filter, Layers, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { cn } from '@/lib/utils'

const columns = [
  { id: 'NEW', title: 'Novo', color: 'bg-blue-500' },
  { id: 'CONTACTED', title: 'Contato feito', color: 'bg-amber-500' },
  { id: 'SCHEDULED', title: 'Agendado', color: 'bg-purple-500' },
  { id: 'TREATING', title: 'Em tratamento', color: 'bg-emerald-500' },
  { id: 'PAID', title: 'Pago', color: 'bg-green-600' },
  { id: 'DONE', title: 'Concluído', color: 'bg-slate-400' },
]

interface Lead {
  id: string
  name: string
  phone: string
  email?: string
  interest: string
  origin: string
  status: string
  createdAt: string
}

export default function KanbanPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', email: '', interest: 'Geral', origin: 'Site'
  })

  const fetchLeads = () => {
    fetch('/api/leads').then(r => r.json()).then(data => {
      setLeads(Array.isArray(data) ? data : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { fetchLeads() }, [])

  const updateLeadStatus = async (id: string, newStatus: string) => {
    const updated = leads.map(l => l.id === id ? { ...l, status: newStatus } : l)
    setLeads(updated)
    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus })
    })
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return
    updateLeadStatus(draggableId, destination.droppableId)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este lead?')) return
    await fetch(`/api/leads?id=${id}`, { method: 'DELETE' })
    setLeads(leads.filter(l => l.id !== id))
  }

  const handleCreate = async () => {
    if (!form.name || !form.phone) return
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setShowModal(false)
    setForm({ name: '', phone: '', email: '', interest: 'Geral', origin: 'Site' })
    fetchLeads()
  }

  if (loading) return (
    <DashboardLayout>
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full"
        />
        <p className="text-sm font-bold text-slate-400 animate-pulse">Sincronizando Leads...</p>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      {/* Page Header Enhancement */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-12 gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-1"
          >
            <div className="w-8 h-1 bg-emerald-500 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Pipeline de Vendas</span>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-black font-outfit text-slate-900 tracking-tight">Gerenciamento de Leads</h1>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Transforme contatos em pacientes com fluxo otimizado.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="rounded-2xl border-white bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all gap-2 px-6 h-12 font-bold text-slate-600 w-full sm:w-auto">
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
          <Button 
            onClick={() => setShowModal(true)} 
            className="bg-[#0a4d2c] hover:bg-[#0d5d36] text-white gap-2 rounded-2xl px-8 h-12 font-bold shadow-xl shadow-emerald-900/10 transition-all hover:scale-[1.03] active:scale-[0.97] w-full sm:w-auto"
          >
            <Plus className="h-5 w-5" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Kanban Board with Enhanced Visuals & Mobile Scroll */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 md:gap-8 overflow-x-auto pb-8 min-h-[calc(100vh-280px)] custom-scrollbar px-1">
          {columns.map((column) => (
            <div key={column.id} className="w-[280px] md:w-[340px] shrink-0 flex flex-col">
              <div className="flex items-center justify-between mb-6 px-4">
                <div className="flex items-center gap-3">
                  <div className={cn("w-2.5 h-2.5 rounded-full shadow-lg shadow-black/10", column.color)} />
                  <h3 className="font-black text-slate-800 tracking-tight uppercase text-xs">{column.title}</h3>
                  <Badge variant="secondary" className="bg-slate-200 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-lg border-none">
                    {leads.filter(l => l.status === column.id).length}
                  </Badge>
                </div>
                <button className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-400">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "flex-1 p-3 rounded-[32px] flex flex-col gap-4 transition-all duration-300 border-2 border-transparent",
                      snapshot.isDraggingOver ? "bg-emerald-50/50 border-emerald-200/50 ring-4 ring-emerald-500/5" : "bg-slate-100/40"
                    )}
                  >
                    {leads
                      .filter(l => l.status === column.id)
                      .map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                "mb-4 outline-none transition-all",
                                snapshot.isDragging && "z-[1001]"
                              )}
                            >
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(
                                  "bg-white p-6 rounded-[24px] shadow-sm border border-slate-200/60 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-900/5 transition-all group relative overflow-hidden",
                                  snapshot.isDragging && "shadow-2xl border-emerald-500 ring-4 ring-emerald-500/10 rotate-2 scale-[1.05]"
                                )}
                              >
                                {/* Card Content */}
                                <div className="relative z-10">
                                  <div className="flex justify-between items-start mb-4">
                                    <Badge className="bg-emerald-50 text-emerald-700 text-[9px] uppercase font-black px-2.5 py-1 rounded-lg border border-emerald-100 shadow-none">
                                      {lead.interest}
                                    </Badge>
                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                                      <CalendarIcon className="h-3 w-3" />
                                      {new Date(lead.createdAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                                    </div>
                                  </div>
                                  
                                  <h4 className="font-black text-slate-900 text-lg mb-3 group-hover:text-emerald-700 transition-colors tracking-tight leading-tight">
                                    {lead.name}
                                  </h4>
                                  
                                  <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold bg-slate-50 p-2 rounded-xl group-hover:bg-emerald-50 transition-colors">
                                      <div className="bg-white p-1.5 rounded-lg shadow-sm">
                                        <Phone className="h-3 w-3 text-emerald-600" />
                                      </div>
                                      {lead.phone}
                                    </div>
                                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold bg-slate-50 p-2 rounded-xl group-hover:bg-emerald-50 transition-colors">
                                      <div className="bg-white p-1.5 rounded-lg shadow-sm">
                                        <Layers className="h-3 w-3 text-emerald-600" />
                                      </div>
                                      {lead.origin}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-2">
                                      <div className={cn("w-1.5 h-1.5 rounded-full", column.color)} />
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{column.title}</span>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button 
                                        variant="ghost" size="icon" 
                                        className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete(lead.id);
                                        }}
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button 
                                        variant="ghost" size="icon" 
                                        className="h-8 w-8 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                                      >
                                        <MessageCircle className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Decorative gradient corner */}
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />
                              </motion.div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                    
                    {leads.filter(l => l.status === column.id).length === 0 && !snapshot.isDraggingOver && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-16 border-2 border-dashed border-slate-200/60 rounded-3xl flex flex-col items-center justify-center p-8 bg-white/30 backdrop-blur-sm"
                      >
                        <Layers className="h-8 w-8 text-slate-200 mb-3" />
                        <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em]">Sem registro</p>
                      </motion.div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* New Lead Modal Enhancement */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden border border-white/20">
                <div className="bg-[#0a4d2c] p-10 text-white relative overflow-hidden">
                  {/* Decorative blobs */}
                  <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-emerald-400 rounded-full blur-[80px] opacity-20" />
                  <div className="absolute bottom-[-50%] left-[-10%] w-64 h-64 bg-green-600 rounded-full blur-[80px] opacity-20" />
                  
                  <div className="relative z-10 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                          <User className="h-6 w-6 text-emerald-400" />
                        </div>
                        <h2 className="text-3xl font-black font-outfit tracking-tight leading-none italic uppercase">Novo <span className="text-emerald-400">Lead</span></h2>
                      </div>
                      <p className="text-emerald-100/60 text-[11px] font-bold uppercase tracking-widest pl-11">Cadastro Manual do Paciente</p>
                    </div>
                    <button onClick={() => setShowModal(false)} className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-xl">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="p-10 space-y-8 bg-slate-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Paciente</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                          <input
                            type="text" placeholder="Nome Completo"
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300"
                            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">WhatsApp / Tel</label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-3.5 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                          <input
                            type="tel" placeholder="(12) 99999-9999"
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300"
                            value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Tratamento de Interesse</label>
                        <select
                          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all cursor-pointer hover:bg-slate-50"
                          value={form.interest} onChange={e => setForm({ ...form, interest: e.target.value })}
                        >
                          <option value="Geral">Geral</option>
                          <option value="Coluna e Lombar">Coluna e Lombar</option>
                          <option value="Joelho">Joelho</option>
                          <option value="Ombro">Ombro</option>
                          <option value="Quiropraxia">Quiropraxia</option>
                          <option value="Performance Esportiva">Performance Esportiva</option>
                          <option value="Pós-operatório">Pós-operatório</option>
                          <option value="Dor no Ombro">Dor no Ombro</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Origem do Contato</label>
                        <select
                          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all cursor-pointer hover:bg-slate-50"
                          value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })}
                        >
                          <option value="Site">Site Oficial</option>
                          <option value="Instagram">Instagram Ads</option>
                          <option value="Google">Google Search</option>
                          <option value="WhatsApp">Direct WhatsApp</option>
                          <option value="Indicação">Indicação de Terceiros</option>
                          <option value="Outro">Outras Fontes</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowModal(false)}
                      className="flex-1 rounded-2xl h-14 font-black uppercase text-xs tracking-wider border-slate-200 text-slate-400 hover:bg-slate-100 transition-colors"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleCreate} 
                      className="flex-[2] bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl h-14 shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Salvar Novo Lead
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
