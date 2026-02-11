'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { BookingCalendarModal } from '@/components/ui/booking-calendar'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleOpenBooking = () => setCalendarOpen(true)
    window.addEventListener('open-booking', handleOpenBooking)
    return () => window.removeEventListener('open-booking', handleOpenBooking)
  }, [])

  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Sobre', href: '/sobre' },
    { name: 'Tratamentos', href: '/tratamentos' },
    { name: 'Para Atletas', href: '/servicos-para-atletas' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contato', href: '/contato' },
  ]

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Sport Health" width={120} height={40} className="h-10 w-auto" priority />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-sm font-medium text-gray-700 hover:text-[#0a4d2c] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Button
                onClick={() => setCalendarOpen(true)}
                className="bg-[#0a4d2c] hover:bg-[#083d23] text-white rounded-full px-6 flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Agendar
              </Button>
            </div>

            {/* Mobile Toggle */}
            <button className="md:hidden text-gray-700" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="flex flex-col p-4 space-y-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className="text-base font-medium text-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <Button
                  onClick={() => {
                    setIsOpen(false)
                    setCalendarOpen(true)
                  }}
                  className="bg-[#0a4d2c] hover:bg-[#083d23] w-full justify-center"
                >
                  Agendar Avaliação
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Booking Calendar Modal */}
      <BookingCalendarModal isOpen={calendarOpen} onClose={() => setCalendarOpen(false)} />
    </>
  )
}
