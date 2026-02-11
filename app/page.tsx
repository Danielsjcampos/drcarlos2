import React from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { TreatmentsSection } from '@/components/sections/TreatmentsSection'
import { ContactForm } from '@/components/sections/ContactForm'
import { Star, Zap, Target, Award, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WhatsAppCTAButton } from '@/components/ui/whatsapp-cta-button'

export default function HomePage() {
  const benefits = [
    { icon: <Zap className="h-6 w-6" />, title: 'Alívio Rápido', text: 'Protocolos focados no alívio rápido e sustentado da dor.' },
    { icon: <Target className="h-6 w-6" />, title: 'Retorno Seguro', text: 'Recuperação funcional para voltar ao esporte com performance.' },
    { icon: <Award className="h-6 w-6" />, title: 'Especialista NBB', text: 'Experiência de 6 temporadas no basquete profissional (NBB).' },
    { icon: <ShieldCheck className="h-6 w-6" />, title: 'Tratamento Manual', text: 'Técnicas manuais avançadas e tecnologias complementares.' },
  ]

  const testimonials = [
    { name: 'Ricardo Silva', role: 'Atleta Amador', text: 'Graças ao Dr. Carlos consegui voltar a correr sem dores no joelho. O atendimento é excepcional!', rating: 5 },
    { name: 'Amanda Costa', role: 'Paciente Pós-Op', text: 'A melhor fisioterapia de SJC. Responsável por toda minha reabilitação pós-cirúrgica.', rating: 5 },
    { name: 'Lucas Mendes', role: 'Jogador de Basquete', text: 'Profissional com visão de alto rendimento. Entende as necessidades reais de um atleta.', rating: 5 },
    { name: 'Fernanda Lima', role: 'Paciente Dor Crônica', text: 'Tentei vários lugares, mas só aqui tive um diagnóstico preciso e solução para minha coluna.', rating: 5 },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <HeroSection />

      {/* Authority Block (Short) */}
      <section className="py-16 bg-[#fafafa] border-y border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold font-outfit mb-2">Quem atendemos:</h3>
              <p className="text-gray-600">Atletas profissionais e amadores, pacientes com dor crônica e pós-operatório.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="text-center px-4">
                <p className="text-3xl font-bold text-[#0a4d2c] font-outfit">8+</p>
                <p className="text-xs text-gray-500 uppercase font-bold mt-1">Anos Exp.</p>
              </div>
              <div className="text-center px-4">
                <p className="text-3xl font-bold text-[#0a4d2c] font-outfit">6</p>
                <p className="text-xs text-gray-500 uppercase font-bold mt-1">NBB Seasons</p>
              </div>
              <div className="text-center px-4">
                <p className="text-3xl font-bold text-[#0a4d2c] font-outfit">20+</p>
                <p className="text-xs text-gray-500 uppercase font-bold mt-1">Especialidades</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TreatmentsSection />

      {/* Proposta de Valor */}
      <section className="py-24 bg-[#0a4d2c] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold font-outfit mb-8 leading-tight">Por que escolher a Sport Health?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {benefits.map((b, i) => (
                  <div key={i} className="space-y-3">
                    <div className="text-white bg-white/10 w-fit p-3 rounded-xl">
                      {b.icon}
                    </div>
                    <h4 className="text-xl font-bold font-outfit">{b.title}</h4>
                    <p className="text-white/70 text-sm leading-relaxed">{b.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-10">
              <div className="flex items-center gap-2 mb-8">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="ml-2 font-bold font-outfit">5,0 ★</span>
                <span className="text-white/60 text-sm">(21 avaliações no Google)</span>
              </div>
              <div className="space-y-8">
                {testimonials.slice(0, 2).map((t, i) => (
                  <div key={i} className="relative pl-8 border-l border-[#22c55e]">
                    <p className="text-lg italic text-white/90 mb-4 font-inter">"{t.text}"</p>
                    <div>
                      <p className="font-bold text-white font-outfit">{t.name}</p>
                      <p className="text-xs text-white/50 uppercase tracking-widest">{t.role}</p>
                    </div>
                  </div>
                ))}
              </div>
              <WhatsAppCTAButton />
            </div>
          </div>
        </div>
      </section>

      {/* Serviços (Resumo) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-outfit mb-4">Nossa Expertise</h2>
            <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              {['Terapia manual', 'Quiropraxia', 'Acupuntura', 'Bandagem elástica', 'Ventosa', 'Reabilitação esportiva', 'Pós-operatório'].map(s => (
                <span key={s} className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 capitalize">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContactForm />

      {/* FAQ */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-outfit mb-12 text-center underline decoration-[#0a4d2c] decoration-4 underline-offset-8">Dúvidas Frequentes</h2>
            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-xl font-bold font-outfit">Quanto tempo dura a avaliação?</h4>
                <p className="text-gray-600 leading-relaxed">A primeira avaliação dura em média 60 minutos, onde realizamos testes funcionais, clínicos e montamos seu plano de tratamento personalizado.</p>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-bold font-outfit">Atende convênios?</h4>
                <p className="text-gray-600 leading-relaxed">Realizamos atendimento particular com emissão de nota fiscal para reembolso. Muitos pacientes conseguem 100% do valor de volta pelo convênio.</p>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-bold font-outfit">Em quanto tempo verei melhora?</h4>
                <p className="text-gray-600 leading-relaxed">Muitos pacientes relatam alívio logo na primeira sessão. No entanto, o tempo total de recuperação depende da gravidade e do seu comprometimento com os exercícios sugeridos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
