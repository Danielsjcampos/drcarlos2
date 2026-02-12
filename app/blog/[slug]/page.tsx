'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Headphones, Share2, ArrowLeft, Clock, Calendar, User, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { BookingCalendarModal } from '@/components/ui/booking-calendar'
import Link from 'next/link'
import Image from 'next/image'

export default function BlogPostReader() {
  const { slug } = useParams()
  const [post, setPost] = useState<any>(null)
  const [isReading, setIsReading] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  useEffect(() => {
    fetch(`/api/blog/public?slug=${slug}`)
      .then(r => r.json())
      .then(data => setPost(data))
  }, [slug])

  const toggleReadMode = () => {
    if ('speechSynthesis' in window) {
      if (isReading) {
        window.speechSynthesis.cancel()
        setIsReading(false)
      } else {
        const utterance = new SpeechSynthesisUtterance(post.content.replace(/<[^>]*>/g, ''))
        utterance.lang = 'pt-BR'
        utterance.onend = () => setIsReading(false)
        window.speechSynthesis.speak(utterance)
        setIsReading(true)
      }
    } else {
      alert('Seu navegador não suporta leitura de voz.')
    }
  }

  if (!post) return <div className="p-20 text-center font-outfit">Carregando conteúdo premium...</div>

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden bg-slate-900">
        {post.imageUrl ? (
          <Image 
            src={post.imageUrl} 
            fill
            className="object-cover opacity-60" 
            alt={post.title}
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-slate-900 opacity-80" />
        )}
        
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20 bg-gradient-to-t from-white via-transparent text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto w-full"
          >
            <div className="flex gap-4 mb-6">
              {post.keywords?.map((kw: string) => (
                <span key={kw} className="px-3 py-1 bg-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest">{kw}</span>
              ))}
            </div>
            <h1 className="text-4xl md:text-7xl font-black font-outfit leading-none mb-8 drop-shadow-2xl">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-8 text-sm font-bold border-t border-white/20 pt-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-400" />
                {new Date(post.createdAt).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-400" />
                5 min de leitura
              </div>
              <Button 
                onClick={toggleReadMode}
                className={`rounded-full gap-2 px-6 h-12 font-black ${isReading ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
              >
                <Headphones className="h-5 w-5" />
                {isReading ? 'Parar Leitura' : 'Ouvir Artigo'}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Layout Content + Sidebar */}
      <div className="container mx-auto px-4 md:px-6 py-20 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div 
              className="prose prose-emerald prose-xl font-medium text-slate-700 leading-relaxed
                         prose-headings:font-black prose-headings:font-outfit prose-headings:tracking-tight
                         prose-p:mb-8 prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center text-slate-400">
              <Link href="/blog" className="flex items-center gap-2 hover:text-emerald-600 transition-colors font-bold uppercase text-[10px] tracking-widest">
                <ArrowLeft className="h-4 w-4" /> Voltar ao Blog
              </Link>
              <div className="flex gap-4">
                <button className="p-3 bg-slate-50 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-10">
            {/* Dr. Profile Card */}
            <div className="bg-emerald-900 rounded-[32px] p-8 text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10 group-hover:bg-white/20 transition-all duration-700" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black font-outfit leading-none">Dr. Carlos Prado</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mt-2">Fisioterapeuta Especialista</p>
                  </div>
                </div>
                
                <p className="text-emerald-50/70 text-sm leading-relaxed mb-8">
                  Especialista em reabilitação esportiva e performance, com foco em atletas de alto rendimento. Atendimento personalizado em SJC.
                </p>

                <div className="space-y-4">
                  <Button 
                    onClick={() => setCalendarOpen(true)}
                    className="w-full bg-white text-emerald-900 hover:bg-emerald-50 rounded-2xl h-14 font-black text-sm gap-3 shadow-lg"
                  >
                    <Calendar className="h-5 w-5" />
                    Agendar Consulta
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-white/20 text-white hover:bg-white/10 rounded-2xl h-14 font-black text-sm gap-3 transition-all"
                    onClick={() => window.open(`https://wa.me/5512997150819?text=Olá Dr. Carlos, vi seu artigo sobre ${post.title} e gostaria de tirar uma dúvida.`, '_blank')}
                  >
                    <MessageSquare className="h-5 w-5 text-emerald-400" />
                    WhatsApp Direto
                  </Button>
                </div>
              </div>
            </div>

            {/* Health Tips Card */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Clock className="h-5 w-5" />
                </div>
                <h4 className="text-lg font-black font-outfit text-slate-800">Dicas Rápidas</h4>
              </div>
              
              <ul className="space-y-4">
                {[
                  'Mantenha a hidratação constante durante o dia.',
                  'Não ignore pequenas dores persistentes.',
                  'O sono é sua principal ferramenta de recuperação.',
                  'Mantenha uma rotina de mobilidade ativa.'
                ].map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm font-medium text-slate-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter/Contact Simple */}
            <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col items-center text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Contato Oficial</span>
              <p className="text-xl font-black font-outfit text-slate-900 mb-1">(12) 99123-4567</p>
              <p className="text-xs text-slate-500 font-medium">São José dos Campos - SP</p>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
      <BookingCalendarModal isOpen={calendarOpen} onClose={() => setCalendarOpen(false)} />
    </div>
  )
}
