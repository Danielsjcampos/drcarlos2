import { TreatmentLayout } from '@/components/TreatmentLayout'

export default function VentosaPage() {
  return (
    <TreatmentLayout 
      title="Ventosaterapia — recuperação e circulação"
      intro="Técnica milenar que utiliza a sucção para liberar fáscias, melhorar a circulação sanguínea e acelerar a recuperação muscular."
      whenToSeek={[
        'Dor muscular após treinos intensos',
        'Tensões persistentes nas costas',
        'Sensação de fadiga muscular crônica',
        'Pescoço "travado" ou ombros pesados',
        'Necessidade de acelerar o recovery pós-prova'
      ]}
      protocol={[
        'Localização das áreas de maior congestão muscular.',
        'Aplicação de ventosas pneumáticas ou de vidro.',
        'Ventosaterapia deslizante ou fixa.',
        'Associação com calor ou liberação manual.',
        'Orientações pós-aplicação.'
      ]}
      benefits={[
        'Melhora da circulação local',
        'Eliminação de metabólitos (toxinas)',
        'Relaxamento muscular profundo',
        'Melhora da oxigenação dos tecidos'
      ]}
      faq={[
        { q: 'As marcas ficam por quanto tempo?', a: 'As marcas circulares (hematomas superficiais) duram geralmente entre 3 a 7 dias, variando conforme a circulação do paciente.' },
      ]}
      metaTitle="Ventosaterapia em SJC | Sport Health"
    />
  )
}
