import { TreatmentLayout } from '@/components/TreatmentLayout'

export const metadata = {
  title: "Fascite plantar e dor no pé em SJC | Sport Health — Fisioterapia Especializada",
  description: "Tratamento para fascite plantar e dores nos pés em São José dos Campos. Retorne à corrida sem dor.",
}

export default function FascitePage() {
  return (
    <TreatmentLayout 
      title="Fascite plantar — alívio da dor e retorno à corrida"
      intro="Tratamentos com terapia manual, alongamentos específicos, exercícios intrínsecos do pé e órteses quando necessário para eliminar a dor na sola do pé."
      whenToSeek={[
        'Dor intensa no primeiro passo ao acordar',
        'Dor na sola do pé após longos períodos em pé',
        'Sensação de queimação no calcanhar',
        'Dor que piora após a prática de exercícios',
        'Limitação para correr ou caminhar'
      ]}
      protocol={[
        'Análise da pisada e biomecânica da marcha.',
        'Terapia manual e liberação miofascial da planta do pé.',
        'Fortalecimento da musculatura intrínseca do pé e panturrilha.',
        'Ajuste de calçados e/ou prescrição de palmilhas.',
        'Protocolo de retorno gradual à corrida.'
      ]}
      benefits={[
        'Fim da dor ao acordar',
        'Retorno seguro à corrida',
        'Melhora da biomecânica',
        'Conforto para o dia a dia'
      ]}
      faq={[
        { q: 'Palmilha resolve o problema?', a: 'A palmilha é uma ferramenta auxiliar, mas o tratamento mais eficaz envolve o fortalecimento muscular e a melhora da elasticidade.' },
        { q: 'Quanto tempo para voltar a correr?', a: 'Depende do grau da inflamação, mas geralmente iniciamos o trote leve após 2 a 3 semanas de tratamento.' }
      ]}
      metaTitle="Fascite plantar tratamento SJC | Sport Health"
    />
  )
}
