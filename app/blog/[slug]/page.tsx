'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Link2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const blogPosts = [
  { 
    id: '1', 
    title: '5 Dicas para Aliviar Dor Lombar em SJC', 
    content: `
      <p>A dor lombar é uma das queixas mais comuns em meu consultório em São José dos Campos. Seja por má postura no trabalho (home office), sedentarismo ou excesso de carga nos treinos, a região lombar acaba sofrendo.</p>
      
      <h2>1. Movimente-se estrategicamente</h2>
      <p>O repouso absoluto raramente é a solução para dores na coluna. Movimentos leves aumentam o fluxo sanguíneo e ajudam na lubrificação das articulações.</p>
      
      <h2>2. Atenção à postura ao sentar</h2>
      <p>Ajuste sua cadeira de modo que seus pés fiquem apoiados no chão e a coluna tenha suporte na curva lombar.</p>
      
      <h2>3. Fortalecimento do Core</h2>
      <p>Um "centro" estável protege sua coluna. Exercícios específicos de pilates e fisioterapia funcional são essenciais.</p>
      
      <h2>4. Hidrate os discos intervertebrais</h2>
      <p>Beber água é fundamental para a saúde dos tecidos conectivos da sua coluna.</p>
      
      <h2>5. Busque ajuda de um especialista</h2>
      <p>Se a dor persistir por mais de 3 dias, a avaliação funcional é primordial para evitar que o problema se torne crônico.</p>
    `,
    date: '10 Fev, 2026',
    author: 'Dr. Carlos Prado',
    slug: 'dicas-dor-lombar-sjc',
    category: 'Dores na Coluna'
  },
  { 
    id: '2', 
    title: 'Como a Fisioterapia Esportiva Acelera o Recovery', 
    content: `
      <p>O conceito de recovery evoluiu muito nos últimos anos, saindo das quadras profissionais diretamente para os atletas amadores de alta performance.</p>
      
      <h2>O que é Recovery Esportivo?</h2>
      <p>É o processo de restauração física e metabólica após um esforço intenso. Não é apenas descansar, é agir para que seu corpo se recupere mais rápido.</p>
      
      <h2>Nossas Técnicas de Elite</h2>
      <ul>
        <li><strong>Ventosaterapia:</strong> Aumenta a oxigenação dos tecidos.</li>
        <li><strong>Liberação Miofascial:</strong> Reduz pontos de gatilho e tensão muscular.</li>
        <li><strong>Botas de Compressão:</strong> Melhora o retorno venoso e reduz o edema pós-treino.</li>
      </ul>
      
      <p>Na Sport Health, utilizamos os mesmos protocolos que apliquei durante 6 temporadas no NBB (Basquete Profissional).</p>
    `,
    date: '08 Fev, 2026',
    author: 'Dr. Carlos Prado',
    slug: 'recovery-esportivo-fisioterapia',
    category: 'Recovery'
  },
  { 
    id: '3', 
    title: 'A Importância da Avaliação Funcional antes de Começar a Correr', 
    content: `
      <p>Correr parece o esporte mais natural do mundo, mas começar sem uma base funcional pode levar a lesões chatas como fascite plantar e síndrome do trato iliotibial.</p>
      
      <h2>O que analisamos?</h2>
      <p>Analisamos sua mobilidade de tornozelo, estabilidade de joelho e controle motor da pelve. Se algum desses elos estiver fraco, o impacto da corrida será absorvido de forma errada pelas articulações.</p>
      
      <p>Uma avaliação biomecânica completa em SJC pode poupar meses de fisioterapia corretiva no futuro.</p>
    `,
    date: '05 Fev, 2026',
    author: 'Dr. Carlos Prado',
    slug: 'avaliacao-funcional-corrida',
    category: 'Dicas para Atletas'
  },
]

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="py-48 text-center">
           <h1 className="text-4xl font-bold font-outfit">Post não encontrado</h1>
           <Link href="/blog" className="text-[#0a4d2c] font-bold mt-4 inline-block">Voltar para o Blog</Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <article className="pt-32 pb-24 md:pt-48">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <Link href="/blog" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-[#0a4d2c] transition-colors mb-8 group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Voltar para o blog
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-4 text-xs font-bold text-[#0a4d2c] uppercase tracking-widest mb-6">
                 <span className="bg-[#0a4d2c]/5 px-3 py-1 rounded-full">{post.category}</span>
                 <span className="flex items-center gap-1.5 text-gray-400"><Calendar className="h-3.5 w-3.5" />{post.date}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-outfit mb-8 leading-tight text-[#1a1a1a]">
                {post.title}
              </h1>
              
              <div className="flex items-center justify-between py-8 border-y border-gray-100 mb-12">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#0a4d2c] text-white flex items-center justify-center font-bold">
                    CP
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{post.author}</p>
                    <p className="text-xs text-gray-500 uppercase font-medium">Especialista em Fisioterapia</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                    <Link2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div 
                className="prose prose-lg max-w-none prose-headings:font-outfit prose-headings:font-bold prose-headings:text-[#1a1a1a] prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-[#0a4d2c] prose-strong:text-[#1a1a1a]"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="mt-20 p-10 bg-[#fafafa] rounded-[2.5rem] border border-gray-100 text-center">
                <h3 className="text-2xl font-bold font-outfit mb-4">Gostou do conteúdo?</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">Agende uma consulta com o Dr. Carlos e tire suas dúvidas pessoalmente em São José dos Campos.</p>
                <Link href="/contato">
                  <Button className="bg-[#0a4d2c] hover:bg-[#083d23] px-10 py-6 font-bold rounded-2xl h-auto">
                    Agendar pelo WhatsApp
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}
