import Link from 'next/link'
import { Activity, Instagram, Facebook, Mail, MapPin, Phone } from 'lucide-react'
import { getSiteSettings } from '@/lib/settings'

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="bg-[#111] text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="h-7 w-7 text-[#22c55e]" />
              <span className="text-xl font-bold font-outfit tracking-tight">SPORT <span className="text-[#22c55e]">HEALTH</span></span>
            </div>
            <p className="text-gray-400 text-sm">
              {settings?.description || "Fisioterapia de alto rendimento para todos. Dr. Carlos Prado - Especialista em Ortopedia e Esporte."}
            </p>
            <div className="flex items-center gap-4">
              {settings?.instagramUrl && (
                <Link href={settings.instagramUrl} target="_blank" className="p-2 bg-white/5 rounded-full hover:bg-[#22c55e] transition-colors">
                  <Instagram className="h-4 w-4" />
                </Link>
              )}
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-blue-600 transition-colors">
                <Facebook className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 font-outfit">Tratamentos</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/tratamentos/ombro" className="hover:text-[#22c55e]">Dor no Ombro</Link></li>
              <li><Link href="/tratamentos/coluna-lombar" className="hover:text-[#22c55e]">Coluna Lombar</Link></li>
              <li><Link href="/tratamentos/joelho" className="hover:text-[#22c55e]">Reabilitação de Joelho</Link></li>
              <li><Link href="/tratamentos/lesoes-esportivas" className="hover:text-[#22c55e]">Lesões Esportivas</Link></li>
              <li><Link href="/tratamentos/pos-operatorio" className="hover:text-[#22c55e]">Pós-Operatório</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 font-outfit">Links Rápidos</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/sobre" className="hover:text-[#22c55e]">Sobre o Dr. Carlos</Link></li>
              <li><Link href="/servicos-para-atletas" className="hover:text-[#22c55e]">Serviços para Atletas</Link></li>
              <li><Link href="/blog" className="hover:text-[#22c55e]">Blog & News</Link></li>
              <li><Link href="/politica-privacidade" className="hover:text-[#22c55e]">Política de Privacidade</Link></li>
              <li><Link href="/login" className="hover:text-[#22c55e]">Área do Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 font-outfit">Contato</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#22c55e] shrink-0" />
                <span>
                    {settings?.address ? `${settings.address}, ${settings.addressCity} - ${settings.addressRegion}` : "Av. Linneu de Moura, s/n - Condomínio ..., São José dos Campos - SP"}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#22c55e] shrink-0" />
                <span>{settings?.contactPhone || "(12) 99715-0819"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#22c55e] shrink-0" />
                <span>{settings?.contactEmail || "contato@sporthealthsjc.com.br"}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {settings?.siteName || "Sport Health"} - Dr. Carlos Prado. Todos os direitos reservados.</p>
          <p>Desenvolvido com ❤️ em São José dos Campos</p>
        </div>
      </div>
    </footer>
  )
}
