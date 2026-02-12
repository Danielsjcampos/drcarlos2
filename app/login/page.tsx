'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Lock, Mail, Terminal } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Normal login logic would go here
    console.log('Login attempt:', email)
  }

  const handleDevAccess = () => {
    // Development bypass
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0a2a1a] via-[#0a0a0a] to-[#0a0a0a] p-4 text-white">
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-[#22c55e]" />
            <span className="text-2xl font-bold tracking-tight">SPORT <span className="text-[#22c55e]">HEALTH</span></span>
          </div>
        </div>

        <Card className="bg-black/40 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#22c55e] to-transparent"></div>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-white">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-gray-400">
              Acesse sua conta para gerenciar leads e agendamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="nome@exemplo.com" 
                    className="bg-white/5 border-white/10 text-white pl-10 focus:border-[#22c55e] focus:ring-[#22c55e]/20"
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-300">Senha</Label>
                  <a href="#" className="text-xs text-[#22c55e] hover:underline">Esqueceu a senha?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    id="password" 
                    type="password" 
                    className="bg-white/5 border-white/10 text-white pl-10 focus:border-[#22c55e] focus:ring-[#22c55e]/20"
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold uppercase tracking-wider py-6">
                Entrar
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0a0a0a] px-2 text-gray-500">Desenvolvimento</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-colors gap-2"
              onClick={handleDevAccess}
            >
              <Terminal className="h-4 w-4" />
              Acesso Rápido (Dev Mode)
            </Button>
            
            <p className="text-center text-sm text-gray-500">
              Não tem uma conta? <span className="text-white font-medium cursor-pointer hover:underline">Fale com o admin</span>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
