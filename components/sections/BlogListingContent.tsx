'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight, Activity, Search } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Post {
    id: string
    title: string
    excerpt: string
    date: string
    author: string
    slug: string
}

interface BlogListingContentProps {
    posts: Post[]
}

export function BlogListingContent({ posts }: BlogListingContentProps) {
  return (
    <>
      <section className="pt-32 pb-20 md:pt-48 md:pb-24 bg-[#fafafa]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold font-outfit mb-6 text-[#1a1a1a]">Blog Sport Health</h1>
            <p className="text-xl text-gray-600">Conteúdo especializado sobre fisioterapia, saúde e performance esportiva.</p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1 space-y-12">
              {posts.map((post) => (
                <motion.article 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden border-gray-100 hover:shadow-xl transition-all group border-none bg-transparent">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3 aspect-square md:aspect-auto bg-gray-100 rounded-3xl overflow-hidden relative group">
                          <div className="absolute inset-0 bg-[#0a4d2c]/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                             <Activity className="h-12 w-12 opacity-20" />
                          </div>
                        </div>
                        <div className="md:w-2/3 py-2">
                          <div className="flex items-center gap-4 text-xs font-bold text-[#0a4d2c] uppercase tracking-widest mb-4">
                            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{post.date}</span>
                            <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{post.author}</span>
                          </div>
                          <Link href={`/blog/${post.slug}`}>
                            <h2 className="text-2xl md:text-3xl font-bold font-outfit mb-4 hover:text-[#0a4d2c] transition-colors">{post.title}</h2>
                          </Link>
                          <p className="text-gray-600 mb-6 leading-relaxed">
                            {post.excerpt}
                          </p>
                          <Link href={`/blog/${post.slug}`} className="inline-flex items-center font-bold text-[#0a4d2c] group">
                            Continuar lendo
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.article>
              ))}
            </div>

            <aside className="lg:w-80 space-y-12 shrink-0">
              <div>
                <h4 className="text-lg font-bold font-outfit mb-6">Pesquisar</h4>
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <Search className="h-4 w-4 text-gray-400" />
                  <input type="text" placeholder="Buscar no blog..." className="bg-transparent border-none outline-none text-sm w-full" />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold font-outfit mb-6">Categorias</h4>
                <ul className="space-y-3 font-medium text-sm text-gray-600">
                  <li className="hover:text-[#0a4d2c] transition-colors cursor-pointer flex justify-between"><span>Fisioterapia Esportiva</span> <span className="text-gray-400 font-bold">12</span></li>
                  <li className="hover:text-[#0a4d2c] transition-colors cursor-pointer flex justify-between"><span>Dores na Coluna</span> <span className="text-gray-400 font-bold">8</span></li>
                  <li className="hover:text-[#0a4d2c] transition-colors cursor-pointer flex justify-between"><span>Recovery</span> <span className="text-gray-400 font-bold">15</span></li>
                  <li className="hover:text-[#0a4d2c] transition-colors cursor-pointer flex justify-between"><span>Dicas para Atletas</span> <span className="text-gray-400 font-bold">21</span></li>
                </ul>
              </div>

              <div className="bg-[#0a4d2c] p-8 rounded-3xl text-white">
                <h4 className="text-xl font-bold font-outfit mb-4">Newsletter</h4>
                <p className="text-white/60 text-sm mb-6">Receba dicas de performance e saúde direto no seu e-mail.</p>
                <input type="email" placeholder="Seu melhor e-mail" className="w-full bg-white/10 border-none rounded-xl p-4 text-sm mb-4 outline-none placeholder:text-white/30" />
                <Button className="w-full bg-[#22c55e] hover:bg-[#1db954] text-[#0a4d2c] font-bold py-6">Inscrever</Button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
