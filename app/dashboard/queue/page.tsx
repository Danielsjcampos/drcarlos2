'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Loader2, Sparkles, Layers, ListTodo, Send, Tags, BookA, Edit3, X, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function ContentQueuePage() {
  const [queue, setQueue] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newKeyword, setNewKeyword] = useState('')
  const [newType, setNewType] = useState('BLOG')
  
  // States for Mass Suggestion
  const [macroTopic, setMacroTopic] = useState('')
  const [macroPrefix, setMacroPrefix] = useState('')
  const [macroLetter, setMacroLetter] = useState('A-Z')
  const [macroCount, setMacroCount] = useState(50)
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isProcessingAll, setIsProcessingAll] = useState(false)
  
  // States for Edit Modal
  const [editingDoc, setEditingDoc] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editType, setEditType] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const generateSlug = (text: string) => {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
  }

  useEffect(() => {
    fetchQueue()
  }, [])

  const fetchQueue = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/queue')
      const data = await res.json()
      setQueue(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Fetch error')
    } finally {
      setLoading(false)
    }
  }

  const handleAddKeyword = async () => {
    if (!newKeyword.trim()) return
    const res = await fetch('/api/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword: newKeyword, type: newType })
    })
    if (res.ok) {
      setNewKeyword('')
      fetchQueue()
    }
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/queue?id=${id}`, { method: 'DELETE' })
    fetchQueue()
  }

  // To simulate triggering the worker for a specific item
  const handleProcessItem = async (id: string) => {
    try {
      // In a real scenario, the queue system (Upstash/Inngest) does this automatically
      // We are just calling our worker endpoint directly for manual triggers
      const res = await fetch('/api/content-queue/worker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queueId: id })
      })
      if (res.ok) {
        alert('Processo iniciado/concluído com sucesso na fila!')
        fetchQueue()
      } else {
        alert('Falha ao processar termo.')
      }
    } catch (err) {
      console.error('Error processing:', err)
    }
  }

  const handleProcessAll = async () => {
    const pendings = queue.filter(item => item.status === 'PENDING')
    if (pendings.length === 0) {
      alert('Não há itens Pendentes na fila para processar.')
      return
    }
    
    if (!confirm(`Deseja iniciar a criação de ${pendings.length} itens agora? Isso pode consumir bastante tempo e recursos da API.`)) {
      return
    }

    setIsProcessingAll(true)
    let processed = 0
    
    for (const item of pendings) {
      try {
        await fetch('/api/content-queue/worker', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ queueId: item.id })
        })
        processed++
      } catch (err) {
        console.error('Falha no upload em lote:', item.keyword, err)
      }
    }
    
    alert(`Criação em massa finalizada! Processamos ${processed} de ${pendings.length} itens.`)
    setIsProcessingAll(false)
    fetchQueue()
  }

  const handleSuggestMass = async () => {
    if (!macroTopic.trim()) return
    setIsSuggesting(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/queue/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: macroTopic, count: macroCount, letter: macroLetter })
      })
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Erro na requisição da API.')
      }

      if (data.suggestions) {
        let finalSuggestions = data.suggestions
        if (macroPrefix.trim()) {
           finalSuggestions = finalSuggestions.map((s: any) => ({
             ...s,
             keyword: `${macroPrefix.trim()} ${s.keyword}`.trim()
           }))
        }

        setSuggestions(finalSuggestions)
        setShowSuggestions(true)
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Falha ao buscar sugestões. O modelo pode estar sobrecarregado.')
    } finally {
      setIsSuggesting(false)
    }
  }

  const handleAddAllSuggestions = async () => {
    setIsSuggesting(true)
    try {
      // Add sequentially to prevent blowing up the DB connections
      for (const item of suggestions) {
        await fetch('/api/queue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword: item.keyword, type: item.type })
        })
      }
      setShowSuggestions(false)
      setSuggestions([])
      setMacroTopic('')
      fetchQueue()
      alert('Termos adicionados à fila de produção com sucesso!')
    } catch (err) {
      alert('Erro ao adicionar em lote.')
    } finally {
      setIsSuggesting(false)
    }
  }

  const handleEditClick = async (keyword: string, type: string) => {
    try {
      const res = await fetch(`/api/content-queue/item?keyword=${encodeURIComponent(keyword)}&type=${type}`)
      if (res.ok) {
        const data = await res.json()
        if (data && data.id) {
          setEditingDoc(data)
          setEditType(type)
          setShowEditModal(true)
        } else {
          alert('Documento não encontrado. Talvez não tenha sido gerado com sucesso.')
        }
      }
    } catch (err) {
      console.error(err)
      alert('Erro ao buscar documento para edição.')
    }
  }

  const handleUpdateDoc = async (newStatus?: string) => {
    if (!editingDoc) return
    setIsSaving(true)
    
    const targetStatus = newStatus || editingDoc.status
    const bodyArgs = editType === 'BLOG' 
      ? { id: editingDoc.id, type: 'BLOG', title: editingDoc.title, content: editingDoc.content, status: targetStatus }
      : { id: editingDoc.id, type: 'GLOSSARY', term: editingDoc.term, definition: editingDoc.definition, status: targetStatus }

    try {
      const res = await fetch('/api/content-queue/item', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyArgs)
      })
      if (res.ok) {
        setShowEditModal(false)
        fetchQueue()
      } else {
        alert('Falha ao salvar')
      }
    } catch (err) {
      alert('Erro ao atualizar.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteDoc = async (queueId: string, keyword: string, type: string) => {
    if (!confirm('Tem certeza? Isso apagará tanto a fila quanto o rascunho. (Não se apaga o artigo da Fila Ativa se o mesmo já estiver em uso em outras telas).')) return
    
    try {
      // 1. Apaga do Blog/Glossario
      await fetch(`/api/content-queue/item?id=${queueId}&type=${type}`, { method: 'DELETE' })
      // 2. Apaga da Fila
      await fetch(`/api/queue?id=${queueId}`, { method: 'DELETE' })
      fetchQueue()
    } catch (err) {
      alert('Erro ao deletar documento.')
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black font-outfit text-slate-900 tracking-tight flex items-center gap-3">
            <ListTodo className="h-8 w-8 text-emerald-600" />
            Produção de Conteúdo (Fila)
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-2">
            Adicione palavras-chave para que o gerador de IA escreva posts ou crie definições de glossário automaticamente.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <Card className="md:col-span-1 border-none shadow-xl shadow-slate-200/50 rounded-3xl h-fit">
          <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
            <CardTitle className="text-lg font-black font-outfit">Novo Tópico</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                Palavra/Foco
              </label>
              <Input 
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Ex: Condromalácia Patelar"
                className="h-12 bg-slate-50 rounded-xl border-slate-200"
              />
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                Destino (Tipo)
              </label>
              <select 
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                <option value="BLOG">Artigo de Blog</option>
                <option value="GLOSSARY">Termo de Glossário</option>
              </select>
            </div>

            <Button 
              onClick={handleAddKeyword}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 rounded-xl font-bold shadow-lg shadow-emerald-900/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar à Fila
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border-none shadow-xl shadow-slate-200/50 rounded-3xl h-fit">
          <CardHeader className="bg-emerald-50 border-b border-emerald-100 p-6 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg">
                 <Sparkles className="h-5 w-5" />
               </div>
               <div>
                 <CardTitle className="text-lg font-black font-outfit text-emerald-900">Gerador A-Z de Glossário (IA)</CardTitle>
                 <p className="text-xs font-bold text-emerald-700/70 mt-0.5">Mapeia o assunto e gera os termos organizados de A a Z</p>
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
             {!showSuggestions ? (
               <div className="flex flex-col gap-4">
                 <div className="flex gap-4">
                   <div className="flex-1">
                     <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-2 block">
                       O Que? (Prefixo Opcional)
                     </label>
                     <Input 
                       value={macroPrefix}
                       onChange={(e) => setMacroPrefix(e.target.value)}
                       placeholder="Ex: O que é..."
                       className="h-14 bg-white border-none shadow-inner text-lg font-medium text-emerald-900 placeholder:text-emerald-300 transition-all font-outfit rounded-xl"
                     />
                   </div>
                   <div className="flex-[2]">
                     <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-2 block">
                       Qual setor ou tema?
                     </label>
                     <Input 
                       value={macroTopic}
                       onChange={(e) => setMacroTopic(e.target.value)}
                       placeholder="Ex: Fisioterapia Esportiva"
                       className="h-14 bg-white border-none shadow-inner text-lg font-medium text-emerald-900 placeholder:text-emerald-300 font-outfit rounded-xl"
                     />
                   </div>
                 </div>

                 <div className="flex gap-4 items-end">
                   <div className="flex-1">
                     <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-2 block">
                       Letra Foco
                     </label>
                     <select 
                       value={macroLetter}
                       onChange={(e) => setMacroLetter(e.target.value)}
                       className="w-full h-14 bg-white border-none shadow-inner text-lg font-bold text-emerald-900 font-outfit px-4 rounded-xl outline-none"
                     >
                        <option value="A-Z">Todas as Letras (A-Z)</option>
                        {Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i)).map(l => (
                          <option key={l} value={l}>Apenas Letra {l}</option>
                        ))}
                     </select>
                   </div>
                   <div className="flex-1">
                     <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-2 block">
                       Qtd de Termos
                     </label>
                     <Input 
                       type="number"
                       value={macroCount}
                       onChange={(e) => setMacroCount(Number(e.target.value))}
                       className="h-14 bg-white border-none shadow-inner text-lg font-bold text-emerald-900 font-outfit rounded-xl"
                       min={1}
                       max={200}
                     />
                   </div>
                   <Button 
                     onClick={handleSuggestMass}
                     disabled={isSuggesting || !macroTopic.trim()}
                     className="h-14 px-8 bg-emerald-900 hover:bg-emerald-800 text-emerald-50 font-black rounded-xl shadow-xl transition-all"
                   >
                     {isSuggesting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Sparkles className="h-5 w-5 mr-2" />}
                     Sugerir Tópicos
                   </Button>
                 </div>

                 {errorMsg && (
                   <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-bold flex items-center gap-2">
                     ⚠️ {errorMsg}
                   </div>
                 )}
               </div>
            ) : (
               <div className="space-y-6">
                 <div className="flex justify-between items-center">
                   <h4 className="font-bold text-emerald-900">A IA sugeriu {suggestions.length} tópicos para "{macroTopic}":</h4>
                   <Button variant="ghost" className="text-emerald-600 hover:bg-emerald-100 font-bold" onClick={() => setShowSuggestions(false)}>Cancelar</Button>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                   {suggestions.map((item, idx) => (
                     <div key={idx} className="bg-white p-4 rounded-2xl border border-emerald-100 flex items-start gap-3 shadow-sm">
                       <div className={`p-2 rounded-lg shrink-0 ${item.type === 'GLOSSARY' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                         {item.type === 'GLOSSARY' ? <BookA className="h-4 w-4" /> : <Tags className="h-4 w-4" />}
                       </div>
                       <div>
                         <p className="text-sm font-bold text-slate-800 leading-tight mb-1">{item.keyword}</p>
                         <p className={`text-[9px] font-black uppercase tracking-widest ${item.type === 'GLOSSARY' ? 'text-amber-500' : 'text-blue-500'}`}>{item.type}</p>
                       </div>
                     </div>
                   ))}
                 </div>

                 <Button 
                   onClick={handleAddAllSuggestions}
                   disabled={isSuggesting}
                   className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-xl shadow-emerald-900/10 text-lg"
                 >
                    {isSuggesting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Layers className="h-5 w-5 mr-2" />}
                    Adicionar os {suggestions.length} tópicos à Fila
                 </Button>
               </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-4 border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden mt-4">
          <CardHeader className="bg-white border-b border-slate-50 p-6 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-black font-outfit">Fila de Processamento Ativa</CardTitle>
            <Button 
               onClick={handleProcessAll}
               disabled={isProcessingAll || queue.filter(q => q.status === 'PENDING').length === 0}
               className="bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-lg shadow-emerald-900/10 rounded-xl"
            >
               {isProcessingAll ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
               {isProcessingAll ? 'Processando Lote...' : 'Processar Todos Pendentes'}
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
              </div>
            ) : queue.length === 0 ? (
              <div className="p-20 flex flex-col items-center justify-center text-center">
                <Layers className="h-12 w-12 text-slate-200 mb-4" />
                <h3 className="text-xl font-black font-outfit text-slate-400 mb-2">Fila Vazia</h3>
                <p className="text-sm text-slate-500">Adicione keywords ao lado para começar alimentar o motor IA.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Tópico</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Tipo</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="text-right py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {queue.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6 font-bold text-slate-700">{item.keyword}</td>
                      <td className="py-4 px-6">
                        <Badge variant="outline" className="font-bold">
                          {item.type === 'BLOG' ? <Tags className="h-3 w-3 mr-1" /> : <BookA className="h-3 w-3 mr-1" />}
                          {item.type}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <Badge className={`
                          ${item.status === 'PENDING' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' : ''}
                          ${item.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : ''}
                          ${item.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''}
                          ${item.status === 'ERROR' ? 'bg-red-100 text-red-700 hover:bg-red-100' : ''}
                        `}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {item.status === 'PENDING' && (
                          <Button 
                            variant="default" 
                            size="sm" 
                            disabled={isProcessingAll}
                            onClick={() => handleProcessItem(item.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 h-8 rounded-lg mr-2 text-[10px] uppercase font-black tracking-widest"
                          >
                            <Send className="h-3 w-3 mr-1" /> Forçar Criação
                          </Button>
                        )}
                        {item.status === 'COMPLETED' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditClick(item.keyword, item.type)}
                              className="h-8 rounded-lg mr-2 text-[10px] uppercase font-black tracking-widest text-[#0a4d2c] border-emerald-200 hover:bg-emerald-50"
                            >
                              <Edit3 className="h-3 w-3 mr-1" /> Editar/Publicar
                            </Button>
                            <a 
                              href={`/${item.type === 'BLOG' ? 'blog' : 'glossario'}/${generateSlug(item.keyword)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 rounded-lg mr-2 text-[10px] uppercase font-black tracking-widest text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                              >
                                Ver Resultado
                              </Button>
                            </a>
                          </>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          disabled={isProcessingAll}
                          onClick={() => {
                            if (item.status === 'COMPLETED') handleDeleteDoc(item.id, item.keyword, item.type)
                            else handleDelete(item.id)
                          }}
                          className="h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 text-[10px] uppercase font-black"
                        >
                          Remover
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Post/Glossary Modal */}
      <AnimatePresence>
        {showEditModal && editingDoc && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
              onClick={() => setShowEditModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4 py-8 pointer-events-none"
            >
              <Card className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl max-h-screen pointer-events-auto flex flex-col overflow-hidden">
                <CardHeader className="p-6 border-b border-slate-50 bg-[#0a4d2c] text-white shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Edit3 className="h-6 w-6" />
                      <CardTitle className="text-xl font-black font-outfit">
                        Revisar {editType === 'BLOG' ? 'Artigo' : 'Termo de Glossário'}
                      </CardTitle>
                    </div>
                    <button onClick={() => setShowEditModal(false)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                  
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                      {editType === 'BLOG' ? 'Título do Artigo' : 'Palavra ou Termo'}
                    </label>
                    <Input 
                      value={editType === 'BLOG' ? editingDoc.title : editingDoc.term}
                      onChange={e => {
                        const val = e.target.value
                        if (editType === 'BLOG') setEditingDoc({ ...editingDoc, title: val })
                        else setEditingDoc({ ...editingDoc, term: val })
                      }}
                      className="rounded-xl h-14 font-bold text-slate-700 bg-slate-50 border-none"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col min-h-[350px]">
                    <div className="flex justify-between items-center mb-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Conteúdo (HTML)</label>
                       <Badge className={cn(
                          "px-3 py-1 text-[9px]",
                          editingDoc.status === 'PUBLISHED' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        )}>
                          Status atual: {editingDoc.status}
                       </Badge>
                    </div>
                    
                    <textarea 
                      className="w-full flex-1 rounded-2xl bg-slate-50 border-slate-200 p-6 font-medium text-slate-600 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none min-h-[300px]"
                      value={editType === 'BLOG' ? editingDoc.content : editingDoc.definition}
                      onChange={e => {
                        const val = e.target.value
                        if (editType === 'BLOG') setEditingDoc({ ...editingDoc, content: val })
                        else setEditingDoc({ ...editingDoc, definition: val })
                      }}
                    />
                  </div>

                  <div className="flex gap-4 shrink-0 pt-4 border-t border-slate-100">
                    <Button 
                      onClick={() => handleUpdateDoc()}
                      disabled={isSaving}
                      className="flex-1 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl h-14 font-black shadow-lg"
                    >
                      {isSaving ? <Loader2 className="h-5 w-5 animate-spin mr-2"/> : null} 
                      Apenas Salvar
                    </Button>
                    <Button 
                      onClick={() => handleUpdateDoc(editingDoc.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED')}
                      disabled={isSaving}
                      className={cn(
                        "flex-1 rounded-2xl h-14 font-black border-2 transition-all",
                        editingDoc.status === 'PUBLISHED' 
                          ? "border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100" 
                          : "border-emerald-200 text-[#0a4d2c] bg-emerald-50 hover:bg-emerald-100 shadow-xl shadow-emerald-900/10"
                      )}
                    >
                      {editingDoc.status === 'PUBLISHED' 
                        ? 'Desativar (Mover para Rascunho)' 
                        : <><Sparkles className="w-4 h-4 mr-2"/> Publicar para Venda Agora!</>}
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
