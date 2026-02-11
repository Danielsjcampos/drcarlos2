import React from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { BlogListingContent } from '@/components/sections/BlogListingContent'

export default function BlogListingPage() {
  const posts = [
    { 
      id: '1', 
      title: '5 Dicas para Aliviar Dor Lombar em SJC', 
      excerpt: 'Muitos pacientes sofrem com dor lombar crônica. Neste artigo, o Dr. Carlos compartilha dicas práticas para o dia a dia.',
      date: '10 Fev, 2026',
      author: 'Dr. Carlos Prado',
      slug: 'dicas-dor-lombar-sjc'
    },
    { 
      id: '2', 
      title: 'Como a Fisioterapia Esportiva Acelera o Recovery', 
      excerpt: 'Se você é atleta amador ou profissional, entenda como o recovery especializado pode mudar sua performance.',
      date: '08 Fev, 2026',
      author: 'Dr. Carlos Prado',
      slug: 'recovery-esportivo-fisioterapia'
    },
    { 
      id: '3', 
      title: 'A Importância da Avaliação Funcional antes de Começar a Correr', 
      excerpt: 'Evite lesões comuns de corrida com uma avaliação biomecânica completa.',
      date: '05 Fev, 2026',
      author: 'Dr. Carlos Prado',
      slug: 'avaliacao-funcional-corrida'
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <BlogListingContent posts={posts} />

      <Footer />
    </div>
  )
}
