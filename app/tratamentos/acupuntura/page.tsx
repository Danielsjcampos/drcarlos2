import { TreatmentLayout } from '@/components/TreatmentLayout'

export default function AcupunturaPage() {
  return (
    <TreatmentLayout 
      title="Acupuntura — equilíbrio e controle da dor"
      intro="Uso de agulhas e estimulação de pontos específicos para modulação da dor, controle de inflamação e relaxamento muscular."
      whenToSeek={[
        'Dores crônicas que não cedem a remédios',
        'Processos inflamatórios agudos',
        'Ansiedade e distúrbios do sono associados à dor',
        'Desejo de tratamento sem fármacos',
        'Recuperação sistêmica após grandes esforços'
      ]}
      protocol={[
        'Diagnóstico energético e clínico.',
        'Inserção de agulhas estéreis em pontos-chave.',
        'Eventual uso de eletroacupuntura (tônus/analgesia).',
        'Tempo de repouso para modulação neural.',
        'Associação com outras técnicas de fisioterapia.'
      ]}
      benefits={[
        'Analgesia potente sem efeitos colaterais',
        'Redução do estresse e ansiedade',
        'Melhora da circulação local',
        'Aceleração da cura tecidual'
      ]}
      faq={[
        { q: 'Dói colocar as agulhas?', a: 'As agulhas são extremamente finas. A maioria dos pacientes sente apenas uma leve pressão ou formigamento momentâneo.' },
        { q: 'Quantas sessões são necessárias?', a: 'Geralmente notamos melhora significativa entre a 3ª e 5ª sessão.' }
      ]}
      metaTitle="Acupuntura para dor em SJC | Sport Health"
    />
  )
}
