import { TreatmentLayout } from '@/components/TreatmentLayout'

export default function BandagemPage() {
  return (
    <TreatmentLayout 
      title="Bandagem Elástica — suporte funcional"
      intro="Uso de fitas elásticas (Kinesio Tapping) para auxílio na percepção corporal, suporte articular e redução de edemas sem limitar o movimento."
      whenToSeek={[
        'Instabilidade articular leve',
        'Dor durante movimentos específicos',
        'Inchaços localizados',
        'Necessidade de estímulo proprioceptivo',
        'Suporte extra para competições'
      ]}
      protocol={[
        'Avaliação da função muscular e articular.',
        'Escolha da técnica de aplicação (estímulo ou inibição).',
        'Aplicação da bandagem com a tensão correta.',
        'Testagem do movimento após a aplicação.',
        'Indicação de tempo de permanência da fita.'
      ]}
      benefits={[
        'Suporte articular sem restrição',
        'Melhora do controle motor',
        'Redução imediata de dor leve',
        'Auxílio na drenagem de edemas'
      ]}
      faq={[
        { q: 'Posso tomar banho com a fita?', a: 'Sim, a bandagem é resistente à água e pode permanecer na pele por 3 a 5 dias.' },
      ]}
      metaTitle="Bandagem Elástica e Kinesiotaping SJC | Sport Health"
    />
  )
}
