'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { School, OpenHouseEvent } from '@/lib/types';
import SchoolCard from '@/components/SchoolCard';
import AdBanner from '@/components/AdBanner';
import Footer from '@/components/Footer';
import VerificationModal from '@/components/VerificationModal';
import AdModal from '@/components/AdModal';
import { Search, TrendingUp, Building2, Calendar } from 'lucide-react';

export default function Home() {
  const [topSchools, setTopSchools] = useState<School[]>([]);
  const [publicSchools, setPublicSchools] = useState<School[]>([]);
  const [openHouseEvents, setOpenHouseEvents] = useState<OpenHouseEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch top schools
        const { data: schools, error: schoolError } = await supabase
          .from('schools')
          .select('*, province:provinces(*)')
          .eq('subscription_tier', 'elite')
          .order('rating', { ascending: false })
          .limit(6);

        if (!schoolError && schools) {
          setTopSchools(schools as School[]);
        }

        // Fetch top public schools
        const { data: publicSchoolsData, error: publicError } = await supabase
          .from('schools')
          .select('*, province:provinces(*)')
          .eq('type', 'Público')
          .eq('is_top_public', true)
          .order('rating', { ascending: false })
          .limit(4);

        if (!publicError && publicSchoolsData) {
          setPublicSchools(publicSchoolsData as School[]);
        }

        // Fetch upcoming open house events
        const { data: events, error: eventError } = await supabase
          .from('open_house_events')
          .select('*, school:schools(*, province:provinces(*))')
          .gte('event_date', new Date().toISOString().split('T')[0])
          .order('event_date', { ascending: true })
          .limit(4);

        if (!eventError && events) {
          setOpenHouseEvents(events as OpenHouseEvent[]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Could redirect to ranking page with search query
      // For now, just log it
      console.log('Search:', searchQuery);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a365d] via-[#1e40af] to-[#2563eb] text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Encuentra el mejor colegio para tu hijo en RD
            </h1>

            <p className="text-lg md:text-xl text-[#93c5fd] leading-relaxed">
              Rankings basados en datos oficiales del MINERD. Compara colegios privados y públicos por calidad académica,
              infraestructura, costos y más.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                <input
                  type="text"
                  placeholder="Busca un colegio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold rounded-lg transition-colors whitespace-nowrap"
              >
                Buscar
              </button>
            </form>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl md:text-4xl font-bold">500+</div>
                <p className="text-[#93c5fd] mt-2">Colegios Verificados</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl md:text-4xl font-bold">100%</div>
                <p className="text-[#93c5fd] mt-2">Datos Oficiales MINERD</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl md:text-4xl font-bold">50K+</div>
                <p className="text-[#93c5fd] mt-2">Padres Activos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Banner - Leaderboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdBanner size="leaderboard" label="Espacio publicitario" />
      </div>

      {/* Top Schools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-[#2563eb]" />
              <h2 className="text-3xl font-bold text-[#0f172a]">Colegios Elite 2026</h2>
            </div>
            <Link
              href="/ranking"
              className="text-[#2563eb] hover:text-[#1e40af] font-semibold flex items-center space-x-2"
            >
              <span>Ver ranking completo</span>
              <span>→</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-300 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : topSchools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topSchools.map((school) => (
                <SchoolCard key={school.id} school={school} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#64748b]">No hay colegios disponibles</div>
          )}
        </div>
      </section>

      {/* Orgullo Público Section */}
      <section className="bg-gradient-to-r from-[#065f46] to-[#047857] text-white py-16 my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="w-8 h-8" />
              <h2 className="text-3xl font-bold">Orgullo Público</h2>
            </div>
            <Link
              href="/orgullo-publico"
              className="text-white hover:text-[#d1fae5] font-semibold flex items-center space-x-2"
            >
              <span>Ver todos</span>
              <span>→</span>
            </Link>
          </div>

          <p className="text-lg text-[#d1fae5] max-w-2xl">La excelencia en la educación pública dominicana</p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-white/20 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : publicSchools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {publicSchools.map((school, idx) => (
                <Link
                  key={school.id}
                  href={`/school/${school.slug}`}
                  className="bg-white/10 hover:bg-white/20 rounded-lg p-6 transition-colors border border-white/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-2xl font-bold">#{idx + 1}</div>
                      <h3 className="text-xl font-semibold mt-2">{school.name}</h3>
                      <p className="text-[#d1fae5] text-sm mt-1">{school.province?.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{school.rating || 'N/A'}</div>
                      <p className="text-xs text-[#d1fae5]">Calificación</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#d1fae5]">No hay colegios públicos destacados</div>
          )}
        </div>
      </section>

      {/* Ad Banner - Mid Page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdBanner size="leaderboard" label="Espacio publicitario" />
      </div>

      {/* Open House Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-[#b45309]" />
              <h2 className="text-3xl font-bold text-[#0f172a]">Calendario de Open House</h2>
            </div>
            <Link
              href="/openhouse"
              className="text-[#b45309] hover:text-[#92400e] font-semibold flex items-center space-x-2"
            >
              <span>Ver calendario completo</span>
              <span>→</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : openHouseEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {openHouseEvents.map((event) => (
                <div
                  key={event.id}
                  className={`rounded-lg p-6 border-2 ${
                    event.is_featured ? 'border-[#f59e0b] bg-[#fffbeb]' : 'border-[#e5e7eb] bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-[#0f172a]">{event.school?.name}</h3>
                      <p className="text-[#64748b] text-sm mt-1">{event.school?.province?.name}</p>
                      <div className="mt-3 space-y-1">
                        <p className="text-sm font-semibold text-[#0f172a]">
                          {new Date(event.event_date).toLocaleDateString('es-DO', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        {event.start_time && (
                          <p className="text-xs text-[#64748b]">
                            {event.start_time}
                            {event.end_time && ` - ${event.end_time}`}
                          </p>
                        )}
                      </div>
                    </div>
                    {event.is_featured && (
                      <span className="bg-[#f59e0b] text-white text-xs font-bold px-2 py-1 rounded">
                        Destacado
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#64748b]">No hay eventos próximos</div>
          )}
        </div>
      </section>

      {/* CTA Section for Schools */}
      <section className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white py-16 my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Eres un colegio?</h2>
            <p className="text-[#93c5fd] text-lg mb-8">
              Verifica tu colegio, accede a planes premium y llega a miles de padres en búsqueda de la mejor educación para
              sus hijos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowVerificationModal(true)}
                className="px-8 py-3 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-lg transition-colors"
              >
                Verificar Mi Colegio
              </button>
              <button
                onClick={() => setShowAdModal(true)}
                className="px-8 py-3 border-2 border-white hover:bg-white hover:text-[#1e40af] text-white font-bold rounded-lg transition-colors"
              >
                Anúnciate
              </button>
            </div>
          </div>
        </div>
      </section>

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
