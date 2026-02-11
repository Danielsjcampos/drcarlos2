import { TreatmentLayout } from '@/components/TreatmentLayout'

export default function ManualPage() {
  return (
    <TreatmentLayout 
      title="Terapia Manual — o poder do toque especializado"
      intro="Conjunto de técnicas manuais como mobilização articular e liberação miofascial para restaurar o movimento e eliminar tensões."
      whenToSeek={[
        'Sensação de "corpo travado"',
        'Dores musculares persistentes',
        'Tensões por estresse ou má postura',
        'Limitação de movimento sem causa aparente',
        'Desejo de otimizar a recuperação muscular'
      ]}
      protocol={[
        'Avaliação das restrições de movimento.',
        'Técnicas de liberação miofascial e pontos gatilho.',
        'Mobilização articular (Maitland, Mulligan).',
        'Manipulações quando indicadas.',
        'Instrução de auto-liberação para casa.'
      ]}
      benefits={[
        'Alívio imediato de tensões',
        'Melhora da flexibilidade',
        'Redução do estresse muscular',
        'Sensação de leveza e liberdade'
      ]}
      faq={[
        { q: 'Qual a diferença para uma massagem?', a: 'A terapia manual é clínica, focada em diagnosticar e tratar disfunções específicas do movimento através de manobras baseadas em anatomia e fisiologia.' },
      ]}
      metaTitle="Terapia Manual em SJC | Sport Health"
    />
  )
}
