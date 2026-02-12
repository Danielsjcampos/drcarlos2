'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  User, Phone, Search, 
  ChevronRight, ArrowLeft, Plus, Save, 
  Activity, Camera, Trash2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const fetchPatients = () => {
    setLoading(true)
    fetch('/api/patients')
      .then(res => res.json())
      .then(data => {
        setPatients(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchPatients() }, [])

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedPatient) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.url) {
        const updatedPhotos = [...(selectedPatient.photos || []), data.url]
        const updatedPatient = { ...selectedPatient, photos: updatedPhotos }
        setSelectedPatient(updatedPatient)
        
        await fetch('/api/patients', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPatient)
        })
      }
    } catch (err) {
      alert('Erro ao fazer upload')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removePhoto = async (index: number) => {
    if (!selectedPatient) return
    const currentPhotos = selectedPatient.photos || []
    const updatedPhotos = currentPhotos.filter((_: any, i: number) => i !== index)
    const updatedPatient = { ...selectedPatient, photos: updatedPhotos }
    setSelectedPatient(updatedPatient)
    
    await fetch('/api/patients', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPatient)
    })
  }

  const handleUpdate = async () => {
    if (!selectedPatient) return
    setSaving(true)
    try {
      await fetch('/api/patients', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedPatient)
      })
      fetchPatients()
    } catch (error) {
      alert('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePatient = async () => {
    if (!selectedPatient || !confirm(`Tem certeza que deseja excluir o paciente ${selectedPatient.name}? Todos os agendamentos vinculados também serão removidos.`)) return
    
    try {
      await fetch(`/api/patients?id=${selectedPatient.id}`, { method: 'DELETE' })
      setSelectedPatient(null)
      fetchPatients()
    } catch (error) {
      alert('Erro ao excluir paciente')
    }
  }

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.phone.includes(searchTerm)
  )

  if (loading && patients.length === 0) return (
    <DashboardLayout>
      <div className="p-10 text-center uppercase font-black text-slate-400 tracking-widest animate-pulse">
        Sincronizando Base de Pacientes...
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8 pb-20 lg:pb-0">
        {/* Header */}
        <div className={cn(
          "flex flex-col md:flex-row justify-between items-start md:items-center gap-4",
          selectedPatient && "hidden lg:flex" // Hide header on mobile detail view
        )}>
          <div>
            <h1 className="text-2xl md:text-3xl font-black font-outfit text-slate-900 tracking-tight">Gestão de Pacientes</h1>
            <p className="text-sm md:text-base text-slate-500 font-medium">Cadastros, prontuários e histórico.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-[300px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Buscar por nome ou CPF..." 
                className="pl-10 rounded-xl border-slate-200 h-10 md:h-12"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="bg-[#0a4d2c] hover:bg-[#083d23] rounded-xl gap-2 font-bold h-10 md:h-12">
              <Plus className="h-4 w-4" />
              Novo Paciente
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* List Column */}
          <div className={cn(
            "lg:col-span-4 space-y-4",
            selectedPatient ? "hidden lg:block" : "block"
          )}>
            {filteredPatients.map(p => (
              <motion.div
                key={p.id}
                whileHover={{ x: 5 }}
                onClick={() => setSelectedPatient(p)}
                className={cn(
                  "p-5 rounded-2xl border cursor-pointer transition-all active:scale-[0.98]",
                  selectedPatient?.id === p.id 
                    ? "bg-emerald-50 border-emerald-200 shadow-lg" 
                    : "bg-white border-slate-100"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900 text-base">{p.name}</h3>
                  <Badge variant="outline" className="text-[8px] uppercase tracking-widest py-0">
                    {p.status === 'NEW' ? 'Lead' : 'Ativo'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Phone className="h-3 w-3" />
                  {p.phone}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Details Column */}
          <div className={cn(
            "lg:col-span-8",
            selectedPatient ? "block" : "hidden lg:block"
          )}>
            <AnimatePresence mode="wait">
              {selectedPatient ? (
                <motion.div
                  key={selectedPatient.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 md:space-y-8"
                >
                  {/* Mobile Back Button */}
                  <button 
                    onClick={() => setSelectedPatient(null)}
                    className="lg:hidden flex items-center gap-2 text-[#0a4d2c] font-black text-xs uppercase tracking-widest mb-4 transition-all active:scale-95"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para Lista
                  </button>

                  <Card className="rounded-[2rem] md:rounded-[32px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-black p-6 md:p-8 text-white relative">
                       {/* Background decoration */}
                       <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px] translate-x-10 -translate-y-10" />

                       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
                          <div className="flex items-center gap-4 md:gap-6">
                             <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-emerald-500 flex items-center justify-center text-2xl md:text-4xl font-black shadow-lg shadow-emerald-500/20">
                                {selectedPatient.name.charAt(0)}
                             </div>
                             <div>
                                <h2 className="text-xl md:text-2xl font-black font-outfit leading-tight flex items-center gap-3">
                                   {selectedPatient.name}
                                   {selectedPatient.accessCode && (
                                     <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-black text-[9px] uppercase tracking-[0.2em] px-3">
                                        PIN: {selectedPatient.accessCode}
                                     </Badge>
                                   )}
                                </h2>
                                <p className="text-emerald-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mt-1">{selectedPatient.origin || 'Origem não definida'}</p>
                             </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <Button 
                              variant="ghost" 
                              onClick={handleDeletePatient}
                              className="h-12 md:h-14 px-6 rounded-xl md:rounded-2xl text-red-500 hover:bg-red-50 gap-2 font-bold transition-all active:scale-95"
                            >
                               <Trash2 className="h-4 w-4" /> 
                               Excluir
                            </Button>
                            <Button 
                              onClick={handleUpdate} 
                              disabled={saving}
                              className="bg-emerald-500 hover:bg-emerald-600 rounded-xl md:rounded-2xl h-12 md:h-14 px-8 font-black text-xs gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex-1 sm:flex-none"
                            >
                               <Save className="h-4 w-4" /> 
                               {saving ? 'Salvando...' : 'Salvar Prontuário'}
                            </Button>
                          </div>
                       </div>
                    </div>

                    <CardContent className="p-6 md:p-10 space-y-8 md:space-y-12">
                      {/* Personal Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-6">
                           <div className="p-2 bg-emerald-50 rounded-lg">
                              <User className="h-4 w-4 text-emerald-600" />
                           </div>
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Informações Pessoais</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                          <FieldGroup label="Data de Nascimento">
                            <Input 
                              type="date" 
                              value={selectedPatient.birthDate ? new Date(selectedPatient.birthDate).toISOString().split('T')[0] : ''}
                              onChange={e => setSelectedPatient({...selectedPatient, birthDate: e.target.value})}
                              className="rounded-xl h-12 border-slate-100"
                            />
                          </FieldGroup>
                          <FieldGroup label="Gênero">
                             <select 
                               className="w-full h-12 px-4 bg-white border border-slate-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all appearance-none"
                               value={selectedPatient.gender || ''}
                               onChange={e => setSelectedPatient({...selectedPatient, gender: e.target.value})}
                             >
                                <option value="">Não informado</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outro">Outro</option>
                             </select>
                          </FieldGroup>
                          <FieldGroup label="Profissão">
                            <Input 
                              value={selectedPatient.occupation || ''}
                              onChange={e => setSelectedPatient({...selectedPatient, occupation: e.target.value})}
                              className="rounded-xl h-12 border-slate-100"
                              placeholder="Ex: Maratonista"
                            />
                          </FieldGroup>
                        </div>
                      </div>

                      {/* Clinical History */}
                      <div>
                        <div className="flex items-center gap-2 mb-6">
                           <div className="p-2 bg-emerald-50 rounded-lg">
                              <Activity className="h-4 w-4 text-emerald-600" />
                           </div>
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Prontuário Digital</h4>
                        </div>
                        <div className="space-y-6">
                          <FieldGroup label="Anamnese / Queixa Principal">
                            <textarea 
                               rows={4}
                               className="w-full p-5 bg-slate-50 border border-transparent rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-500/5 transition-all resize-none"
                               value={selectedPatient.painHistory || ''}
                               onChange={e => setSelectedPatient({...selectedPatient, painHistory: e.target.value})}
                               placeholder="Descreva detalhadamente a dor e o histórico do paciente..."
                            />
                          </FieldGroup>
                          <FieldGroup label="Antecedentes e Observações">
                            <textarea 
                               rows={4}
                               className="w-full p-5 bg-slate-50 border border-transparent rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-500/5 transition-all resize-none"
                               value={selectedPatient.medicalHistory || ''}
                               onChange={e => setSelectedPatient({...selectedPatient, medicalHistory: e.target.value})}
                               placeholder="Cirurgias prévias, medicamentos, alergias..."
                            />
                          </FieldGroup>
                        </div>
                      </div>

                      {/* Photo Gallery */}
                      <div>
                        <div className="flex items-center justify-between mb-6">
                           <div className="flex items-center gap-2">
                              <div className="p-2 bg-emerald-50 rounded-lg">
                                 <Camera className="h-4 w-4 text-emerald-600" />
                              </div>
                              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Galeria de Exames & Postura</h4>
                           </div>
                           {selectedPatient.photos?.length > 0 && (
                             <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploading}
                              className="text-[10px] font-black uppercase tracking-widest text-[#0a4d2c] hover:bg-emerald-50"
                             >
                               Adicionar Foto
                             </Button>
                           )}
                        </div>

                        <input 
                          type="file" 
                          className="hidden" 
                          ref={fileInputRef} 
                          onChange={handlePhotoUpload}
                          accept="image/*,.pdf"
                        />

                        {selectedPatient.photos?.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {selectedPatient.photos.map((url: string, idx: number) => (
                              <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                                <img src={url} className="w-full h-full object-cover" alt={`Exame ${idx + 1}`} />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <button 
                                    onClick={() => window.open(url, '_blank')}
                                    className="p-2 bg-white rounded-lg text-slate-900 hover:scale-110 transition-transform"
                                  >
                                    <ChevronRight className="h-4 w-4" />
                                  </button>
                                  <button 
                                    onClick={() => removePhoto(idx)}
                                    className="p-2 bg-red-500 rounded-lg text-white hover:scale-110 transition-transform"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                            <button 
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploading}
                              className="aspect-square rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 hover:border-emerald-200 hover:bg-emerald-50/30 hover:text-emerald-500 transition-all group"
                            >
                              <Plus className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
                              <span className="text-[8px] font-black uppercase tracking-widest">Novo Item</span>
                            </button>
                          </div>
                        ) : (
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                              "p-8 md:p-12 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100 text-center group cursor-pointer hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-500",
                              uploading && "opacity-50 pointer-events-none"
                            )}
                          >
                             <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-md mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                                <Activity className={cn("h-6 w-6 text-emerald-400", uploading && "animate-spin")} />
                             </div>
                             <h5 className="font-black text-slate-800 mb-2 tracking-tight">
                               {uploading ? 'Enviando arquivo...' : 'Galeria de Exames & Postura'}
                             </h5>
                             <p className="text-xs text-slate-400 max-w-[200px] mx-auto leading-relaxed">Clique para selecionar e anexar fotos e exames ao perfil.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-300 space-y-6">
                  <div className="w-32 h-32 rounded-full bg-slate-50 flex items-center justify-center">
                    <User className="h-16 w-16 opacity-20" />
                  </div>
                  <p className="font-black font-outfit uppercase tracking-[0.2em] text-[10px] text-center max-w-[250px] leading-relaxed">
                    Selecione um paciente ao lado para visualizar e editar o prontuário completo.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function FieldGroup({ label, children }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      {children}
    </div>
  )
}
