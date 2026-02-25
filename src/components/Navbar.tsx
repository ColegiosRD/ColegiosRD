'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/ranking', label: 'Ranking' },
    { href: '/top-publicos', label: 'Top Públicos' },
    { href: '/open-house', label: 'Open House' },
    { href: '/para-colegios', label: 'Para Colegios' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#1a365d] to-[#2563eb] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
            <GraduationCap className="w-6 h-6" />
            <span>ColegiosRD</span>
            <span className="bg-[#2563eb] px-2 py-0.5 rounded text-xs font-semibold">.com</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-[#93c5fd] border-b-2 border-[#93c5fd]'
                    : 'text-white hover:text-[#93c5fd]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/para-colegios#anunciate"
              className="px-4 py-2 border-2 border-white rounded-lg text-sm font-medium hover:bg-white hover:text-[#1a365d] transition-colors"
            >
              Anúnciate
            </Link>
            <Link
              href="/para-colegios#verificar"
              className="px-4 py-2 bg-[#f59e0b] rounded-lg text-sm font-medium text-white hover:bg-[#d97706] transition-colors"
            >
              Verificar Mi Colegio
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 rounded text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-[#2563eb] text-[#93c5fd]'
                    : 'text-white hover:bg-[#1a365d]'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 space-y-2 pt-2 border-t border-[#93c5fd]">
              <Link
                href="/para-colegios#anunciate"
                className="block px-4 py-2 border-2 border-white rounded-lg text-sm font-medium text-center hover:bg-white hover:text-[#1a365d] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Anúnciate
              </Link>
              <Link
                href="/para-colegios#verificar"
                className="block px-4 py-2 bg-[#f59e0b] rounded-lg text-sm font-medium text-white text-center hover:bg-[#d97706] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Verificar Mi Colegio
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
