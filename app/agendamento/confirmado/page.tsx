'use client'

import React, { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, Copy, ArrowRight, CalendarCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const ORB_H = 40
const ORB_V = 20

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code') || '------'
  const [copied, setCopied] = React.useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full relative flex min-h-[90vh] items-center justify-center overflow-hidden">
      {/* Animated background orbs */}
      <div aria-hidden={true} className="-z-10 absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,77,44,0.06),transparent_70%)]" />
        <motion.div
          animate={{
            x: [0, ORB_H, -ORB_H, 0],
            y: [0, ORB_V, -ORB_V, 0],
            rotate: [0, 10, -10, 0],
          }}
          className="absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-gradient-to-tr from-[#0a4d2c]/20 to-[#16a34a]/20 blur-3xl"
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        />
        <motion.div
          animate={{
            x: [0, -ORB_H, ORB_H, 0],
            y: [0, -ORB_V, ORB_V, 0],
          }}
          className="absolute right-1/4 bottom-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-[#22c55e]/10 to-[#16a34a]/10 blur-3xl"
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        />
        <motion.div
          animate={{
            x: [0, ORB_H / 2, -ORB_H / 2, 0],
            y: [0, -ORB_V * 2, ORB_V, 0],
          }}
          className="absolute top-1/4 right-1/3 h-48 w-48 rounded-full bg-gradient-to-tl from-[#0a4d2c]/10 to-emerald-400/10 blur-3xl"
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center gap-8 px-4 text-center max-w-lg z-10">
        {/* Animated check icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
          className="w-28 h-28 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center shadow-2xl shadow-[#22c55e]/30"
        >
          <CheckCircle2 className="h-14 w-14 text-white" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#22c55e]/10 text-[#0a4d2c] text-xs font-bold uppercase tracking-widest mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            Confirmado com Sucesso
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold font-outfit text-[#1a1a1a] leading-tight">
            Obrigado!
          </h1>
          <p className="text-lg text-gray-500 max-w-md mx-auto">
            Seu agendamento foi reservado. Guarde o código abaixo para acessar sua área de cliente.
          </p>
        </motion.div>

        {/* Access Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-xl border-2 border-[#22c55e]/20 rounded-3xl p-8 w-full shadow-xl shadow-[#0a4d2c]/5"
        >
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
            Seu Código de Acesso
          </p>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-2xl md:text-3xl font-mono font-bold text-[#0a4d2c] tracking-wider select-all break-all">
              {code}
            </span>
            <button 
              onClick={copyToClipboard}
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                copied 
                  ? 'bg-[#22c55e] text-white scale-110' 
                  : 'bg-[#0a4d2c]/5 text-[#0a4d2c] hover:bg-[#0a4d2c]/10'
              }`}
              aria-label="Copiar código"
            >
              {copied ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
          <p className="text-xs text-gray-400">
            {copied ? '✓ Código copiado!' : 'Use este código para acessar seus agendamentos.'}
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 w-full"
        >
          <Link href={`/cliente/login?code=${code}`} className="flex-1">
            <Button className="w-full bg-[#0a4d2c] hover:bg-[#083d23] text-white rounded-2xl px-8 h-14 text-base font-bold shadow-xl shadow-[#0a4d2c]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              <CalendarCheck className="mr-2 h-5 w-5" />
              Ver Meus Agendamentos
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full rounded-2xl px-8 h-14 text-base font-bold border-gray-200 hover:bg-gray-50 transition-all">
              Voltar ao Início
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default function ConfirmedPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20">
        <Suspense fallback={
          <div className="min-h-[80vh] flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Carregando...</div>
          </div>
        }>
          <ConfirmationContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}
