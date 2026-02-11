'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MoreHorizontal, Calendar, Phone, Mail, Filter, Search, User, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const columns = [
  { id: 'NEW', title: 'Novo' },
  { id: 'CONTACTED', title: 'Contato feito' },
  { id: 'SCHEDULED', title: 'Agendado' },
  { id: 'TREATING', title: 'Em tratamento' },
  { id: 'PAID', title: 'Pago' },
  { id: 'DONE', title: 'Concluído' },
]

export default function KanbanPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leads').then(r => r.json()).then(data => {
      setLeads(data)
      setLoading(false)
    })
  }, [])

  const updateLeadStatus = async (id: string, newStatus: string) => {
    const updated = leads.map(l => l.id === id ? { ...l, status: newStatus } : l)
    setLeads(updated)

    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus })
    })
  }

  if (loading) return <DashboardLayout><div className="p-10 text-center">Carregando CRM...</div></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-gray-900">Gerenciamento de Leads</h1>
          <p className="text-gray-500">Acompanhe a jornada do seu paciente desde o primeiro contato.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2 rounded-xl">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button className="bg-[#0a4d2c] hover:bg-[#083d23] gap-2 rounded-xl px-6">
            <Plus className="h-5 w-5" />
            Novo Lead
          </Button>
        </div>
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
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-300 hover:text-red-500">
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
    </DashboardLayout>
  )
}
