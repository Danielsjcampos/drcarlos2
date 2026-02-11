import { TreatmentLayout } from '@/components/TreatmentLayout'

export const metadata = {
  title: "Reabilitação de Joelho em SJC | Sport Health — Retorno ao Esporte",
  description: "Tratamento para lesões de menisco, ligamento (LCA) e artrose no joelho em São José dos Campos.",
}

export default function JoelhoPage() {
  return (
    <TreatmentLayout 
      title="Reabilitação de Joelho — força e estabilidade"
      intro="Recuperação completa para lesões ligamentares, meniscais e degenerativas, focando no retorno seguro às atividades físicas."
      whenToSeek={[
        'Falseio ou sensação de instabilidade',
        'Inchaço recorrente após exercícios',
        'Dor ao subir ou descer escadas',
        'Bloqueio articular ou estalos dolorosos',
        'Perda de força na coxa (quadríceps)'
      ]}
      protocol={[
        'Avaliação da estabilidade articular e força muscular.',
        'Controle de processo inflamatório e dor.',
        'Ganho de amplitude de movimento e ativação muscular.',
        'Treino de propriocepção e controle motor.',
        'Transição para o esporte com testes de carga.'
      ]}
      benefits={[
        'Estabilidade recuperada',
        'Fim do inchaço',
        'Confiança para saltar e correr',
        'Prevenção de novas lesões'
      ]}
      faq={[
        { q: 'Rompi o LCA, preciso operar?', a: 'Nem todos os casos de ruptura de LCA são cirúrgicos. Uma boa reabilitação pode estabilizar o joelho para atividades de vida diária e até esportes sem giro.' },
        { q: 'Quanto tempo dura a sessão?', a: 'As sessões duram cerca de 60 minutos, sendo 100% acompanhadas pelo fisioterapeuta.' }
      ]}
      metaTitle="Reabilitação de Joelho em SJC | Sport Health"
    />
  )
}
