'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, FileText, Calendar as CalendarIcon, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Target, Activity, Settings, Zap, Compass, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

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
      {/* Welcome Section with Hero Vibes */}
      <div className="relative mb-14">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
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
            Sua clínica está operando com <span className="text-emerald-600 font-black uppercase text-sm tracking-widest">84% de eficiência</span> hoje.
          </p>
        </motion.div>
        
        {/* Floating 3D-like Orb Background Decor */}
        <div className="absolute top-[-20px] right-20 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-700" />
      </div>

      {/* Stats Grid - High Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
        <StatCard 
          title="Leads Totais" 
          value={stats.totalLeads.toString()} 
          change="+18% este mês" 
          icon={<Users className="h-6 w-6" />} 
          variant="primary"
          delay={0.1}
        />
        <StatCard 
          title="Posts Gerados" 
          value={stats.totalPosts.toString()} 
          change="IA Ativa" 
          icon={<Zap className="h-6 w-6" />} 
          variant="accent"
          delay={0.2}
        />
        <StatCard 
          title="Taxa de Conversão" 
          value="24.8%" 
          change="+2.4% vs média" 
          icon={<Target className="h-6 w-6" />} 
          variant="white"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Live Activity Board */}
         <Card className="lg:col-span-12 xl:col-span-7 rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden bg-white/70 backdrop-blur-xl border border-white/40">
            <CardHeader className="p-6 md:p-10 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="h-4 w-4 text-emerald-500" />
                    <CardTitle className="text-xl md:text-2xl font-black font-outfit tracking-tight">Atividade Recente</CardTitle>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">O que aconteceu nas últimas 24h</p>
               </div>
               <Badge className="px-4 py-1.5 md:px-5 md:py-2 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live Now
               </Badge>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-slate-50">
                  <ActivityItem 
                    title="Novo Lead Capturado" 
                    desc="João Silva se interessou por 'Quiropraxia Avançada'" 
                    time="há 5m" 
                    type="NEW_LEAD"
                  />
                  <ActivityItem 
                    title="Newsletter de IA" 
                    desc="Processo finalizado: 12 artigos criados via GPT-4" 
                    time="há 2h" 
                    type="POST"
                  />
                  <ActivityItem 
                    title="Relatório Financeiro" 
                    desc="Download do PDF mensal realizado com sucesso" 
                    time="há 4h" 
                    type="SETTING"
                  />
                  <ActivityItem 
                    title="Status de Pipeline" 
                    desc="Maria Santos movida para 'Agendamento Confirmado'" 
                    time="há 1d" 
                    type="NEW_LEAD"
                  />
               </div>
               <div className="p-8 bg-slate-50/50 flex justify-center border-t border-slate-50">
                  <button className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-2 group">
                    Ver todo histórico de logs
                    <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
               </div>
            </CardContent>
         </Card>

         {/* Growth & Insights Panel */}
         <div className="lg:col-span-12 xl:col-span-5 space-y-10">
            {/* SEO Mastery Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="rounded-[32px] md:rounded-[40px] bg-[#0a4d2c] text-white p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-emerald-950/20 group"
            >
               {/* Background Mesh/Aura */}
               <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                  <Compass className="h-48 w-48 md:h-64 md:w-64" />
               </div>
               
               <div className="relative z-10 flex flex-col h-full min-h-[300px] md:min-h-[350px]">
                  <div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20 font-black text-[10px] uppercase space-x-2 px-3 py-1.5 rounded-xl mb-6 md:mb-8">
                       <Star className="w-3 h-3 fill-emerald-400" />
                       <span>#1 SJC - Fisioterapia</span>
                    </Badge>
                    <h3 className="text-3xl md:text-4xl font-black font-outfit leading-[1.1] mb-6 tracking-tight">SEO Domina<br />a Região.</h3>
                    <p className="text-emerald-100/60 text-base md:text-lg font-medium leading-relaxed max-w-xs">
                       Sua clínica continua sendo a principal referência em fisioterapia esportiva local.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:gap-5 mt-auto pt-8 md:pt-10">
                     <div className="bg-white/5 backdrop-blur-xl rounded-[20px] md:rounded-[24px] p-4 md:p-6 border border-white/5 transition-all hover:bg-white/10 group/item">
                        <p className="text-[10px] uppercase font-black text-white/30 mb-2 tracking-[0.2em]">Visitas/mês</p>
                        <div className="flex items-end gap-2">
                           <p className="text-2xl md:text-3xl font-black font-outfit tracking-tighter">1,420</p>
                           <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5 text-emerald-400 mb-1 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                        </div>
                     </div>
                     <div className="bg-white/5 backdrop-blur-xl rounded-[20px] md:rounded-[24px] p-4 md:p-6 border border-white/5 transition-all hover:bg-white/10 group/item">
                        <p className="text-[10px] uppercase font-black text-white/30 mb-2 tracking-[0.2em]">CTR Médio</p>
                        <div className="flex items-end gap-2">
                           <p className="text-2xl md:text-3xl font-black font-outfit tracking-tighter">8.4%</p>
                           <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5 text-emerald-400 mb-1 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>

            {/* Growth Suggestion Card */}
            <Card className="rounded-[32px] md:rounded-[40px] border-none p-8 md:p-12 shadow-xl bg-emerald-50/80 border border-emerald-100 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/40 rounded-full blur-[60px] translate-x-10 -translate-y-10" />
               
               <h4 className="font-black font-outfit text-slate-800 text-lg md:text-xl mb-6 flex items-center gap-3 relative z-10">
                 <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20">
                   <TrendingUp className="h-5 w-5 text-white" />
                 </div>
                 Growth Engine IA
               </h4>
               <p className="text-base md:text-lg text-slate-600 leading-relaxed font-bold italic relative z-10">
                 "A busca por <span className="text-emerald-600 underline decoration-emerald-500/30 underline-offset-4">Mobilidade Articular</span> cresceu 42% em SJC. Gerar artigo sobre 'Prevenção de Lesões em Atletas'?"
               </p>
               <div className="mt-8 relative z-10">
                  <Button className="w-full bg-white hover:bg-slate-50 text-emerald-700 font-black rounded-xl md:rounded-2xl h-14 shadow-md border-none transition-all hover:-translate-y-1 text-sm">
                    Executar Automação de Conteúdo
                  </Button>
               </div>
            </Card>
         </div>
      </div>
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
      <Card className={`rounded-[32px] md:rounded-[40px] border-none shadow-2xl p-8 md:p-10 flex flex-col justify-between min-h-[220px] md:min-h-[260px] relative overflow-hidden ${styles[variant]}`}>
        {/* Card Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
        
        <div className="flex justify-between items-start relative z-10">
          <div className={cn(
            "p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-lg transition-transform hover:rotate-12 duration-500",
            variant === 'primary' ? 'bg-white/10 text-emerald-400' : 'bg-slate-100 text-emerald-600'
          )}>
            {icon}
          </div>
          <Badge className={cn(
            "px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider border-none shadow-none",
            variant === 'primary' ? 'bg-white/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
          )}>
            {change}
          </Badge>
        </div>
        
        <div className="relative z-10">
          <h3 className="text-4xl md:text-6xl font-black font-outfit mb-2 md:mb-3 tracking-tighter leading-none">{value}</h3>
          <p className={cn(
            "text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em]",
            variant === 'primary' ? 'text-white/40' : 'text-slate-400'
          )}>{title}</p>
        </div>
      </Card>
    </motion.div>
  )
}

function ActivityItem({ title, desc, time, type }: any) {
   const icons: any = {
      NEW_LEAD: <Users className="h-5 w-5" />,
      POST: <Zap className="h-5 w-5" />,
      SETTING: <FileText className="h-5 w-5" />,
   }

   const colors: any = {
      NEW_LEAD: "bg-blue-50/50 text-blue-600 border border-blue-100/50",
      POST: "bg-amber-50/50 text-amber-600 border border-amber-100/50",
      SETTING: "bg-emerald-50/50 text-emerald-600 border border-emerald-100/50",
   }

   return (
      <motion.div 
        whileHover={{ x: 10 }}
        className="p-6 md:p-8 flex gap-5 md:gap-8 hover:bg-slate-50/50 transition-all duration-300 group cursor-default"
      >
         <div className={cn(
            "h-12 w-12 md:h-16 md:w-16 shrink-0 rounded-[16px] md:rounded-[20px] flex items-center justify-center shadow-lg shadow-black/5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
            colors[type] || 'bg-slate-50 text-slate-400'
         )}>
            {icons[type] || <CalendarIcon className="h-5 w-5" />}
         </div>
         <div className="flex-1 flex flex-col justify-center">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1.5 gap-1">
               <p className="text-base md:text-xl font-black font-outfit text-slate-800 tracking-tight leading-none group-hover:text-emerald-700 transition-colors uppercase text-xs md:text-sm">{title}</p>
               <span className="text-[9px] md:text-[10px] font-black text-slate-300 flex items-center gap-1.5 uppercase tracking-widest leading-none">
                  <Clock className="h-2.5 w-2.5 md:h-3 md:w-3" />
                  {time}
               </span>
            </div>
            <p className="text-xs md:text-sm text-slate-500 font-bold leading-relaxed">{desc}</p>
         </div>
      </motion.div>
   )
}

