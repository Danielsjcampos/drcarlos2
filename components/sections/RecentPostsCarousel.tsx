'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, User, ArrowLeftRight } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function RecentPostsCarousel() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blog/public')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPosts(data.slice(0, 3))
        }
      })
      .catch(err => console.error('Error fetching recent posts:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null
  if (posts.length === 0) return null

  return (
    <section className="py-24 bg-[#fafafa]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold font-outfit text-gray-900 mb-4 tracking-tight">Conteúdo & Saúde</h2>
            <p className="text-gray-600 text-lg">As últimas atualizações do Dr. Carlos sobre performance, prevenção e bem-estar.</p>
          </div>
          <Link href="/blog">
            <Button variant="ghost" className="font-bold text-[#0a4d2c] group gap-2 h-14 px-8 rounded-2xl hover:bg-emerald-50">
              Ver Blog Completo
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full overflow-hidden border-none shadow-xl shadow-slate-200/50 bg-white rounded-[32px] group hover:-translate-y-2 transition-all duration-500">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="aspect-[16/10] overflow-hidden relative">
                    {post.imageUrl ? (
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                        <ArrowLeftRight className="h-12 w-12 text-emerald-200" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#0a4d2c] mb-4">
                      <span className="flex items-center gap-1.5 overflow-hidden">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                    
                    <h4 className="text-xl font-black font-outfit text-slate-900 mb-4 line-clamp-2 group-hover:text-[#0a4d2c] transition-colors leading-tight">
                      {post.title}
                    </h4>
                    
                    <p className="text-slate-500 text-sm font-medium mb-8 line-clamp-3 leading-relaxed">
                      {post.metaDescription || post.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...'}
                    </p>
                    
                    <div className="mt-auto">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-sm font-black text-[#0a4d2c] hover:underline underline-offset-4 group/link"
                      >
                        Ler artigo completo
                        <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover/link:translate-x-1.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
