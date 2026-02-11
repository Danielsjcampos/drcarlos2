'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Target, Activity, Settings } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

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
        totalLeads: Array.isArray(leads) ? leads.length : 0,
        newLeads: Array.isArray(leads) ? leads.filter((l: any) => l.status === 'NEW').length : 0,
        totalPosts: Array.isArray(posts) ? posts.length : 0
      })
    }).catch(err => console.error("Error fetching stats:", err));
  }, [])

  return (
    <DashboardLayout>
      <div className="mb-12">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-black font-outfit text-gray-900 tracking-tight"
        >
          Overview do Sistema
        </motion.h1>
        <p className="text-gray-500 font-medium mt-2">Bem-vindo Dr. Carlos. Seus indicadores estão performando acima da média.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <StatCard 
          title="Leads Ativos" 
          value={stats.totalLeads.toString()} 
          change="+24% vs ontem" 
          icon={<Users className="h-6 w-6" />} 
          variant="primary"
        />
        <StatCard 
          title="Artigos Publicados" 
          value={stats.totalPosts.toString()} 
          change="IA gerando conteúdo" 
          icon={<FileText className="h-6 w-6" />} 
          variant="secondary"
        />
        <StatCard 
          title="Taxa de Conversão" 
          value="22.4%" 
          change="+4.2% este mês" 
          icon={<Target className="h-6 w-6" />} 
          variant="accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
         <Card className="lg:col-span-4 rounded-[2.5rem] border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-gray-50 flex flex-row items-center justify-between">
               <div>
                  <CardTitle className="text-xl font-black font-outfit">Atividade em Tempo Real</CardTitle>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Últimas 24 horas</p>
               </div>
               <Badge variant="outline" className="px-3 py-1 bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] font-black uppercase tracking-widest animate-pulse">Live Now</Badge>
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
                    title="Artigo Publicado via IA" 
                    desc="Benefícios da Quiropraxia para Atletas" 
                    time="há 2 horas" 
                    type="POST"
                  />
                  <ActivityItem 
                    title="Configuração Atualizada" 
                    desc="Site name alterado para 'Sport Health'" 
                    time="há 4 horas" 
                    type="SETTING"
                  />
                  <ActivityItem 
                    title="Lead Contactado" 
                    desc="Maria Santos movida para 'Em Atendimento'" 
                    time="há 6 horas" 
                    type="NEW_LEAD"
                  />
               </div>
            </CardContent>
         </Card>

         <div className="lg:col-span-3 space-y-8">
            <Card className="rounded-[2.5rem] border-none bg-gradient-to-br from-[#0a4d2c] to-[#16a34a] text-white p-10 relative overflow-hidden shadow-2xl shadow-[#0a4d2c]/20 min-h-[300px] flex flex-col justify-between">
               <div className="absolute top-0 right-0 p-10 opacity-10">
                  <Activity className="h-32 w-32" />
               </div>
               <div className="relative z-10">
                  <h3 className="text-3xl font-black font-outfit leading-tight mb-4">SEO Dominando <br />em SJC.</h3>
                  <p className="text-white/70 text-base leading-relaxed font-inter">
                     Sua clínica é a #1 em termos de "Fisioterapia Esportiva" na região.
                  </p>
               </div>
               <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-white/10 rounded-3xl p-6 backdrop-blur-md border border-white/10">
                     <p className="text-[10px] uppercase font-black text-white/40 mb-2 tracking-[0.2em]">Visitas</p>
                     <p className="text-2xl font-black font-outfit">1,420</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-md border border-white/10">
                     <p className="text-[10px] uppercase font-black text-white/40 mb-2 tracking-[0.2em]">CTR</p>
                     <p className="text-2xl font-black font-outfit">8.4%</p>
                  </div>
               </div>
            </Card>

            <Card className="rounded-[2.5rem] border-gray-100 p-8 shadow-xl bg-gray-50/50">
               <h4 className="font-black font-outfit text-gray-900 mb-6 flex items-center gap-2">
                 <TrendingUp className="h-5 w-5 text-[#16a34a]" />
                 Dica do Growth IA
               </h4>
               <p className="text-sm text-gray-600 leading-relaxed italic border-l-4 border-[#16a34a] pl-4">
                 "Atletas de CrossFit estão buscando muito por 'Mobilidade de Tornozelo' em sua região. Considere gerar um blog post sobre isso."
               </p>
            </Card>
         </div>
      </div>
    </DashboardLayout>
  )
}

function StatCard({ title, value, change, icon, variant }: any) {
  const styles: any = {
    primary: "bg-[#0a4d2c] text-white shadow-[#0a4d2c]/20",
    secondary: "bg-white text-gray-900 border-gray-100",
    accent: "bg-[#22d3ee] text-[#0a4d2c] shadow-[#22d3ee]/20"
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`rounded-[2.5rem] border-none shadow-2xl p-10 flex flex-col justify-between min-h-[220px] ${styles[variant]}`}>
        <div className="flex justify-between items-start">
          <div className={`p-4 rounded-2xl ${variant === 'primary' ? 'bg-white/10' : variant === 'accent' ? 'bg-[#0a4d2c]/10' : 'bg-gray-50'}`}>
            {icon}
          </div>
          <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${variant === 'primary' ? 'text-white/50' : 'text-gray-400'}`}>
            <ArrowUpRight className="h-3 w-3" />
            {change}
          </div>
        </div>
        <div>
          <h3 className="text-5xl font-black font-outfit mb-2">{value}</h3>
          <p className={`text-sm font-bold uppercase tracking-widest ${variant === 'primary' ? 'text-white/40' : 'text-gray-400'}`}>{title}</p>
        </div>
      </Card>
    </motion.div>
  )
}

function ActivityItem({ title, desc, time, type }: any) {
   const icons: any = {
      NEW_LEAD: <Users className="h-5 w-5" />,
      POST: <FileText className="h-5 w-5" />,
      SETTING: <Settings className="h-5 w-5" />,
   }

   const colors: any = {
      NEW_LEAD: "bg-blue-50 text-blue-600",
      POST: "bg-emerald-50 text-emerald-600",
      SETTING: "bg-amber-50 text-amber-600",
   }

   return (
      <div className="p-8 flex gap-6 hover:bg-gray-50/50 transition-all duration-300 group cursor-default">
         <div className={`h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${colors[type] || 'bg-gray-50 text-gray-400'}`}>
            {icons[type] || <Calendar className="h-5 w-5" />}
         </div>
         <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
               <p className="text-lg font-black font-outfit text-gray-900 leading-tight">{title}</p>
               <span className="text-[10px] font-bold text-gray-300 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {time}
               </span>
            </div>
            <p className="text-sm text-gray-500 font-medium">{desc}</p>
         </div>
      </div>
   )
}
