import React from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { SobreContent } from '@/components/sections/SobreContent'

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <SobreContent />

      <Footer />
    </div>
  )
}
