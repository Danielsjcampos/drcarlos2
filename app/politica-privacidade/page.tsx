import React from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h1 className="text-4xl font-bold font-outfit mb-8">Política de Privacidade</h1>
          <div className="prose prose-green max-w-none text-gray-600 space-y-6">
            <p>A sua privacidade é importante para nós. É política do Sport Health respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Sport Health, e outros sites que possuímos e operamos.</p>
            <h2 className="text-2xl font-bold text-[#1a1a1a]">1. Coleta de Informações</h2>
            <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.</p>
            <h2 className="text-2xl font-bold text-[#1a1a1a]">2. Uso de Dados</h2>
            <p>Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.</p>
            <h2 className="text-2xl font-bold text-[#1a1a1a]">3. LGPD</h2>
            <p>Em conformidade com a Lei Geral de Proteção de Dados (LGPD), garantimos aos nossos usuários o direito de acesso, retificação, exclusão e portabilidade de seus dados pessoais a qualquer momento.</p>
            <p>Esta política é efetiva a partir de Fevereiro/2026.</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
