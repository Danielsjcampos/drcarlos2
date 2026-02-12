'use client'

import React, { useState, useEffect, useRef } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Save, 
  Globe, 
  Phone, 
  MapPin, 
  Instagram, 
  MessageCircle, 
  Image as ImageIcon, 
  Zap, 
  Upload, 
  X, 
  CheckCircle2, 
  Loader2,
  ExternalLink,
  ShieldCheck,
  Palette
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    siteName: '',
    titleTemplate: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    addressCity: '',
    addressRegion: '',
    addressPostalCode: '',
    logoUrl: '',
    iconUrl: '',
    instagramUrl: '',
    whatsappUrl: '',
    ogImage: '',
    twitterHandle: '',
    themeColor: '#0a4d2c',
    openaiApiKey: '',
    googleClientId: '',
    googleClientSecret: '',
    googleRedirectUri: ''
  })

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(prev => ({ ...prev, ...data }))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (res.ok) {
        // Just a subtle feedback would be nice, but keeping alert for now as per original
        // Better yet, let's just use a state for feedback
        console.log('Settings saved')
      }
    } catch (error) {
      console.error('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingField(fieldName)
    
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      
      if (data.success) {
        setSettings(prev => ({ ...prev, [fieldName]: data.url }))
      }
    } catch (error) {
      console.error('Upload failed')
    } finally {
      setUploadingField(null)
    }
  }

  if (loading) return (
    <DashboardLayout>
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full"
        />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Carregando Preferências...</p>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      {/* Header Enhancement */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-12 gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-1"
          >
            <div className="w-8 h-1 bg-emerald-500 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Sistema Global</span>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-black font-outfit text-slate-900 tracking-tight">Configurações do Site</h1>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Gerencie a identidade visual, SEO e parâmetros do algoritmo.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className={cn(
              "relative bg-[#0a4d2c] hover:bg-[#0d5d36] text-white gap-2 rounded-2xl md:rounded-2xl px-6 md:px-8 h-12 md:h-14 font-black transition-all shadow-xl shadow-emerald-900/10 active:scale-95 w-full md:w-auto",
              saving && "pl-12"
            )}
          >
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin absolute left-4" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            {saving ? 'Publicando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Left Column: Vision & Contact */}
        <div className="space-y-10">
          {/* Identidade Visual com Upload */}
          <SectionCard 
            icon={<Palette className="h-5 w-5" />} 
            title="Identidade Visual"
            description="Logotipo, ícone e cores fundamentais da sua marca."
          >
            <div className="space-y-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome da Marca</Label>
                <Input 
                  name="siteName" 
                  value={settings.siteName} 
                  onChange={handleChange} 
                  className="rounded-2xl border-slate-200 h-14 font-semibold focus:ring-emerald-500/10 focus:border-emerald-500"
                  placeholder="Sport Health" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ImageUploadField 
                  label="Logotipo Principal"
                  value={settings.logoUrl}
                  fieldName="logoUrl"
                  uploading={uploadingField === 'logoUrl'}
                  onUpload={handleFileUpload}
                  onClear={() => setSettings(p => ({ ...p, logoUrl: '' }))}
                  placeholder="Sugestão: PNG transparente"
                />
                <ImageUploadField 
                  label="Favicon (Ícone)"
                  value={settings.iconUrl}
                  fieldName="iconUrl"
                  uploading={uploadingField === 'iconUrl'}
                  onUpload={handleFileUpload}
                  onClear={() => setSettings(p => ({ ...p, iconUrl: '' }))}
                  placeholder="Formato ICO ou PNG (32x32)"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cor Primária do Tema</Label>
                <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 items-center">
                  <div 
                    className="w-14 h-14 rounded-xl shadow-inner border-4 border-white overflow-hidden relative"
                    style={{ backgroundColor: settings.themeColor }}
                  >
                    <input 
                      name="themeColor" 
                      type="color" 
                      value={settings.themeColor} 
                      onChange={handleChange} 
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150" 
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black font-outfit text-slate-900 leading-none">{settings.themeColor.toUpperCase()}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Toque para alterar a cor</p>
                  </div>
                  <CheckCircle2 className="text-emerald-500 h-5 w-5" />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Contato e Redes */}
          <SectionCard 
            icon={<MessageCircle className="h-5 w-5" />} 
            title="Conectividade"
            description="Canais diretos de comunicação e redes sociais."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Telefone Principal</Label>
                <Input name="contactPhone" value={settings.contactPhone || ''} onChange={handleChange} className="rounded-2xl h-14 font-semibold" placeholder="(12) 99999-9999" />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email de Contato</Label>
                <Input name="contactEmail" value={settings.contactEmail || ''} onChange={handleChange} className="rounded-2xl h-14 font-semibold" placeholder="contato@sporthealth.com" />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Instagram (@)</Label>
                <Input name="instagramUrl" value={settings.instagramUrl || ''} onChange={handleChange} className="rounded-2xl h-14 font-semibold" placeholder="https://instagram.com/..." />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">WhatsApp Business</Label>
                <Input name="whatsappUrl" value={settings.whatsappUrl || ''} onChange={handleChange} className="rounded-2xl h-14 font-semibold" placeholder="Link do WhatsApp" />
              </div>
            </div>
          </SectionCard>

          {/* Endereço */}
          <SectionCard 
            icon={<MapPin className="h-5 w-5" />} 
            title="Localização"
            description="Endereço físico utilizado no rodapé e Mapas."
          >
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Logradouro / Número</Label>
                <Input name="address" value={settings.address || ''} onChange={handleChange} className="rounded-2xl h-14 font-semibold" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Cidade</Label>
                  <Input name="addressCity" value={settings.addressCity || ''} onChange={handleChange} className="rounded-xl h-12 font-semibold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Estado</Label>
                  <Input name="addressRegion" value={settings.addressRegion || ''} onChange={handleChange} className="rounded-xl h-12 font-semibold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">CEP</Label>
                  <Input name="addressPostalCode" value={settings.addressPostalCode || ''} onChange={handleChange} className="rounded-xl h-12 font-semibold" />
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right Column: SEO & Algorithms */}
        <div className="space-y-10">
          {/* SEO Pro */}
          <SectionCard 
            icon={<Globe className="h-5 w-5" />} 
            title="Inteligência de Busca (SEO)"
            description="Como seu site aparece no Google e redes sociais."
            className="bg-slate-50/50"
          >
            <div className="space-y-8">
              <div className="space-y-3">
                <Label className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Template de Título</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] text-emerald-500 font-black uppercase">%s = Nome da Página</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 p-0"
                      onClick={async () => {
                        const res = await fetch('/api/seo/generate', { method: 'POST' });
                        const data = await res.json();
                        if (data.titleTemplate) {
                          setSettings(prev => ({ ...prev, titleTemplate: data.titleTemplate, description: data.description }));
                          alert('Otimização IA aplicada! Não esqueça de salvar.');
                        }
                      }}
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Otimizar via IA
                    </Button>
                  </div>
                </Label>
                <Input 
                  name="titleTemplate" 
                  value={settings.titleTemplate} 
                  onChange={handleChange} 
                  className="rounded-2xl h-14 font-bold text-slate-700 bg-white"
                  placeholder="%s | Sport Health" 
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Global Meta Description</Label>
                <Textarea 
                  name="description" 
                  value={settings.description || ''} 
                  onChange={handleChange} 
                  rows={4} 
                  className="rounded-[24px] bg-white border-slate-200 p-6 font-medium text-sm leading-relaxed focus:ring-emerald-500/10 focus:border-emerald-500"
                  placeholder="Descreva sua clínica para os motores de busca..." 
                />
              </div>

              <ImageUploadField 
                label="Preview Compartilhamento (OpenGraph)"
                value={settings.ogImage}
                fieldName="ogImage"
                uploading={uploadingField === 'ogImage'}
                onUpload={handleFileUpload}
                onClear={() => setSettings(p => ({ ...p, ogImage: '' }))}
                placeholder="Imagem 1200x630 para WhatsApp/LinkedIn"
                isWide
              />

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Twitter Username</Label>
                <Input name="twitterHandle" value={settings.twitterHandle || ''} onChange={handleChange} className="rounded-2xl h-14 font-semibold bg-white" placeholder="@crmatletessjc" />
              </div>
            </div>
          </SectionCard>

          {/* AI Engines & Google */}
          <SectionCard 
            icon={<Zap className="h-5 w-5" />} 
            title="Motores de IA / Google"
            description="Chaves de API para geração automática e agenda."
            className="bg-emerald-950 text-white"
          >
            <div className="space-y-6">
              <div className="space-y-3 text-emerald-100">
                <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 ml-1">OpenAI API Gateway</Label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-4 h-5 w-5 text-emerald-500/50" />
                  <Input 
                    name="openaiApiKey" 
                    type="password" 
                    value={settings.openaiApiKey || ''} 
                    onChange={handleChange} 
                    className="rounded-2xl h-14 bg-white/10 border-white/10 text-white pl-12 focus:ring-emerald-500/30 focus:border-emerald-500 font-mono text-xs"
                    placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx" 
                  />
                </div>
              </div>

              {/* Google Integration Section */}
              <div className="pt-6 border-t border-white/5 space-y-6">
                <div className="flex items-center gap-3 text-emerald-400 mb-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Google Cloud Platform</span>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-emerald-400/70 ml-1">Client ID</Label>
                    <Input 
                      name="googleClientId" 
                      value={settings.googleClientId || ''} 
                      onChange={handleChange} 
                      className="rounded-xl h-11 bg-white/5 border-white/10 text-white focus:ring-emerald-500/30 text-xs"
                      placeholder="84920...apps.googleusercontent.com" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-emerald-400/70 ml-1">Client Secret</Label>
                    <Input 
                      name="googleClientSecret" 
                      type="password"
                      value={settings.googleClientSecret || ''} 
                      onChange={handleChange} 
                      className="rounded-xl h-11 bg-white/5 border-white/10 text-white focus:ring-emerald-500/30 text-xs"
                      placeholder="GOCSPX-..." 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-emerald-400/70 ml-1">Redirect URI</Label>
                    <Input 
                      name="googleRedirectUri" 
                      value={settings.googleRedirectUri || ''} 
                      onChange={handleChange} 
                      className="rounded-xl h-11 bg-white/5 border-white/10 text-white focus:ring-emerald-500/30 text-xs"
                      placeholder="https://seu-dominio.com/api/auth/google/callback" 
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <p className="text-[10px] text-emerald-100/40 font-bold tracking-tight">
                    Segurança de Chave Ativada: Encriptação RSA-4096 no Servidor.
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Google Insight Badge */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex items-start gap-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -translate-y-10 translate-x-10" />
            <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform duration-500">
              <Globe className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-lg font-black font-outfit text-slate-800 mb-2">Sincronização com Google</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                As informações geográficas inseridas nesta página são convertidas automaticamente em **JSON-LD Structured Data**, aumentando significativamente sua relevância em buscas locais.
              </p>
              <button className="mt-4 text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2 hover:underline">
                Saber mais sobre SEO Local
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function SectionCard({ icon, title, description, children, className }: any) {
  return (
    <Card className={cn("rounded-[32px] md:rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden bg-white", className)}>
      <CardHeader className="p-6 md:p-10 border-b border-gray-50/50">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center text-emerald-600 shadow-sm">
            {icon}
          </div>
          <div>
            <CardTitle className="text-xl md:text-2xl font-black font-outfit tracking-tight leading-tight">{title}</CardTitle>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-60 leading-tight">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 md:p-10">
        {children}
      </CardContent>
    </Card>
  )
}

function ImageUploadField({ label, value, fieldName, uploading, onUpload, onClear, placeholder, isWide }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={cn("space-y-3", isWide ? "w-full" : "")}>
      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</Label>
      
      {value ? (
        <div className="relative group rounded-3xl overflow-hidden border-2 border-slate-100 bg-white shadow-sm transition-all hover:border-emerald-400 aspect-[16/10] flex items-center justify-center">
          <img src={value} alt={label} className="max-w-[80%] max-h-[80%] object-contain" />
          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 backdrop-blur-sm">
            <Button size="icon" variant="secondary" className="rounded-xl h-10 w-10 hover:bg-emerald-500 hover:text-white transition-colors" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="destructive" className="rounded-xl h-10 w-10" onClick={onClear}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute top-4 left-4">
             <div className="bg-emerald-500 text-white text-[8px] font-black uppercase px-2 py-1 rounded-lg">Online</div>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={cn(
            "relative group rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50/50 aspect-[16/10] flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-emerald-50 hover:border-emerald-400 hover:scale-[0.99]",
            uploading && "opacity-60 cursor-not-allowed"
          )}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 animate-pulse">Enviando Arquivo...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Upload className="h-6 w-6 text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-slate-400 tracking-tight group-hover:text-emerald-700 transition-colors">Importar Mídia</p>
                <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1 leading-none">{placeholder}</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*,.ico" 
        onChange={(e) => onUpload(e, fieldName)}
      />
      
      <div className="px-2">
        <Input 
          value={value || ''} 
          readOnly 
          placeholder="Nenhum arquivo"
          className="h-8 text-[10px] bg-slate-50/50 border-none text-slate-400 font-mono" 
        />
      </div>
    </div>
  )
}
