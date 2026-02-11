import React from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ContactPageContent } from '@/components/sections/ContactPageContent'

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <ContactPageContent />

      {/* Map Placeholder */}
      <section className="h-[400px] w-full bg-gray-200">
        <div className="w-full h-full flex items-center justify-center text-gray-500 font-outfit font-bold">
          [ Google Maps: Sport Health - Dr. Carlos Prado ]
        </div>
      </section>

      <Footer />
    </div>
  )
}
