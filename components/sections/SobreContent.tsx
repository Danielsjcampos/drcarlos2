'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Award, GraduationCap, Briefcase, Activity, Target, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SobreContent() {
  const expertises = ['Terapia Manual', 'Quiropraxia', 'Acupuntura', 'Ventosa', 'Bandagem Elástica', 'Dry Needling']

  return (
    <>
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 bg-[#fafafa]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[#0a4d2c] font-bold uppercase tracking-widest text-sm mb-4 block">Autoridade & Experiência</span>
              <h1 className="text-4xl md:text-6xl font-bold font-outfit mb-8 text-[#1a1a1a]">
                Dr. Carlos Prado: <br /><span className="text-[#0a4d2c]">Performance e Cuidado Humano.</span>
              </h1>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Dr. Carlos é fisioterapeuta com pós-graduação em fisioterapia esportiva e traumato-ortopédica. Há 8 anos atua com reabilitação de alto rendimento e tratamento de pacientes com dor crônica.
                </p>
                <p className="font-bold text-[#1a1a1a]">
                  Atuou como fisioterapeuta do São José Basquetebol por 6 temporadas consecutivas na NBB, a maior liga de basquete do Brasil.
                </p>
                <p>
                  Sua filosofia de trabalho une o que há de mais moderno na ciência da reabilitação com um cuidado humano e personalizado, focando em devolver ao paciente não apenas a ausência de dor, mas a máxima performance em suas atividades.
                </p>
              </div>
              <div className="mt-10">
                <Button className="bg-[#0a4d2c] hover:bg-[#083d23] text-white rounded-full py-8 px-10 text-lg font-bold shadow-xl shadow-[#0a4d2c]/20">
                  Agende uma consulta com o Dr. Carlos
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden shadow-2xl relative z-10">
                <img 
                  src="/dr-carlos.png" 
                  alt="Dr. Carlos Prado - Fisioterapeuta Esportivo" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -z-10 -bottom-10 -right-10 w-full h-full bg-[#0a4d2c]/5 rounded-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="bg-[#0a4d2c]/5 p-4 rounded-2xl w-fit mb-6">
                <GraduationCap className="h-8 w-8 text-[#0a4d2c]" />
              </div>
              <h3 className="text-xl font-bold font-outfit mb-4">Formação Acadêmica</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#22c55e] shrink-0" />
                  <span>Pós-graduação em Fisioterapia Esportiva</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#22c55e] shrink-0" />
                  <span>Pós-graduação em Traumato-Ortopedia</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#22c55e] shrink-0" />
                  <span>Formação Internacional em Quiropraxia</span>
                </li>
              </ul>
            </div>
            <div>
              <div className="bg-[#0a4d2c]/5 p-4 rounded-2xl w-fit mb-6">
                <Briefcase className="h-8 w-8 text-[#0a4d2c]" />
              </div>
              <h3 className="text-xl font-bold font-outfit mb-4">Trajetória Profissional</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#22c55e] shrink-0" />
                  <span>6 Temporadas no NBB (Basquete Profissional)</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#22c55e] shrink-0" />
                  <span>Atendimento em competições internacionais</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#22c55e] shrink-0" />
                  <span>+8 anos de clínica especializada</span>
                </li>
              </ul>
            </div>
            <div>
              <div className="bg-[#0a4d2c]/5 p-4 rounded-2xl w-fit mb-6">
                <Target className="h-8 w-8 text-[#0a4d2c]" />
              </div>
              <h3 className="text-xl font-bold font-outfit mb-4">Metodologia</h3>
              <p className="text-gray-600 mb-6">Uso de evidência científica aliada a tecnologias de ponta para diagnosticar e tratar a causa raiz da dor.</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {expertises.map(e => (
                  <span key={e} className="px-3 py-1 bg-white border border-gray-100 rounded-lg font-bold">{e}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
