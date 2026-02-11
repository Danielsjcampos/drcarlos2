import { TreatmentLayout } from '@/components/TreatmentLayout'

export default function LesoesPage() {
  return (
    <TreatmentLayout 
      title="Lesões Esportivas — do amador ao profissional"
      intro="Tratamento especializado para entorses, estiramentos e contusões. Foco em reduzir o tempo de afastamento e otimizar a performance."
      whenToSeek={[
        'Dor súbita durante a prática esportiva',
        'Hematomas ou inchaços imediatos',
        'Dificuldade em apoiar o membro ou realizar o gesto esportivo',
        'Dores que surgem sempre após o treino',
        'Queda brusca de rendimento por desconforto'
      ]}
      protocol={[
        'Diagnóstico cinético-funcional preciso da lesão.',
        'Manejo de tecidos moles e controle de carga.',
        'Fortalecimento específico para o gesto esportivo.',
        'Simulação de situações de jogo/competição.',
        'Planejamento de prevenção e monitoramento.'
      ]}
      benefits={[
        'Retorno acelerado ao esporte',
        'Melhora da técnica e biomecânica',
        'Redução do risco de novas lesões',
        'Aumento da consciência corporal'
      ]}
      faq={[
        { q: 'Quanto tempo vou ficar parado?', a: 'Nosso objetivo é te manter ativo. Se não puder praticar seu esporte principal, adaptaremos treinos auxiliares para manter seu condicionamento.' },
        { q: 'Atendem todas as modalidades?', a: 'Sim, temos experiência com basquete, corrida, crossfit, futebol, tênis e esportes de combate.' }
      ]}
      metaTitle="Lesões Esportivas tratamento SJC | Sport Health"
    />
  )
}
