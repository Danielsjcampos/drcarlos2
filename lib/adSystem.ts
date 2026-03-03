import prisma from '@/lib/db'

export async function injectAds(content: string) {
  const settings = await prisma.settings.findUnique({ where: { id: 'global' } })
  
  if (!settings || !settings.adEnabled) {
    return content
  }

  const { adCTAText, adTarget, adFrequency, whatsappUrl, contactPhone, contactEmail } = settings

  let href = '#'
  let targetLabel = ''

  if (adTarget === 'WHATSAPP') {
    href = whatsappUrl || '#'
    targetLabel = 'WhatsApp'
  } else if (adTarget === 'PHONE') {
    href = `tel:${contactPhone}`
    targetLabel = 'Telefone'
  } else if (adTarget === 'EMAIL') {
    href = `mailto:${contactEmail}`
    targetLabel = 'E-mail'
  }

  const adHtml = `
<div class="my-10 p-8 bg-emerald-50 rounded-[32px] border-2 border-emerald-100 text-center shadow-sm">
  <h3 class="text-xl font-black text-emerald-900 mb-4 font-outfit">${adCTAText}</h3>
  <a href="${href}" target="_blank" class="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg shadow-emerald-900/10 active:scale-95">
    Falar no ${targetLabel}
  </a>
</div>`

  const paragraphs = content.split('</h2>')
  
  if (paragraphs.length <= 1) {
    // Se não tiver H2, tenta P
    const pSplit = content.split('</p>')
    if (pSplit.length > 3) {
       if (adFrequency === 2) {
         pSplit.splice(Math.floor(pSplit.length / 2), 0, adHtml)
         pSplit.push(adHtml)
       } else {
         pSplit.splice(Math.floor(pSplit.length / 2), 0, adHtml)
       }
       return pSplit.join('</p>')
    }
    return content + adHtml
  }

  // Se tiver H2
  if (adFrequency === 2 && paragraphs.length >= 3) {
    // Injeta após o primeiro H2 e no final
    paragraphs.splice(1, 0, adHtml + '</h2>')
    return paragraphs.join('</h2>') + adHtml
  } else {
    // Injeta após o primeiro H2 (se só 1 frequentia ou poucos H2)
    paragraphs.splice(1, 0, adHtml + '</h2>')
    return paragraphs.join('</h2>')
  }
}
