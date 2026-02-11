import React from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { TreatmentPageClient } from '@/components/sections/TreatmentPageClient'

interface TreatmentPageProps {
  title: string
  intro: string
  whenToSeek: string[]
  protocol: string[]
  benefits: string[]
  faq: { q: string, a: string }[]
  metaTitle: string
}

export function TreatmentLayout(props: TreatmentPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <TreatmentPageClient {...props} />
      <Footer />
    </div>
  )
}
