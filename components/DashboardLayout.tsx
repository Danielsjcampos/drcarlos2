'use client'

import React from 'react'
import Link from 'next/link'
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
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const menuItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview', href: '/dashboard' },
    { icon: <Users className="h-5 w-5" />, label: 'Leads (Kanban)', href: '/dashboard/leads' },
    { icon: <Calendar className="h-5 w-5" />, label: 'Agenda', href: '/dashboard/agenda' },
    { icon: <LineChart className="h-5 w-5" />, label: 'Financeiro', href: '/dashboard/financeiro' },
    { icon: <FileText className="h-5 w-5" />, label: 'Blog IA', href: '/dashboard/blog' },
    { icon: <Settings className="h-5 w-5" />, label: 'Configurações', href: '/dashboard/configuracoes' },
  ]

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a4d2c] text-white flex flex-col shrink-0">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Activity className="h-7 w-7 text-[#22c55e]" />
            <span className="text-xl font-bold font-outfit tracking-tight">SPORT <span className="text-[#22c55e]">HEALTH</span></span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {menuItems.map((item) => (
            <Link 
              key={item.label} 
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-white/10 transition-colors group"
            >
              <span className="text-white/60 group-hover:text-[#22c55e] transition-colors">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors">
            <LogOut className="h-5 w-5" />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-full w-96">
            <Search className="h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Pesquisar leads, pacientes..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-[#0a4d2c]">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-tight">Dr. Carlos Prado</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#0a4d2c] text-white flex items-center justify-center font-bold">
                CP
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
