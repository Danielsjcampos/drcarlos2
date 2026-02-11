'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Plus, Search, FileText, Wand2, Eye, Edit3, Trash2, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = () => {
    fetch('/api/blog').then(r => r.json()).then(data => {
      setPosts(data)
      setLoading(false)
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este post?')) return
    await fetch(`/api/blog?id=${id}`, { method: 'DELETE' })
    fetchPosts()
  }

  const generateAIPost = async () => {
     const topic = prompt('Sobre qual assunto você deseja gerar o post? (Ex: Tratamento para Dor no Joelho em SJC)')
     if (!topic) return

     setLoading(true)
     try {
       const res = await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            generateWithAI: true,
            topic: topic
          })
       })
       if (!res.ok) {
         const error = await res.json()
         alert('Erro: ' + (error.error || 'Falha na geração'))
       } else {
         fetchPosts()
       }
     } catch (err) {
       alert('Erro ao conectar com a API')
     } finally {
       setLoading(false)
     }
  }

  if (loading) return <DashboardLayout><div className="p-10 text-center">Processando...</div></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-gray-900">Gerenciador de Blog (IA)</h1>
          <p className="text-gray-500">Produção automática de conteúdo SEO baseado em keywords locais.</p>
        </div>
        <Button 
          onClick={generateAIPost}
          className="bg-[#0a4d2c] hover:bg-[#083d23] gap-2 rounded-xl px-6"
        >
          <Wand2 className="h-5 w-5" />
          Gerar Novo Post por IA
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
        <Card className="p-6 bg-[#0a4d2c] text-white">
          <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Total de Posts</p>
          <h3 className="text-4xl font-bold">{posts.length}</h3>
        </Card>
        <Card className="p-6 bg-[#22c55e] text-[#0a4d2c]">
          <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Publicados</p>
          <h3 className="text-4xl font-bold">{posts.filter(p => p.status === 'PUBLISHED').length}</h3>
        </Card>
        <Card className="p-6 border-gray-100 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Rascunhos</p>
          <h3 className="text-4xl font-bold text-gray-900">{posts.filter(p => p.status === 'DRAFT').length}</h3>
        </Card>
        <Card className="p-6 border-gray-100 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">SEO Score</p>
          <h3 className="text-4xl font-bold text-[#0a4d2c]">98%</h3>
        </Card>
      </div>

      <Card className="border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-white p-4 border-b border-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg w-72">
            <Search className="h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Filtrar posts..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
        </div>
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Título do Post</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Criado em</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-lg bg-[#0a4d2c]/5 text-[#0a4d2c] flex items-center justify-center">
                          <FileText className="h-5 w-5" />
                       </div>
                       <span className="font-bold text-gray-900 group-hover:text-[#0a4d2c] transition-colors">{post.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={post.status === 'PUBLISHED' ? 'default' : 'secondary'} className={post.status === 'PUBLISHED' ? 'bg-[#22c55e]/10 text-[#22c55e] border-none' : ''}>
                      {post.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Edit3 className="h-4 w-4" /></Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(post.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-gray-400 italic">Nenhum post encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
