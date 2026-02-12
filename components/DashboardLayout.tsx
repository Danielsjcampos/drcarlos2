'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
  PlusCircle,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  
  const menuItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview', href: '/dashboard' },
    { icon: <Users className="h-5 w-5" />, label: 'Pacientes', href: '/dashboard/pacientes' },
    { icon: <Calendar className="h-5 w-5" />, label: 'Agenda', href: '/dashboard/agenda' },
    { icon: <Users className="h-5 w-5" />, label: 'Leads', href: '/dashboard/leads' },
    { icon: <LineChart className="h-5 w-5" />, label: 'Financeiro', href: '/dashboard/financeiro' },
    { icon: <FileText className="h-5 w-5" />, label: 'Blog IA', href: '/dashboard/blog' },
    { icon: <Settings className="h-5 w-5" />, label: 'Configurações', href: '/dashboard/configuracoes' },
  ]

  const bottomNavItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Início', href: '/dashboard' },
    { icon: <Users className="h-5 w-5" />, label: 'Pacientes', href: '/dashboard/pacientes' },
    { icon: <Calendar className="h-5 w-5" />, label: 'Agenda', href: '/dashboard/agenda' },
    { icon: <Menu className="h-5 w-5" />, label: 'Menu', onClick: () => setMobileMenuOpen(true) },
  ]

  const handleLogout = () => {
    router.push('/')
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-inter text-slate-900">
      {/* Sidebar - Desktop only */}
      <aside className="hidden lg:flex w-72 bg-[#0a4d2c] text-white flex-col shrink-0 relative overflow-hidden shadow-2xl z-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 opacity-40">
           <motion.div 
             animate={{ 
               scale: [1, 1.2, 1],
               rotate: [0, 90, 0],
               opacity: [0.3, 0.5, 0.3]
             }}
             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
             className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-emerald-400 rounded-full blur-[80px]"
           />
           <motion.div 
             animate={{ 
               scale: [1.2, 1, 1.2],
               rotate: [0, -90, 0],
               opacity: [0.2, 0.4, 0.2]
             }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-green-600 rounded-full blur-[100px]"
           />
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col h-full relative z-10 backdrop-blur-sm bg-[#0a4d2c]/80 border-r border-white/5">
          <div className="p-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-xl border border-white/20 ring-1 ring-white/10 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <Activity className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black font-outfit tracking-tighter italic leading-none">SPORT <span className="text-emerald-400">HEALTH</span></span>
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-50 mt-1">Management v2</span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
            <p className="px-4 text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-5">Principal</p>
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link 
                  key={item.label} 
                  href={item.href}
                  className={cn(
                    "relative flex items-center justify-between px-4 py-4 text-sm font-bold rounded-2xl transition-all duration-300 group overflow-hidden",
                    isActive 
                      ? "bg-white text-[#0a4d2c] shadow-xl shadow-black/20" 
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute inset-0 bg-white"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <div className="relative z-10 flex items-center gap-3">
                    <span className={cn(
                      "transition-all duration-300",
                      isActive ? "text-[#0a4d2c] scale-110" : "group-hover:text-emerald-400 group-hover:scale-110"
                    )}>{item.icon}</span>
                    <span className="tracking-tight">{item.label}</span>
                  </div>
                  
                  {isActive ? (
                    <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  ) : (
                    <div className="w-1 h-1 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="p-6 mt-auto">
            <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl h-14 shadow-lg shadow-emerald-500/20 group border-none transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
              <PlusCircle className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-500 text-white" />
              Novo Registro
            </Button>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-4 w-full text-sm font-bold rounded-2xl hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 group active:scale-95"
              >
                <div className="bg-red-500/10 p-2 rounded-lg group-hover:bg-red-500/20 transition-colors">
                  <LogOut className="h-4 w-4" />
                </div>
                Encerrar Sessão
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay/Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-16 w-[80%] max-w-sm bg-[#0a4d2c] text-white z-50 lg:hidden shadow-2xl flex flex-col rounded-l-[2rem] overflow-hidden"
            >
              <div className="p-8 border-b border-white/10 bg-black/10">
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-3">
                      <Activity className="h-6 w-6 text-emerald-400" />
                      <span className="font-outfit font-black text-lg">SPORT HEALTH</span>
                   </div>
                   <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-white/10 rounded-xl">
                      <X className="h-6 w-6 text-white" />
                   </button>
                </div>
                <div className="flex items-center gap-4">
                   <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0a4d2c] to-emerald-500 text-white flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-white/10">CP</div>
                   <div>
                      <p className="font-black text-lg">Dr. Carlos Prado</p>
                      <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">Administrador</p>
                   </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link 
                      key={item.label} 
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-4 px-6 py-5 rounded-2xl text-base font-bold transition-all",
                        isActive ? "bg-white text-[#0a4d2c]" : "text-white/70 hover:bg-white/10"
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  )
                })}
              </div>

              <div className="p-6 bg-black/10 border-t border-white/10">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-4 px-6 py-5 w-full text-base font-bold rounded-2xl bg-red-500/10 text-red-300"
                >
                  <LogOut className="h-5 w-5" />
                  Sair do Sistema
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#f1f5f9] relative pb-16 lg:pb-0">
        {/* Modern Header - Responsive */}
        <header className="h-20 lg:h-24 bg-white/70 backdrop-blur-xl border-b border-white/40 flex items-center justify-between px-4 lg:px-10 shrink-0 z-10">
          <div className="flex items-center gap-3 lg:gap-4 flex-1">
            {/* Mobile Logo Visibility */}
            <div className="lg:hidden flex items-center gap-2 mr-2">
               <Activity className="h-8 w-8 text-[#0a4d2c]" />
            </div>

            <div className="flex items-center gap-2 lg:gap-4 bg-gray-100/50 border border-gray-200/50 px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl lg:rounded-2xl w-full max-w-[200px] lg:max-w-md shadow-inner transition-all focus-within:max-w-full">
              <Search className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="bg-transparent border-none outline-none text-xs lg:text-sm w-full font-semibold placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-8">
            <button className="relative p-2.5 lg:p-3 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all shadow-sm">
              <Bell className="h-5 w-5 lg:h-6 lg:w-6" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="hidden sm:flex items-center gap-4 pl-4 lg:pl-8 border-l border-gray-200 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className="text-xs lg:text-sm font-black text-gray-900 leading-tight">Dr. Carlos Prado</p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <p className="text-[8px] lg:text-[9px] text-gray-500 font-black uppercase tracking-widest">Online</p>
                </div>
              </div>
              <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl lg:rounded-2xl bg-gradient-to-br from-[#0a4d2c] to-emerald-500 text-white flex items-center justify-center font-black text-base lg:text-lg shadow-lg">
                CP
              </div>
              <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400 mt-1" />
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar relative">
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 flex items-center justify-around px-2 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
           {bottomNavItems.map((item, idx) => {
              const isActive = pathname === item.href
              const isMenu = item.label === 'Menu'
              return (
                 <button
                   key={idx}
                   onClick={isMenu ? item.onClick : () => router.push(item.href!)}
                   className={cn(
                      "flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300",
                      isActive ? "text-[#0a4d2c]" : "text-gray-400"
                   )}
                 >
                    <div className={cn(
                       "p-1.5 rounded-lg transition-all",
                       isActive ? "bg-emerald-50" : ""
                    )}>
                       {item.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
                 </button>
              )
           })}
        </nav>
      </main>
    </div>
  )
}

