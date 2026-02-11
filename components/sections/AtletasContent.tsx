'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Zap, Target, Users, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AtletasContent() {
  const packages = [
    { 
      title: 'Recovery Pro', 
      price: 'Consulte', 
      desc: 'Focado na recuperação muscular pós-treino ou competição.',
      features: ['Ventosaterapia', 'Liberação Micofascial', 'Botas de Compressão', 'Recovery Ativo']
    },
    { 
      title: 'Performance & Prevenção', 
      price: 'Consulte', 
      desc: 'Acompanhamento contínuo para quem quer evitar lesões.',
      features: ['Análise Biomecânica', 'Treino de Controle Motor', 'Suporte Prioritário', 'Monitoramento de Carga']
    },
    { 
      title: 'Gestão de Lesões', 
      price: 'Consulte', 
      desc: 'Reabilitação acelerada para retorno imediato ao esporte.',
      features: ['Fisio 1-on-1', 'Protocolos NBB', 'Retorno Assistido', 'Relatório p/ Técnico']
    }
  ]

  return (
    <>
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 bg-[#0a4d2c] text-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl"
          >
            <span className="text-[#22c55e] font-bold uppercase tracking-widest text-sm mb-4 block">Fisioterapia de Elite</span>
            <h1 className="text-5xl md:text-7xl font-bold font-outfit mb-8 leading-tight">Serviços para Atletas e Equipes.</h1>
            <p className="text-xl text-white/70 leading-relaxed mb-10 max-w-2xl">
              Trazemos a experiência do basquete profissional (NBB) para o seu treino. Atendimento personalizado para amadores e profissionais que buscam longevidade e performance.
            </p>
            <div className="flex gap-4">
              <Button className="bg-[#22c55e] hover:bg-[#1db954] text-[#0a4d2c] font-bold py-8 px-10 rounded-full text-lg">
                Falar sobre meu Caso
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Seção de Planos removida conforme solicitação */}


      <section className="py-24 bg-[#fafafa]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-5xl font-bold font-outfit mb-8 leading-tight">Atendimento para Equipes e Assessorias.</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Oferecemos pacotes customizados para grupos de corrida, assessorias esportivas e times que buscam um suporte especializado de fisioterapia preventiva e recovery.
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3 items-center font-bold">
                  <Shield className="h-5 w-5 text-[#0a4d2c]" /> Palestras Preventivas
                </li>
                <li className="flex gap-3 items-center font-bold">
                  <Zap className="h-5 w-5 text-[#0a4d2c]" /> Recovery Móvel para Eventos
                </li>
                <li className="flex gap-3 items-center font-bold">
                  <Users className="h-5 w-5 text-[#0a4d2c]" /> Descontos para Membros
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 aspect-video bg-gray-200 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center text-gray-400">
               <span className="font-bold">Foto de atendimento em equipe / evento esportivo</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
