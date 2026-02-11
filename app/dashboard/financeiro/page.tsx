'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
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
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-gray-900">Financeiro</h1>
          <p className="text-gray-500">Controle de receitas e despesas da clínica.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-[#0a4d2c] hover:bg-[#083d23] gap-2 rounded-xl px-6">
          <Plus className="h-5 w-5" />
          Nova Transação
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 bg-emerald-50 border-emerald-100">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Receita Total</p>
          <h3 className="text-2xl font-bold text-emerald-800">{fmt(summary.income)}</h3>
        </Card>
        <Card className="p-6 bg-red-50 border-red-100">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-red-500 text-white flex items-center justify-center">
              <TrendingDown className="h-5 w-5" />
            </div>
            <ArrowDownRight className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Despesas</p>
          <h3 className="text-2xl font-bold text-red-800">{fmt(summary.expenses)}</h3>
        </Card>
        <Card className={`p-6 ${summary.profit >= 0 ? 'bg-[#0a4d2c] text-white' : 'bg-red-600 text-white'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-60">Lucro</p>
          <h3 className="text-2xl font-bold">{fmt(summary.profit)}</h3>
        </Card>
        <Card className="p-6 bg-blue-50 border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500 text-white flex items-center justify-center">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Total Transações</p>
          <h3 className="text-2xl font-bold text-blue-800">{summary.count}</h3>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-white p-4 border-b border-gray-50 flex items-center gap-3">
          <Filter className="h-4 w-4 text-gray-400" />
          <div className="flex gap-2">
            {[
              { id: 'ALL', label: 'Todas' },
              { id: 'INCOME', label: 'Receitas' },
              { id: 'EXPENSE', label: 'Despesas' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterType === f.id ? 'bg-[#0a4d2c] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} transações</span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
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
