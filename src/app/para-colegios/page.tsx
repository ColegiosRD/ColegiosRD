'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import Footer from '@/components/Footer';
import VerificationModal from '@/components/VerificationModal';
import AdModal from '@/components/AdModal';
import { Check, Zap, Calendar, Megaphone, ArrowRight } from 'lucide-react';

const plans = [
  {
    id: 'basico',
    name: 'Básico',
    description: 'Para colegios que comienzan',
    price: 'Gratis',
    color: 'from-[#6b7280] to-[#4b5563]',
    features: [
      'Perfil básico del colegio',
      'Información de contacto',
      'Horarios y niveles',
      'Acceso a 1 foto de portada',
      'Visibilidad en búsqueda',
    ],
    cta: 'Crear Perfil',
    highlighted: false,
  },
  {
    id: 'verificado',
    name: 'Verificado',
    description: 'Verifica tu colegio',
    price: 'Desde RD$0',
    color: 'from-[#059669] to-[#047857]',
    features: [
      'Todo del plan Básico',
      'Verificación de colegio',
      'Estadísticas de visualización',
      'Control de información',
      'Badge de verificado',
      'Contacto directo con padres',
      'Hasta 5 fotos',
    ],
    cta: 'Verificar Colegio',
    highlighted: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Recomendado para colegios activos',
    price: 'RD$2,999/mes',
    color: 'from-[#1e40af] to-[#1e3a8a]',
    features: [
      'Todo del plan Verificado',
      'Publicar eventos de Open House',
      'Galería de fotos ilimitada',
      'Video de presentación',
      'Analytics detallados',
      'Publicación de noticias',
      'Sugerencias de mejora',
      'Soporte prioritario',
    ],
    cta: 'Actualizar a Premium',
    highlighted: true,
  },
  {
    id: 'elite',
    name: 'Élite',
    description: 'Máxima visibilidad',
    price: 'RD$9,999/mes',
    color: 'from-[#b45309] to-[#92400e]',
    features: [
      'Todo del plan Premium',
      'Badge Élite exclusivo',
      'Posición destacada en ranking',
      'Publicidad personalizada',
      'Eventos Open House destacados',
      'Gestión de campus múltiples',
      'Reports mensuales profesionales',
      'Soporte VIP 24/7',
    ],
    cta: 'Contratar Élite',
    highlighted: false,
  },
];

const additionalServices = [
  {
    icon: <Calendar className="w-8 h-8" />,
    title: 'Open House Destacado',
    description: 'Destaca tu evento de puertas abiertas en la primera posición',
    price: 'RD$1,500',
  },
  {
    icon: <Megaphone className="w-8 h-8" />,
    title: 'Push a Padres Suscritos',
    description: 'Notificación directa a padres interesados en tu colegio',
    price: 'RD$2,000',
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Cobertura de Evento',
    description: 'Nuestro equipo cubre tu evento y crea contenido profesional',
    price: 'RD$5,000',
  },
];

export default function ParaColegiosPage() {
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1e40af] to-[#1e3a8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">Planes para Colegios</h1>
          <p className="text-[#93c5fd] text-lg max-w-2xl mx-auto">
            Elige el plan perfecto para llegar a miles de padres en búsqueda del mejor colegio para sus hijos.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 ${
                plan.highlighted ? 'ring-4 ring-[#f59e0b] scale-105 lg:scale-110' : ''
              }`}
            >
              {/* Header */}
              <div className={`bg-gradient-to-br ${plan.color} text-white p-8`}>
                {plan.highlighted && (
                  <span className="inline-block bg-[#f59e0b] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                    MÁS POPULAR
                  </span>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-white/80 text-sm mb-4">{plan.description}</p>
                <div className="text-3xl font-bold">{plan.price}</div>
              </div>

              {/* Features */}
              <div className="p-8 space-y-4">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                    <span className="text-[#475569] text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="p-8 pt-0">
                {plan.id === 'verificado' ? (
                  <button
                    onClick={() => setShowVerificationModal(true)}
                    className={`w-full py-3 px-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 ${
                      plan.highlighted
                        ? 'bg-[#f59e0b] text-white hover:bg-[#d97706]'
                        : 'bg-[#10b981] text-white hover:bg-[#059669]'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    className={`w-full py-3 px-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 ${
                      plan.highlighted
                        ? 'bg-[#f59e0b] text-white hover:bg-[#d97706]'
                        : 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Services */}
      <section className="bg-[#f8fafc] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0f172a] mb-4">Servicios Adicionales</h2>
            <p className="text-[#64748b] text-lg">Potencia tu presencia con servicios especiales</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {additionalServices.map((service, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-8 text-center space-y-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center text-[#2563eb]">{service.icon}</div>
                <h3 className="text-xl font-bold text-[#0f172a]">{service.title}</h3>
                <p className="text-[#64748b] text-sm">{service.description}</p>
                <div className="text-2xl font-bold text-[#f59e0b]">{service.price}</div>
                <button className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-2 rounded-lg transition-colors">
                  Solicitar
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Anunciate Section */}
      <section id="anunciate" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-[#1e40af] to-[#2563eb] rounded-lg p-12 text-white space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">Publicidad en ColegiosRD</h2>
            <p className="text-[#93c5fd] text-lg">
              Alcanza a miles de padres que buscan el mejor colegio para sus hijos con nuestras opciones de publicidad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-3">
              <h3 className="text-xl font-bold">Leaderboard (728x90 o 320x50)</h3>
              <p className="text-[#e0f2fe] text-sm">
                Ubicación premium en la parte superior de cada página. Máxima visibilidad.
              </p>
              <p className="text-2xl font-bold">RD$15,000/mes</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-3">
              <h3 className="text-xl font-bold">Rectangle (300x250 o 336x280)</h3>
              <p className="text-[#e0f2fe] text-sm">
                Ubicación lateral en páginas de ranking y perfil de colegios. Muy visible.
              </p>
              <p className="text-2xl font-bold">RD$12,000/mes</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-3">
              <h3 className="text-xl font-bold">Banner (970x250 o 970x90)</h3>
              <p className="text-[#e0f2fe] text-sm">
                Espacio premium entre secciones. Ideal para campañas de impacto.
              </p>
              <p className="text-2xl font-bold">RD$18,000/mes</p>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8">
            <button
              onClick={() => setShowAdModal(true)}
              className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold py-3 px-8 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              Solicitar Publicidad
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Verificar Section */}
      <section id="verificar" className="bg-[#f0fdf4] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-[#0f512f] mb-4">¿No está tu colegio verificado aún?</h2>
            <p className="text-[#0f512f]/70 text-lg max-w-2xl mx-auto">
              Verifica tu colegio ahora y accede a todas las ventajas de ser parte de ColegiosRD. Es rápido y fácil.
            </p>
          </div>

          <button
            onClick={() => setShowVerificationModal(true)}
            className="inline-block bg-[#047857] hover:bg-[#065f46] text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
          >
            Verificar Mi Colegio
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdBanner size="leaderboard" label="Espacio publicitario — Para Colegios" />
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {showVerificationModal && (
        <VerificationModal isOpen={showVerificationModal} onClose={() => setShowVerificationModal(false)} />
      )}
      {showAdModal && <AdModal isOpen={showAdModal} onClose={() => setShowAdModal(false)} />}
    </>
  );
}
