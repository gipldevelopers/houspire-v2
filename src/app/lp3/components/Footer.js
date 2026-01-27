// src\app\lp3\components\Footer.js
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, MessageSquare, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="relative h-12 w-40">
                <Image
                  src="/logo_final.svg"
                  alt="Houspire - Professional Interior Design"
                  fill
                  className="object-contain"
                  priority={false}
                />
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              {/* India's premier transparent interior design planning service. 
              We transform spaces with precision, innovation, and complete transparency. */}
              India’s most transparent interior design service — giving every home clarity, confidence, and smart design decisions in days, not months.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-lg">Explore</h4>
            <ul className="space-y-3">
              {[
                { href: '#hero', label: 'Home' },
                { href: '#problem', label: 'The Problem' },
                { href: '#solution', label: 'Our Solution' },
                { href: '#deliverables', label: 'Deliverables' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span className="w-1 h-1 bg-gray-600 rounded-full mr-2 group-hover:bg-white transition-colors"></span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-lg">Resources</h4>
            <ul className="space-y-3">
              {[
                { href: '#pricing', label: 'Pricing' },
                { href: '#testimonials', label: 'Testimonials' },
                { href: '#faq', label: 'FAQ' },
                { href: '/legal/privacy', label: 'Privacy Policy', isLink: true },
              ].map((item) => (
                <li key={item.label}>
                  {item.isLink ? (
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center group"
                    >
                      <span className="w-1 h-1 bg-gray-600 rounded-full mr-2 group-hover:bg-white transition-colors"></span>
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center group"
                    >
                      <span className="w-1 h-1 bg-gray-600 rounded-full mr-2 group-hover:bg-white transition-colors"></span>
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-lg">Get in Touch</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://wa.me/917075827625?text=Hi,%20I'm%20interested%20in%20Houspire's%20interior%20design%20services"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 group"
                >
                  <div className="p-2 bg-green-900/20 rounded-lg group-hover:bg-green-900/40 transition-colors">
                    {/* WhatsApp icon from Lucide */}
                    <svg 
                      className="w-4 h-4 text-green-400" 
                      fill="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
                    </svg>
                  </div>
                  <span className="text-sm">WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@houspire.ai"
                  className="inline-flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 group"
                >
                  <div className="p-2 bg-blue-900/20 rounded-lg group-hover:bg-blue-900/40 transition-colors">
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-sm">hello@houspire.ai</span>
                </a>
              </li>
              {/* <li>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 group"
                >
                  <div className="p-2 bg-purple-900/20 rounded-lg group-hover:bg-purple-900/40 transition-colors">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-sm">Contact Form</span>
                </a>
              </li> */}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-500 text-sm">
                {/* © {currentYear} Houspire Technologies. All rights reserved. */}
                © {currentYear} Armishq Design Private limited. All rights reserved.
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Crafted with precision in India 🇮🇳
              </p>
            </div>

            {/* Powered by Gohil Infotech - Improved Design */}
            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="text-gray-500 text-xs font-medium tracking-wide">
                POWERED BY
              </div>
              
              <a
                href="https://www.gohilinfotech.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-gradient-to-r from-gray-800/50 to-gray-800/30 hover:from-gray-800 hover:to-gray-700/50 rounded-xl px-5 py-3 transition-all duration-300 border border-gray-700 hover:border-gray-600 hover:shadow-lg hover:shadow-blue-900/10"
              >
                {/* Logo Container */}
                <div className="relative h-7 w-28">
                  <Image
                    src="/gipl.png"
                    alt="Gohil Infotech - Technology Solutions"
                    fill
                    className="object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                    priority={false}
                  />
                </div>
                
                {/* Vertical Separator */}
                <div className="h-8 w-px bg-gradient-to-b from-gray-700 via-gray-600 to-gray-700"></div>
                
                {/* Text Content */}
                <div className="flex flex-col items-start">
                  <div className="text-white text-sm font-semibold tracking-tight group-hover:text-blue-300 transition-colors">
                    GOHIL INFOTECH
                  </div>
                  <div className="text-gray-400 text-xs font-medium tracking-wide">
                    Technology Solutions
                  </div>
                </div>
                
                {/* External link indicator - Using Lucide ArrowUpRight */}
                <div className="ml-2 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <div className="p-1.5 bg-blue-900/30 rounded-lg group-hover:bg-blue-900/50 transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};