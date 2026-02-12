"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
} from "lucide-react";
import { FooterBackgroundGradient, TextHoverEffect } from "@/components/ui/hover-footer";

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const footerLinks = [
    {
      title: "Tratamentos",
      links: [
        { label: "Dor no Ombro", href: "/tratamentos/ombro" },
        { label: "Coluna Lombar", href: "/tratamentos/coluna-lombar" },
        { label: "Reabilitação de Joelho", href: "/tratamentos/joelho" },
        { label: "Lesões Esportivas", href: "/tratamentos/lesoes-esportivas" },
        { label: "Pós-Operatório", href: "/tratamentos/pos-operatorio" },
      ],
    },
    {
      title: "Links Rápidos",
      links: [
        { label: "Sobre o Dr. Carlos", href: "/sobre" },
        { label: "Serviços para Atletas", href: "/servicos-para-atletas" },
        { label: "Blog & News", href: "/blog" },
        { label: "Política de Privacidade", href: "/politica-privacidade" },
        { label: "Área do Admin", href: "/login" },
      ],
    },
  ];

  const contactInfo = [
    {
      icon: <Mail size={18} className="text-[#22c55e]" />,
      text: "contato@sporthealthsjc.com.br",
      href: "mailto:contato@sporthealthsjc.com.br",
    },
    {
      icon: <Phone size={18} className="text-[#22c55e]" />,
      text: "(12) 99715-0819",
      href: "tel:+5512997150819",
    },
    {
      icon: <MapPin size={18} className="text-[#22c55e]" />,
      text: "São José dos Campos - SP",
    },
  ];

  const socialLinks = [
    { icon: <Instagram size={20} />, label: "Instagram", href: "https://instagram.com" },
    { icon: <Facebook size={20} />, label: "Facebook", href: "https://facebook.com" },
  ];

  return (
    <footer className="bg-[#0F0F11] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-14 pt-16 pb-8 z-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16 pb-12">
          {/* Brand section */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center">
              <Image src="/logo.svg" alt="Sport Health" width={120} height={40} className="h-10 w-auto brightness-0 invert" />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Fisioterapia de alto rendimento para todos. Dr. Carlos Prado — Especialista em Ortopedia e Esporte.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2.5 bg-white/5 rounded-full hover:bg-[#22c55e] transition-colors text-gray-400 hover:text-white"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white text-lg font-bold font-outfit mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-[#22c55e] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div>
            <h4 className="text-white text-lg font-bold font-outfit mb-6">
              Contato
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm text-gray-400 hover:text-[#22c55e] transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400 hover:text-[#22c55e] transition-colors">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-t border-gray-800 my-8" />

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0">
          <div className="flex space-x-6 text-gray-500">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={`bottom-${label}`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="hover:text-[#22c55e] transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
          <p className="text-gray-500 text-center md:text-left" suppressHydrationWarning>
            © {year ?? 2026} Sport Health — Dr. Carlos Prado. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Text hover effect — desktop only, properly contained */}
      <div className="lg:block hidden relative h-48 -mt-20 overflow-hidden">
        <TextHoverEffect text="SPORT" className="z-50" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}

export default Footer;
