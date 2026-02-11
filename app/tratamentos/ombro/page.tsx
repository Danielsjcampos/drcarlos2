import { TreatmentLayout } from '@/components/TreatmentLayout'

export const metadata = {
  title: "Tratamento dor no ombro em São José dos Campos | Sport Health — Alívio e reabilitação",
  description: "Especialista em reabilitação de ombro em SJC. Tratamento para dor ao levantar o braço, estalos e limitação de movimento.",
}

export default function OmbroPage() {
  return (
    <TreatmentLayout 
      title="Tratamento para dor no ombro — reabilitação e recuperação funcional"
      intro="A dor no ombro limita o trabalho, o treino e atividades diárias. Aqui usamos avaliação funcional, terapias manuais e exercícios específicos para reduzir dor e recuperar função."
      whenToSeek={[
        'Dor ao levantar o braço ou carregar peso',
        'Estalos e sensação de instabilidade',
        'Fraqueza no braço ou ombro',
        'Sono prejudicado pela dor',
        'Limitação para esportes de arremesso ou impacto'
      ]}
      protocol={[
        'Avaliação postural e funcional + exames clínicos.',
        'Terapia manual (mobilização articular) para recuperar amplitude.',
        'Bandagem elástica e treino de controle motor.',
        'Reforço progressivo e retorno ao esporte com plano personalizado.',
        'Reavaliação e prevenção.'
      ]}
      benefits={[
        'Alívio imediato da dor',
        'Ganho de mobilidade',
        'Retorno seguro ao treino',
        'Prevenção de recidivas'
      ]}
      faq={[
        { q: 'Preciso de cirurgia para dor no ombro?', a: 'A grande maioria dos casos responde muito bem ao tratamento conservador com fisioterapia especializada, evitando a necessidade de intervenção cirúrgica.' },
        { q: 'Quanto tempo dura o tratamento?', a: 'Depende da lesão, mas em média de 4 a 8 semanas para uma melhora significativa da função.' },
        { q: 'Posso treinar durante o tratamento?', a: 'Sim, adaptamos sua planilha de treino para manter sua performance enquanto tratamos a lesão.' }
      ]}
      metaTitle="Tratamento dor no ombro em São José dos Campos | Sport Health"
    />
  )
}
