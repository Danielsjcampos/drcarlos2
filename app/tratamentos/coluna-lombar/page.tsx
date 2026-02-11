import { TreatmentLayout } from '@/components/TreatmentLayout'

export const metadata = {
  title: "Tratamento dor lombar em São José dos Campos | Sport Health — Especialista em Coluna",
  description: "Tratamento especializado para dor lombar e hérnia de disco em SJC. Alívio de crises e fortalecimento da coluna.",
}

export default function LombarPage() {
  return (
    <TreatmentLayout 
      title="Dor lombar — tratamento e prevenção especializada"
      intro="Tratamos dor lombar com programas que combinam terapia manual, exercícios terapêuticos e educação postural para reduzir crises e melhorar sua qualidade de vida."
      whenToSeek={[
        'Dor que irradia para as pernas (ciático)',
        'Dificuldade para ficar em pé ou sentado por muito tempo',
        'Rigidez matinal intensa na coluna',
        'Formigamento nos pés ou fraqueza nas pernas',
        'Crises de dor que te deixam "travado"'
      ]}
      protocol={[
        'Avaliação clínica detalhada da biomecânica da coluna.',
        'Alívio da dor com modalidades manuais e quiropraxia.',
        'Fortalecimento e estabilização (Core training).',
        'Reeducação postural e educação sobre dor.',
        'Plano de exercícios preventivos para casa.'
      ]}
      benefits={[
        'Redução de crises agudas',
        'Melhora da postura',
        'Fortalecimento do "core"',
        'Independência funcional'
      ]}
      faq={[
        { q: 'Tenho hérnia de disco, tem solução?', a: 'Com certeza. A maioria das hérnias de disco são assintomáticas após um bom programa de fortalecimento e estabilização.' },
        { q: 'O tratamento dói?', a: 'As técnicas são aplicadas respeitando seu limite de dor, focando sempre no alívio e conforto.' },
      ]}
      metaTitle="Tratamento dor lombar em São José dos Campos | Sport Health"
    />
  )
}
