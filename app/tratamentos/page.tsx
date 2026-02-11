import React from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { TreatmentsPageContent } from '@/components/sections/TreatmentsPageContent'

export default function TreatmentsIndex() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <TreatmentsPageContent />

      <Footer />
    </div>
  )
}
