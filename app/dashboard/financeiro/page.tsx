'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Plus, TrendingUp, TrendingDown, DollarSign, Receipt,
  ArrowUpRight, ArrowDownRight, X, Trash2, Filter
} from 'lucide-react'

const categories: Record<string, { label: string; color: string }> = {
  CONSULTA: { label: 'Consulta', color: 'bg-emerald-100 text-emerald-700' },
  TRATAMENTO: { label: 'Tratamento', color: 'bg-blue-100 text-blue-700' },
  AVALIACAO: { label: 'Avaliação', color: 'bg-purple-100 text-purple-700' },
  MATERIAL: { label: 'Material', color: 'bg-orange-100 text-orange-700' },
  ALUGUEL: { label: 'Aluguel', color: 'bg-red-100 text-red-700' },
  EQUIPAMENTO: { label: 'Equipamento', color: 'bg-yellow-100 text-yellow-700' },
  SALARIO: { label: 'Salário', color: 'bg-indigo-100 text-indigo-700' },
  OUTRO: { label: 'Outro', color: 'bg-gray-100 text-gray-600' },
}

interface Transaction {
  id: string
  description: string
  amount: number
  type: string
  category: string
  patientName?: string
  date: string
}

interface Summary {
  income: number
  expenses: number
  profit: number
  count: number
}

export default function FinanceiroPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<Summary>({ income: 0, expenses: 0, profit: 0, count: 0 })
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filterType, setFilterType] = useState<string>('ALL')
  const [form, setForm] = useState({
    description: '', amount: '', type: 'INCOME', category: 'CONSULTA', patientName: '', date: ''
  })

  const fetchData = () => {
    fetch('/api/financeiro').then(r => r.json()).then(data => {
      setTransactions(data.transactions || [])
      setSummary(data.summary || { income: 0, expenses: 0, profit: 0, count: 0 })
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleCreate = async () => {
    if (!form.description || !form.amount) return
    await fetch('/api/financeiro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setShowModal(false)
    setForm({ description: '', amount: '', type: 'INCOME', category: 'CONSULTA', patientName: '', date: '' })
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir esta transação?')) return
    await fetch(`/api/financeiro?id=${id}`, { method: 'DELETE' })
    fetchData()
  }

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const filtered = filterType === 'ALL' ? transactions : transactions.filter(t => t.type === filterType)

  if (loading) return <DashboardLayout><div className="p-10 text-center">Carregando financeiro...</div></DashboardLayout>

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
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Gestão de Fluxo</span>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-black font-outfit text-slate-900 tracking-tight">Financeiro</h1>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Controle de receitas e despesas da clínica.</p>
        </div>
        
        <Button 
          onClick={() => setShowModal(true)} 
          className="bg-[#0a4d2c] hover:bg-[#0d5d36] text-white gap-2 rounded-2xl px-8 h-12 md:h-14 font-black shadow-xl shadow-emerald-900/10 transition-all hover:scale-[1.03] active:scale-[0.97] w-full md:w-auto"
        >
          <Plus className="h-5 w-5" />
          Nova Transação
        </Button>
      </div>

      {/* Summary Cards with Modern Aesthetics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-8 bg-emerald-50 border-none shadow-xl shadow-emerald-900/5 rounded-[32px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-full blur-3xl opacity-50 -translate-y-12 translate-x-12" />
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-emerald-600 opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 relative z-10">Receita Total</p>
            <h3 className="text-3xl font-black text-emerald-900 font-outfit tracking-tight relative z-10">{fmt(summary.income)}</h3>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-8 bg-red-50 border-none shadow-xl shadow-red-900/5 rounded-[32px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-100 rounded-full blur-3xl opacity-50 -translate-y-12 translate-x-12" />
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
                <TrendingDown className="h-6 w-6" />
              </div>
              <ArrowDownRight className="h-5 w-5 text-red-600 opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1 relative z-10">Despesas</p>
            <h3 className="text-3xl font-black text-red-900 font-outfit tracking-tight relative z-10">{fmt(summary.expenses)}</h3>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className={cn(
            "p-8 border-none shadow-xl shadow-slate-900/5 rounded-[32px] relative overflow-hidden group transition-colors duration-500",
            summary.profit >= 0 ? 'bg-slate-900 text-white' : 'bg-red-600 text-white'
          )}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-12 translate-x-12" />
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60 relative z-10">Balanço Líquido</p>
            <h3 className="text-3xl font-black font-outfit tracking-tight relative z-10">{fmt(summary.profit)}</h3>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="p-8 bg-blue-50 border-none shadow-xl shadow-blue-900/5 rounded-[32px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-y-12 translate-x-12" />
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <Receipt className="h-6 w-6" />
              </div>
            </div>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 relative z-10">Movimentações</p>
            <h3 className="text-3xl font-black text-blue-900 font-outfit tracking-tight relative z-10">{summary.count}</h3>
          </Card>
        </motion.div>
      </div>

      {/* Transactions with Viewport Optimization */}
      <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 bg-white overflow-hidden">
        <div className="bg-slate-50/50 p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hidden">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 shrink-0">
               <Filter className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex gap-2">
              {[
                { id: 'ALL', label: 'Todas' },
                { id: 'INCOME', label: 'Receitas' },
                { id: 'EXPENSE', label: 'Despesas' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={cn(
                    "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                    filterType === f.id ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-400 hover:text-slate-900 border border-slate-200"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <Badge className="bg-emerald-50 text-emerald-600 border-none px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest w-fit">
            {filtered.length} Movimentações Encontradas
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Descrição</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Categoria</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Data</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Valor</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(t => (
              <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-gray-900">{t.description}</p>
                    {t.patientName && <p className="text-xs text-gray-400">{t.patientName}</p>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge className={`text-[10px] font-bold ${categories[t.category]?.color || 'bg-gray-100 text-gray-600'}`}>
                    {categories[t.category]?.label || t.category}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(t.date).toLocaleDateString('pt-BR')}
                </td>
                <td className={`px-6 py-4 text-right font-bold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {t.type === 'INCOME' ? '+' : '-'} {fmt(t.amount)}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(t.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-gray-400 italic">Nenhuma transação encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>

      {/* New Transaction Modal */}
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
                    <DollarSign className="h-6 w-6" />
                    <h2 className="text-xl font-bold font-outfit">Nova Transação</h2>
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-2 rounded-full bg-white/10 hover:bg-white/20">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {/* Type toggle */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setForm({ ...form, type: 'INCOME' })}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${form.type === 'INCOME' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-gray-100 text-gray-600'}`}
                    >
                      <TrendingUp className="h-4 w-4 inline mr-2" />
                      Receita
                    </button>
                    <button
                      onClick={() => setForm({ ...form, type: 'EXPENSE' })}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${form.type === 'EXPENSE' ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-gray-100 text-gray-600'}`}
                    >
                      <TrendingDown className="h-4 w-4 inline mr-2" />
                      Despesa
                    </button>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Descrição</label>
                    <input
                      type="text" placeholder="Ex: Consulta de avaliação"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0a4d2c]/10 focus:border-[#0a4d2c] outline-none"
                      value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Valor (R$)</label>
                      <input
                        type="number" step="0.01" placeholder="150.00"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0a4d2c]/10 focus:border-[#0a4d2c] outline-none"
                        value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Data</label>
                      <input
                        type="date"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0a4d2c]/10 focus:border-[#0a4d2c] outline-none"
                        value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Categoria</label>
                    <select
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0a4d2c]/10 focus:border-[#0a4d2c] outline-none"
                      value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    >
                      {Object.entries(categories).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Paciente (opcional)</label>
                    <input
                      type="text" placeholder="Nome do paciente"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0a4d2c]/10 focus:border-[#0a4d2c] outline-none"
                      value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleCreate} className="w-full bg-[#0a4d2c] hover:bg-[#083d23] font-bold rounded-xl h-12">
                    Registrar Transação
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
