import React from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h1 className="text-4xl font-bold font-outfit mb-8">Termos de Uso</h1>
          <div className="prose prose-green max-w-none text-gray-600 space-y-6">
            <p>Ao acessar ao site Sport Health, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.</p>
            <h2 className="text-2xl font-bold text-[#1a1a1a]">1. Uso de Licença</h2>
            <p>É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Sport Health, apenas para visualização transitória pessoal e não comercial.</p>
            <h2 className="text-2xl font-bold text-[#1a1a1a]">2. Isenção de Responsabilidade</h2>
            <p>Os materiais no site da Sport Health são fornecidos 'como estão'. Sport Health não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
