'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Plus, Search, FileText, Wand2, Eye, Edit3, Trash2, Globe, Sparkles, Tag, Layers, ChevronRight, Loader2, MessageSquare, Play, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [keywords, setKeywords] = useState<any[]>([])
  const [newKeyword, setNewKeyword] = useState('')
  const [loading, setLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.url) {
        setEditingPost({ ...editingPost, imageUrl: data.url })
      }
    } catch (err) {
      alert('Erro no upload da imagem')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSuggestKeywords = async () => {
    setIsSuggesting(true)
    try {
      const res = await fetch('/api/blog/keywords/suggest', { method: 'POST' })
      const data = await res.json()
      if (data.suggestions) {
        for (const term of data.suggestions) {
          await fetch('/api/blog/keywords', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ term })
          })
        }
        fetchData()
        alert('Novas keywords sugeridas com sucesso!')
      }
    } catch (err) {
      alert('Erro ao sugerir keywords')
    } finally {
      setIsSuggesting(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [postsRes, keywordsRes] = await Promise.all([
        fetch('/api/blog'),
        fetch('/api/blog/keywords')
      ])
      const postsData = await postsRes.json()
      const keywordsData = await keywordsRes.json()
      setPosts(Array.isArray(postsData) ? postsData : [])
      setKeywords(Array.isArray(keywordsData) ? keywordsData : [])
    } catch (err) {
      console.error('Fetch error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (id: string) => {
    if (!confirm('Deseja excluir este post?')) return
    await fetch(`/api/blog?id=${id}`, { method: 'DELETE' })
    fetchData()
  }

  const handleAddKeyword = async () => {
    if (!newKeyword.trim()) return
    const res = await fetch('/api/blog/keywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ term: newKeyword })
    })
    if (res.ok) {
      setNewKeyword('')
      fetchData()
    }
  }

  const handleDeleteKeyword = async (id: string) => {
    await fetch(`/api/blog/keywords?id=${id}`, { method: 'DELETE' })
    fetchData()
  }

  const handleAutoGenerate = async () => {
    if (keywords.length === 0) return alert('Adicione keywords primeiro!')
    setIsGenerating(true)
    try {
      const res = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          keywords: keywords.map(k => k.term),
          tone: 'profissional',
          word_count: 1200
        })
      })
      if (res.ok) {
        fetchData()
        alert('Blog posts gerados com sucesso!')
      }
    } catch (err) {
      alert('Erro na geração automática')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleToggleStatus = async (post: any) => {
    const newStatus = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    const res = await fetch('/api/blog', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: post.id, status: newStatus })
    })
    if (res.ok) {
      if (editingPost?.id === post.id) {
        setEditingPost({ ...editingPost, status: newStatus })
      }
      fetchData()
    }
  }

  const handleUpdatePost = async () => {
    if (!editingPost) return
    const res = await fetch('/api/blog', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingPost.id,
        title: editingPost.title,
        content: editingPost.content,
        imageUrl: editingPost.imageUrl
      })
    })
    if (res.ok) {
      setShowEditModal(false)
      fetchData()
    }
  }

  if (loading) return (
    <DashboardLayout>
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      {/* Featured Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-12 gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-1"
          >
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Blog Automation Engine</span>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-black font-outfit text-slate-900 tracking-tight">Conteúdo Inteligente</h1>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Gestão de keywords locais e produção automática via GPT-4.</p>
        </div>
        
        <Button 
          onClick={handleAutoGenerate}
          disabled={isGenerating || keywords.length === 0}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-3 rounded-2xl h-12 md:h-14 px-8 font-black shadow-xl shadow-emerald-900/10 transition-all w-full md:w-auto active:scale-95"
        >
          {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
          {isGenerating ? 'Processando Algorithm...' : 'Gerar Posts via Keywords'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Keywords Management */}
        <Card className="lg:col-span-4 rounded-[32px] md:rounded-[40px] border-none shadow-2xl shadow-slate-200/50 bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                  <Tag className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl font-black font-outfit">Keyword Bank</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSuggestKeywords}
                disabled={isSuggesting}
                className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 h-8"
              >
                {isSuggesting ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Wand2 className="h-3 w-3 mr-1" />}
                Sugerir via IA
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="flex gap-2">
              <Input 
                placeholder="Ex: Fisioterapia Esportiva SJC" 
                value={newKeyword}
                onChange={p => setNewKeyword(p.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddKeyword()}
                className="rounded-xl h-12 border-slate-200 font-medium"
              />
              <Button onClick={handleAddKeyword} className="h-12 w-12 rounded-xl bg-slate-900">
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {keywords.map((kw) => (
                  <motion.div
                    key={kw.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-200 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-sm font-bold text-slate-700">{kw.term}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteKeyword(kw.id)}
                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {keywords.length === 0 && (
                <div className="text-center py-10 opacity-40">
                  <Layers className="h-10 w-10 mx-auto mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Nenhuma Keyword Ativa</p>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-emerald-50 rounded-[24px] border border-emerald-100">
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Sparkles className="h-3 w-3" />
                Dica Estratégica
              </p>
              <p className="text-xs text-emerald-800/70 font-medium leading-relaxed">
                Adicione keywords com o sufixo "SJC" para dominar as buscas locais por geolocalização.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Posts Table */}
        <Card className="lg:col-span-8 rounded-[32px] md:rounded-[40px] border-none shadow-2xl shadow-slate-200/50 bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                <FileText className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-black font-outfit">Artigos Publicados</CardTitle>
            </div>
            
            <Badge className="bg-emerald-50 text-emerald-600 border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase">
              Atualizado Agora
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-50">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Título do Conteúdo</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data</th>
                    <th className="px-8 py-5 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                              <FileText className="h-6 w-6" />
                           </div>
                           <div className="flex flex-col">
                              <span className="font-black text-slate-800 group-hover:text-emerald-700 transition-colors tracking-tight line-clamp-1">{post.title}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{post.slug}</span>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge 
                          className={cn(
                            "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border-none",
                            post.status === 'PUBLISHED' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                          )}
                        >
                          {post.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-700 tracking-tight">{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                          <span className="text-[9px] text-slate-300 font-bold uppercase mt-0.5">Automated</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                            className="h-10 w-10 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              setEditingPost(post)
                              setShowEditModal(true)
                            }}
                            className="h-10 w-10 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeletePost(post.id)}
                            className="h-10 w-10 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-32 text-center">
                        <div className="max-w-xs mx-auto">
                          <Layers className="h-16 w-16 text-slate-100 mx-auto mb-4" />
                          <p className="text-xl font-black font-outfit text-slate-300 tracking-tight leading-none mb-2">Zero Conteúdo Detectado</p>
                          <p className="text-xs text-slate-400 font-medium">Selecione suas keywords ao lado e inicie o motor de IA para povoar seu blog.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Post Modal */}
      <AnimatePresence>
        {showEditModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
              onClick={() => setShowEditModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
            >
              <Card className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl pointer-events-auto overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-50 bg-[#0a4d2c] text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Edit3 className="h-6 w-6" />
                      <CardTitle className="text-2xl font-black font-outfit">Editar Artigo IA</CardTitle>
                    </div>
                    <button onClick={() => setShowEditModal(false)} className="p-2 rounded-full bg-white/10 hover:bg-white/20">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {/* Image Section */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Imagem de Capa</label>
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="w-full md:w-64 aspect-video rounded-2xl bg-slate-100 overflow-hidden relative group shrink-0 border-2 border-slate-50">
                        {editingPost?.imageUrl ? (
                          <img src={editingPost.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon className="h-8 w-8" />
                          </div>
                        )}
                        {isUploading && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                            <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-4 w-full">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => fileInputRef.current?.click()}
                            className="rounded-xl border-slate-200 font-bold text-slate-600 h-11"
                          >
                            Upload de Arquivo
                          </Button>
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ou URL Direta</label>
                          <Input 
                            value={editingPost?.imageUrl || ''} 
                            onChange={e => setEditingPost({ ...editingPost, imageUrl: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="rounded-xl h-11 bg-slate-50 border-none font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Título do Post</label>
                    <Input 
                      value={editingPost?.title} 
                      onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
                      className="rounded-xl h-14 font-bold text-slate-700 bg-slate-50 border-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Conteúdo (HTML)</label>
                    <textarea 
                      className="w-full h-80 rounded-2xl bg-slate-50 border-none p-6 font-medium text-slate-600 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none"
                      value={editingPost?.content}
                      onChange={e => setEditingPost({ ...editingPost, content: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      onClick={handleUpdatePost}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 font-black shadow-xl"
                    >
                      Salvar Alterações
                    </Button>
                    <Button 
                      onClick={() => handleToggleStatus(editingPost)}
                      className={cn(
                        "flex-1 rounded-2xl h-14 font-black border-2",
                        editingPost?.status === 'PUBLISHED' ? "border-amber-200 text-amber-600 bg-amber-50 hover:bg-amber-100" : "border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                      )}
                    >
                      {editingPost?.status === 'PUBLISHED' ? 'Reverter para Rascunho' : 'Publicar Agora'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
