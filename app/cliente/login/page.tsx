'use client'

import React, { useState, useEffect, Suspense, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { KeyRound, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

function LoginForm() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleLogin = useCallback(async (providedCode?: string) => {
    const finalCode = providedCode || code
    if (!finalCode) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/cliente/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: finalCode })
      })

      if (!res.ok) throw new Error('Código inválido')

      const data = await res.json()
      // Salva no localStorage para persistência simples
      localStorage.setItem('clientAccessCode', finalCode)
      router.push('/cliente/dashboard')
    } catch (err) {
      setError('Código não encontrado. Verifique e tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [code, router])

  useEffect(() => {
    const urlCode = searchParams.get('code')
    if (urlCode) {
      setCode(urlCode)
      handleLogin(urlCode)
    }
  }, [searchParams, handleLogin])

  return (
    <div className="pt-32 pb-20 md:pt-48 md:pb-32 container mx-auto px-4 flex items-center justify-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
      >
        <div className="w-16 h-16 bg-[#0a4d2c]/10 rounded-2xl flex items-center justify-center mb-6 mx-auto text-[#0a4d2c]">
          <KeyRound className="h-8 w-8" />
        </div>
        
        <h1 className="text-2xl font-bold font-outfit text-center mb-2">Área do Cliente</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">Digite seu código de acesso para gerenciar agendamentos.</p>

        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Seu Código</label>
            <input 
              type="text" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Cole seu código aqui"
              className="w-full text-center text-lg font-mono tracking-widest p-4 border-2 border-gray-200 rounded-xl focus:border-[#0a4d2c] focus:ring-0 outline-none placeholder:text-gray-300 transition-all uppercase"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold text-center bg-red-50 p-3 rounded-lg">{error}</p>
          )}

          <Button 
            type="submit" 
            disabled={loading || code.length < 3}
            className="w-full bg-[#0a4d2c] hover:bg-[#083d23] text-white py-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Acessar <ArrowRight className="ml-2 h-5 w-5" /></>}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}

export default function ClientLoginPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#0a4d2c]" /></div>}>
        <LoginForm />
      </Suspense>
      <Footer />
    </div>
  )
}
