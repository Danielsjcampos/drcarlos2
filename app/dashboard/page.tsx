'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    totalPosts: 0,
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/leads').then(r => r.json()),
      fetch('/api/blog').then(r => r.json())
    ]).then(([leads, posts]) => {
      setStats({
        totalLeads: leads.length,
        newLeads: leads.filter((l: any) => l.status === 'NEW').length,
        totalPosts: posts.length
      })
    })
  }, [])

  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold font-outfit text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Bem-vindo de volta, Dr. Carlos. Aqui está o resumo do seu site.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Total de Leads" 
          value={stats.totalLeads.toString()} 
          change="+12% vs mês anterior" 
          icon={<Users className="h-6 w-6 text-blue-600" />} 
          color="bg-blue-50"
        />
        <StatCard 
          title="Novos Leads" 
          value={stats.newLeads.toString()} 
          change="Aguardando contato" 
          icon={<Clock className="h-6 w-6 text-orange-600" />} 
          color="bg-orange-50"
          isAlert={stats.newLeads > 0}
        />
        <StatCard 
          title="Total de Posts" 
          value={stats.totalPosts.toString()} 
          change={`${stats.totalPosts} artigos publicados`} 
          icon={<FileText className="h-6 w-6 text-green-600" />} 
          color="bg-green-50"
        />
        <StatCard 
          title="Taxa de Conversão" 
          value="18%" 
          change="+2% este mês" 
          icon={<TrendingUp className="h-6 w-6 text-purple-600" />} 
          color="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="border-gray-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50">
               <CardTitle className="text-lg font-bold">Atividade Recente</CardTitle>
               <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-gray-200">Tempo Real</Badge>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-gray-50">
                  <ActivityItem 
                    title="Novo Lead Capturado" 
                    desc="João Silva se interessou por 'Dor no Ombro'" 
                    time="há 5 minutos" 
                    type="NEW_LEAD"
                  />
                  <ActivityItem 
                    title="Post Publicado" 
                    desc="Artigo sobre Quiropraxia está online" 
                    time="há 2 horas" 
                    type="POST"
                  />
                  <ActivityItem 
                    title="Agendamento Confirmado" 
                    desc="Maria Santos - Quinta às 14:00" 
                    time="há 4 horas" 
                    type="SCHEDULE"
                  />
               </div>
            </CardContent>
         </Card>

         <Card className="border-gray-100 shadow-sm bg-[#0a4d2c] text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <TrendingUp className="h-32 w-32" />
            </div>
            <CardContent className="p-8 relative z-10 flex flex-col h-full justify-between">
               <div>
                  <h3 className="text-2xl font-bold font-outfit mb-2">Seu SEO está voando! 🚀</h3>
                  <p className="text-white/70 text-sm mb-8 leading-relaxed">
                     As keywords locais em São José dos Campos tiveram um aumento de 24% em visibilidade esta semana.
                  </p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                     <p className="text-[10px] uppercase font-bold text-white/50 mb-1">Impressões</p>
                     <p className="text-xl font-bold">4.2k</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                     <p className="text-[10px] uppercase font-bold text-white/50 mb-1">Cliques</p>
                     <p className="text-xl font-bold">342</p>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
    </DashboardLayout>
  )
}

function StatCard({ title, value, change, icon, color, isAlert }: any) {
  return (
    <Card className="border-gray-100 shadow-sm transition-all hover:border-[#22c55e]/30 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${color} transition-colors group-hover:scale-110 duration-300`}>
            {icon}
          </div>
          {isAlert && <Badge className="bg-orange-500 text-[10px] animate-pulse">Ação Necessária</Badge>}
        </div>
        <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm font-bold text-gray-400">{title}</p>
        <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-gray-500">
           {change.includes('+') ? <ArrowUpRight className="h-3 w-3 text-green-500" /> : <Clock className="h-3 w-3 text-gray-300" />}
           <span>{change}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityItem({ title, desc, time, type }: any) {
   return (
      <div className="p-4 flex gap-4 hover:bg-gray-50/50 transition-colors">
         <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${
            type === 'NEW_LEAD' ? 'bg-blue-50 text-blue-600' : 
            type === 'POST' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'
         }`}>
            {type === 'NEW_LEAD' ? <Users className="h-5 w-5" /> : 
             type === 'POST' ? <FileText className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
         </div>
         <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">{title}</p>
            <p className="text-xs text-gray-500 mt-1">{desc}</p>
            <p className="text-[10px] text-gray-400 mt-2 font-medium flex items-center gap-1">
               <Clock className="h-3 w-3" />
               {time}
            </p>
         </div>
      </div>
   )
}
