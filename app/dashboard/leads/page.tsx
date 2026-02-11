'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Phone, User, Trash2, X, Mail, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const columns = [
  { id: 'NEW', title: 'Novo' },
  { id: 'CONTACTED', title: 'Contato feito' },
  { id: 'SCHEDULED', title: 'Agendado' },
  { id: 'TREATING', title: 'Em tratamento' },
  { id: 'PAID', title: 'Pago' },
  { id: 'DONE', title: 'Concluído' },
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

  if (loading) return <DashboardLayout><div className="p-10 text-center">Carregando CRM...</div></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-gray-900">Gerenciamento de Leads</h1>
          <p className="text-gray-500">Acompanhe a jornada do seu paciente desde o primeiro contato.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-[#0a4d2c] hover:bg-[#083d23] gap-2 rounded-xl px-6">
          <Plus className="h-5 w-5" />
          Novo Lead
        </Button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-8 min-h-[calc(100vh-250px)]">
        {columns.map((column) => (
          <div key={column.id} className="w-[320px] shrink-0">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-700">{column.title}</h3>
                <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {leads.filter(l => l.status === column.id).length}
                </span>
              </div>
            </div>

            <div className="bg-gray-100/50 p-3 rounded-2xl min-h-full flex flex-col gap-3">
              <AnimatePresence>
                {leads.filter(l => l.status === column.id).map((lead) => (
                  <motion.div
                    key={lead.id}
                    layoutId={lead.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-[#22c55e] transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-[#0a4d2c]/5 text-[#0a4d2c] text-[10px] uppercase font-bold px-2 py-0.5">
                        {lead.interest}
                      </Badge>
                      <span className="text-[9px] text-gray-400 font-medium">
                        {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{lead.name}</h4>
                    <div className="flex flex-col gap-1 text-[11px] text-gray-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3" />
                        Origem: {lead.origin}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <select 
                        className="text-[10px] font-bold text-[#0a4d2c] bg-transparent outline-none cursor-pointer"
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      >
                        {columns.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                      <Button 
                        variant="ghost" size="icon" 
                        className="h-6 w-6 text-gray-300 hover:text-red-500"
                        onClick={() => handleDelete(lead.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {leads.filter(l => l.status === column.id).length === 0 && (
                <div className="py-12 border-2 border-dashed border-gray-200/50 rounded-xl flex items-center justify-center p-8">
                  <p className="text-[10px] text-gray-400 font-medium italic">Vazio</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Lead Modal */}
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
                    <User className="h-6 w-6" />
                    <h2 className="text-xl font-bold font-outfit">Novo Lead</h2>
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-2 rounded-full bg-white/10 hover:bg-white/20">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Nome</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text" placeholder="Nome do paciente"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0a4d2c]/10 focus:border-[#0a4d2c] outline-none"
                        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
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
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Email (opcional)</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="email" placeholder="email@exemplo.com"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0a4d2c]/10 focus:border-[#0a4d2c] outline-none"
                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Interesse</label>
                      <select
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0a4d2c]/10 focus:border-[#0a4d2c] outline-none"
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
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Origem</label>
                      <select
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0a4d2c]/10 focus:border-[#0a4d2c] outline-none"
                        value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })}
                      >
                        <option value="Site">Site</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Google">Google</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Indicação">Indicação</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                  </div>
                  <Button onClick={handleCreate} className="w-full bg-[#0a4d2c] hover:bg-[#083d23] font-bold rounded-xl h-12">
                    Adicionar Lead
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
