import { TreatmentLayout } from '@/components/TreatmentLayout'

export default function PosOpPage() {
  return (
    <TreatmentLayout 
      title="Pós-Operatório — reabilitação segura e eficaz"
      intro="Protocolos especializados para cirurgias de ombro, joelho, quadril e coluna. Acompanhamento rigoroso para garantir o sucesso da sua cirurgia."
      whenToSeek={[
        'Imediatamente após a alta hospitalar',
        'Dificuldade em realizar os movimentos orientados pelo cirurgião',
        'Dor persistente ou rigidez articular excessiva',
        'Desejo de acelerar a recuperação com segurança',
        'Dúvidas sobre o que pode ou não fazer após a cirurgia'
      ]}
      protocol={[
        'Gerenciamento de cicatriz e edema.',
        'Mobilização precoce controlada.',
        'Desmame de auxílios (muletas/tipoias) conforme protocolo.',
        'Fortalecimento progressivo e funcional.',
        'Testes de liberação para atividades de impacto.'
      ]}
      benefits={[
        'Redução de aderências e fibroses',
        'Ganho de amplitude precoce',
        'Segurança no processo de cura',
        'Máximo aproveitamento do ato cirúrgico'
      ]}
      faq={[
        { q: 'Quando devo começar a fisioterapia?', a: 'Geralmente entre 3 a 7 dias após a cirurgia, dependendo da orientação do seu cirurgião.' },
        { q: 'O Dr. Carlos fala com meu médico?', a: 'Sim, mantemos contato direto com os cirurgiões para alinhar as condutas e garantir total segurança.' }
      ]}
      metaTitle="Fisioterapia Pós-Operatória em SJC | Sport Health"
    />
  )
}
