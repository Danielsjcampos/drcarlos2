'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save, Globe, Phone, MapPin, Instagram, MessageCircle, Image as ImageIcon, Zap } from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
    openaiApiKey: ''
  })

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data)
        setLoading(false)
      })
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
        alert('Configurações salvas com sucesso!')
      }
    } catch (error) {
      alert('Erro ao salvar configurações.')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  if (loading) return <DashboardLayout><div className="p-10 text-center">Carregando...</div></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-gray-900">Configurações do Site</h1>
          <p className="text-gray-500">Gerencie a identidade visual, SEO e dados de contato globais.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-[#0a4d2c] hover:bg-[#083d23] gap-2 rounded-xl px-8"
        >
          <Save className="h-5 w-5" />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Identidade e Contato */}
        <div className="space-y-8">
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="border-b border-gray-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#0a4d2c]" />
                Identidade Visual
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Nome do Site</Label>
                <Input name="siteName" value={settings.siteName} onChange={handleChange} placeholder="Sport Health" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>URL do Logo</Label>
                  <Input name="logoUrl" value={settings.logoUrl || ''} onChange={handleChange} placeholder="/logo.png" />
                </div>
                <div className="space-y-2">
                  <Label>URL do Favicon</Label>
                  <Input name="iconUrl" value={settings.iconUrl || ''} onChange={handleChange} placeholder="/favicon.ico" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cor do Tema</Label>
                <div className="flex gap-4">
                  <Input name="themeColor" type="color" value={settings.themeColor} onChange={handleChange} className="w-20 p-1 h-10" />
                  <Input value={settings.themeColor} readOnly className="bg-gray-50 uppercase" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="border-b border-gray-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="h-5 w-5 text-[#0a4d2c]" />
                Contato e Redes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input name="contactPhone" value={settings.contactPhone || ''} onChange={handleChange} placeholder="(12) 99999-9999" />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input name="contactEmail" value={settings.contactEmail || ''} onChange={handleChange} placeholder="contato@sporthealth.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Instagram (URL)</Label>
                  <Input name="instagramUrl" value={settings.instagramUrl || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp (URL)</Label>
                  <Input name="whatsappUrl" value={settings.whatsappUrl || ''} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="border-b border-gray-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#0a4d2c]" />
                Endereço Físico
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Rua, Número, Complemento</Label>
                <Input name="address" value={settings.address || ''} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input name="addressCity" value={settings.addressCity || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Input name="addressRegion" value={settings.addressRegion || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>CEP</Label>
                  <Input name="addressPostalCode" value={settings.addressPostalCode || ''} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm bg-blue-50/30">
            <CardHeader className="border-b border-blue-100">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                <Zap className="h-5 w-5" />
                Integrações (IA)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>OpenAI API Key</Label>
                <Input 
                  name="openaiApiKey" 
                  type="password" 
                  value={settings.openaiApiKey || ''} 
                  onChange={handleChange} 
                  placeholder="sk-..." 
                />
                <p className="text-[10px] text-gray-400">
                  Necessária para a geração automática de conteúdos no Blog.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SEO */}
        <div className="space-y-8">
          <Card className="border-gray-100 shadow-sm bg-[#fafafa]">
            <CardHeader className="border-b border-gray-50">
              <CardTitle className="text-lg flex items-center gap-2 text-[#0a4d2c]">
                <Globe className="h-5 w-5" />
                Configurações de SEO (Busca)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="flex justify-between">
                  Template de Título
                  <span className="text-[10px] text-gray-400 font-normal">%s = Título da Página</span>
                </Label>
                <Input name="titleTemplate" value={settings.titleTemplate} onChange={handleChange} placeholder="%s | Sport Health" />
              </div>
              <div className="space-y-2">
                <Label>Descrição Global (Meta Description)</Label>
                <Textarea 
                  name="description" 
                  value={settings.description || ''} 
                  onChange={handleChange} 
                  rows={4} 
                  placeholder="Resumo do site para o Google..." 
                />
              </div>
              <div className="space-y-2">
                <Label>Imagem de Prévia (OpenGraph)</Label>
                <div className="flex gap-4">
                  <Input name="ogImage" value={settings.ogImage || ''} onChange={handleChange} placeholder="/og-image.jpg" />
                  <div className="w-12 h-10 rounded border bg-white flex items-center justify-center overflow-hidden">
                    {settings.ogImage ? <img src={settings.ogImage} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-200 h-5 w-5" />}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Twitter Handle</Label>
                <Input name="twitterHandle" value={settings.twitterHandle || ''} onChange={handleChange} placeholder="@sporthealth" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#22c55e]/20 bg-[#22c55e]/5 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#0a4d2c]">
                <MessageCircle className="h-4 w-4" />
                Dica de SEO Local
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-gray-600 leading-relaxed">
              O endereço e telefone configurados aqui serão utilizados para gerar o 
              <strong className="text-[#0a4d2c] ml-1">Schema Markup (Organization & LocalBusiness)</strong> automaticamente. 
              Isso ajuda o Google a entender que você é um negócio físico em São José dos Campos.
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
