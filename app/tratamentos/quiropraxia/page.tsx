import { TreatmentLayout } from '@/components/TreatmentLayout'

export default function QuiropraxiaPage() {
  return (
    <TreatmentLayout 
      title="Quiropraxia — alinhamento e função"
      intro="Ajustes articulares precisos para melhorar a comunicação do sistema nervoso e a mobilidade da coluna e extremidades."
      whenToSeek={[
        'Estalos ou bloqueios na coluna',
        'Dores de cabeça tensionais',
        'Sensação de compressão ou desalinhamento',
        'Limitação de rotação do pescoço ou tronco',
        'Prevenção de lesões e manutenção da saúde'
      ]}
      protocol={[
        'Rastreio de subluxações e bloqueios articulares.',
        'Testes de força e reflexos.',
        'Ajustes manuais (High Velocity, Low Amplitude).',
        'Uso de instrumentos de auxílio (Activator).',
        'Orientações de ergonomia e postura.'
      ]}
      benefits={[
        'Melhora da mobilidade da coluna',
        'Alívio de dores irradiadas',
        'Aumento da disposição',
        'Melhora no funcionamento do sistema nervoso'
      ]}
      faq={[
        { q: 'Quiropraxia é perigosa?', a: 'Quando realizada por um profissional qualificado (como fisioterapeuta com pós em quiropraxia), é extremamente segura e eficaz.' },
        { q: 'Aquele "estalo" é o osso no lugar?', a: 'Não, o som é apenas a liberação de gases dentro da articulação (cavitação) devido à mudança de pressão.' }
      ]}
      metaTitle="Quiropraxia em São José dos Campos | Sport Health"
    />
  )
}
