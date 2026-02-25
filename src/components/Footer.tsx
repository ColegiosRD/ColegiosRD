'use client';

import Link from 'next/link';
import { GraduationCap, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] text-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 font-bold text-lg">
              <GraduationCap className="w-6 h-6 text-[#2563eb]" />
              <span>ColegiosRD.com</span>
            </div>
            <p className="text-[#93c5fd] text-sm leading-relaxed">
              La plataforma más completa para buscar, comparar y conocer colegios en República Dominicana.
            </p>
          </div>

          {/* Column 2: Para Padres */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Para Padres</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ranking" className="text-[#93c5fd] hover:text-white text-sm transition-colors">
                  Ranking
                </Link>
              </li>
              <li>
                <Link href="/top-publicos" className="text-[#93c5fd] hover:text-white text-sm transition-colors">
                  Top Públicos
                </Link>
              </li>
              <li>
                <Link href="/open-house" className="text-[#93c5fd] hover:text-white text-sm transition-colors">
                  Open House
                </Link>
              </li>
              <li>
                <Link href="/newsletter" className="text-[#93c5fd] hover:text-white text-sm transition-colors flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Newsletter</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Para Colegios */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Para Colegios</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/para-colegios#verificar" className="text-[#93c5fd] hover:text-white text-sm transition-colors">
                  Verificar Colegio
                </Link>
              </li>
              <li>
                <Link href="/para-colegios#planes" className="text-[#93c5fd] hover:text-white text-sm transition-colors">
                  Planes
                </Link>
              </li>
              <li>
                <Link href="/para-colegios#open-house" className="text-[#93c5fd] hover:text-white text-sm transition-colors">
                  Publicar Open House
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Empresa */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/para-colegios#anunciate" className="text-[#93c5fd] hover:text-white text-sm transition-colors">
                  Anúnciate
                </Link>
              </li>
              <li>
                <Link href="/metodologia" className="text-[#93c5fd] hover:text-white text-sm transition-colors">
                  Metodología
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-[#93c5fd] hover:text-white text-sm transition-colors">
                  Términos
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-[#93c5fd] hover:text-white text-sm transition-colors">
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="text-[#93c5fd] text-sm">
              © {currentYear} ColegiosRD.com. Todos los derechos reservados.
            </p>
            <p className="text-[#93c5fd] text-sm font-medium">
              Datos oficiales: MINERD
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
