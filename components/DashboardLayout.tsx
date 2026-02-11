'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  Activity,
  ChevronDown,
  LineChart,
  FileText,
  PlusCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const menuItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview', href: '/dashboard' },
    { icon: <Users className="h-5 w-5" />, label: 'Leads', href: '/dashboard/leads' },
    { icon: <Calendar className="h-5 w-5" />, label: 'Agenda', href: '/dashboard/agenda' },
    { icon: <LineChart className="h-5 w-5" />, label: 'Financeiro', href: '/dashboard/financeiro' },
    { icon: <FileText className="h-5 w-5" />, label: 'Blog IA', href: '/dashboard/blog' },
    { icon: <Settings className="h-5 w-5" />, label: 'Configurações', href: '/dashboard/configuracoes' },
  ]

  return (
    <div className="flex h-screen bg-mesh overflow-hidden font-inter">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0a4d2c] text-white flex flex-col shrink-0 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#16a34a] rounded-full blur-[100px] -ml-32 -mb-32"></div>
        </div>

        <div className="p-8 relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10 ring-1 ring-white/20">
              <Activity className="h-6 w-6 text-[#22c55e]" />
            </div>
            <span className="text-xl font-black font-outfit tracking-tighter italic">SPORT <span className="text-[#22c55e]">HEALTH</span></span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-8 relative z-10 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4">Main Menu</p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link 
                key={item.label} 
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-4 py-4 text-sm font-bold rounded-2xl transition-all duration-300 group",
                  isActive 
                    ? "bg-white text-[#0a4d2c] shadow-xl shadow-black/10" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "transition-colors",
                    isActive ? "text-[#0a4d2c]" : "group-hover:text-[#22c55e]"
                  )}>{item.icon}</span>
                  {item.label}
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#0a4d2c]"></div>}
              </Link>
            )
          })}
        </nav>

        <div className="p-6 relative z-10">
          <Button className="w-full bg-[#16a34a] hover:bg-[#1db954] text-white font-bold rounded-2xl h-14 shadow-lg shadow-black/20 group">
            <PlusCircle className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
            Novo Registro
          </Button>
          <div className="mt-6 pt-6 border-t border-white/10">
            <button className="flex items-center gap-3 px-4 py-4 w-full text-sm font-bold rounded-2xl hover:bg-red-500/10 hover:text-red-400 transition-all">
              <LogOut className="h-5 w-5" />
              Encerrar Sessão
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-24 bg-white/50 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-4 bg-white/80 border border-gray-100 px-6 py-3 rounded-2xl w-full max-w-md shadow-sm focus-within:ring-2 focus-within:ring-[#0a4d2c]/10 transition-all">
            <Search className="h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Pesquisar no sistema..." 
              className="bg-transparent border-none outline-none text-sm w-full font-medium"
            />
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <button className="relative p-3 text-gray-400 hover:text-[#0a4d2c] hover:bg-gray-100 rounded-xl transition-all">
                <Bell className="h-6 w-6" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
            
            <div className="flex items-center gap-4 pl-8 border-l border-gray-100 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-gray-900 leading-tight">Dr. Carlos Prado</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Administrator</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#0a4d2c] to-[#16a34a] text-white flex items-center justify-center font-black text-lg shadow-xl shadow-[#0a4d2c]/20 ring-2 ring-white">
                CP
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  )
}
