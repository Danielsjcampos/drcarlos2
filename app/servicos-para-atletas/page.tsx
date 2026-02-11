import React from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AtletasContent } from '@/components/sections/AtletasContent'

export default function AtletasPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <AtletasContent />

      <Footer />
    </div>
  )
}
