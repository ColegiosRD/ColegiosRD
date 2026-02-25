'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { School, OpenHouseEvent } from '@/lib/types';
import RatingCircle from '@/components/RatingCircle';
import AdBanner from '@/components/AdBanner';
import Footer from '@/components/Footer';
import { formatTuition } from '@/lib/utils';
import { Phone, Mail, Globe, Users, BookOpen, DollarSign, Zap, Check, Lock, Award, Share2 } from 'lucide-react';

export default function SchoolPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [school, setSchool] = useState<School | null>(null);
  const [openHouseEvents, setOpenHouseEvents] = useState<OpenHouseEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        setLoading(true);

        // Fetch school by slug
        const { data: schoolData, error: schoolError } = await supabase
          .from('schools')
          .select('*, province:provinces(*)')
          .eq('slug', slug)
          .single();

        if (!schoolError && schoolData) {
          setSchool(schoolData as School);

          // Log view
          await supabase.from('school_views').insert({
            school_id: schoolData.id,
            viewed_at: new Date().toISOString(),
          });

          // Fetch open house events for this school
          const { data: events } = await supabase
            .from('open_house_events')
            .select('*')
            .eq('school_id', schoolData.id)
            .gte('event_date', new Date().toISOString().split('T')[0])
            .order('event_date', { ascending: true });

          if (events) {
            setOpenHouseEvents(events as OpenHouseEvent[]);
          }
        }
      } catch (error) {
        console.error('Error fetching school:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#e2e8f0] border-t-[#2563eb] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#64748b]">Cargando información del colegio...</p>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#0f172a] mb-4">Colegio no encontrado</h1>
            <p className="text-[#64748b] mb-8">El colegio que buscas no existe en nuestra base de datos.</p>
            <Link href="/ranking" className="text-[#2563eb] hover:text-[#1e40af] font-semibold">
              Volver al ranking
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Determine gradient colors based on subscription tier
  const getHeroGradient = () => {
    switch (school.subscription_tier) {
      case 'elite':
        return 'from-[#b45309] to-[#f59e0b]';
      case 'premium':
        return 'from-[#1e40af] to-[#2563eb]';
      case 'verificado':
        return 'from-[#059669] to-[#10b981]';
      default:
        return 'from-[#1a365d] to-[#475569]';
    }
  };

  const statCards = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      label: 'Prueba Nacional Promedio',
      value: school.prueba_nacional ? `${school.prueba_nacional.toFixed(1)}` : 'N/A',
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Estudiantes por Clase',
      value: school.students_per_class ? `${school.students_per_class}` : 'N/A',
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Matrícula Total',
      value: school.enrollment ? `${school.enrollment.toLocaleString()}` : 'N/A',
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      label: 'Costo de Matrícula',
      value: formatTuition(school.tuition_min, school.tuition_max),
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className={`bg-gradient-to-br ${getHeroGradient()} text-white py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {school.verification_status === 'verified' && (
                  <span className="bg-[#10b981] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Verificado
                  </span>
                )}
                {school.subscription_tier === 'premium' && (
                  <span className="bg-[#2563eb] text-white text-xs font-bold px-3 py-1 rounded-full">Premium</span>
                )}
                {school.subscription_tier === 'elite' && (
                  <span className="bg-[#f59e0b] text-white text-xs font-bold px-3 py-1 rounded-full">Élite</span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">{school.name}</h1>

              <div className="space-y-2 text-[#e0f2fe]">
                <p>
                  <span className="font-semibold">Provincia:</span> {school.province?.name}
                </p>
                {school.founded && <p>Fundado en {school.founded}</p>}
                <p>
                  <span className="font-semibold">Tipo:</span> {school.type}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <RatingCircle rating={school.rating} size="lg" />
              <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors">
                <Share2 className="w-4 h-4" />
                Compartir
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statCards.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-4 border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-[#2563eb] mb-2">{stat.icon}</div>
                  <div className="text-sm text-[#64748b] mb-1 font-medium">{stat.label}</div>
                  <div className="text-xl md:text-2xl font-bold text-[#0f172a]">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="border-b border-[#e2e8f0]">
              <div className="flex space-x-8 overflow-x-auto">
                {['about', 'infrastructure', 'academics'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 font-semibold text-sm border-b-2 -mb-px whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? 'border-[#2563eb] text-[#2563eb]'
                        : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
                    }`}
                  >
                    {tab === 'about' && 'Información'}
                    {tab === 'infrastructure' && 'Infraestructura'}
                    {tab === 'academics' && 'Académica'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'about' && (
                <div className="space-y-6">
                  {school.description && (
                    <div>
                      <h3 className="font-bold text-lg text-[#0f172a] mb-3">Acerca de</h3>
                      <p className="text-[#475569] leading-relaxed">{school.description}</p>
                    </div>
                  )}

                  {school.extracurriculars && school.extracurriculars.length > 0 && (
                    <div>
                      <h3 className="font-bold text-lg text-[#0f172a] mb-3">Actividades Extracurriculares</h3>
                      <div className="flex flex-wrap gap-2">
                        {school.extracurriculars.map((activity, idx) => (
                          <span key={idx} className="bg-[#e0f2fe] text-[#0369a1] px-3 py-1 rounded-full text-sm font-medium">
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {school.languages && school.languages.length > 0 && (
                    <div>
                      <h3 className="font-bold text-lg text-[#0f172a] mb-3">Idiomas</h3>
                      <div className="flex flex-wrap gap-2">
                        {school.languages.map((language, idx) => (
                          <span key={idx} className="bg-[#fef3c7] text-[#92400e] px-3 py-1 rounded-full text-sm font-medium">
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {school.certifications && school.certifications.length > 0 && (
                    <div>
                      <h3 className="font-bold text-lg text-[#0f172a] mb-3">Certificaciones</h3>
                      <ul className="space-y-2">
                        {school.certifications.map((cert, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Award className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
                            <span className="text-[#475569]">{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'infrastructure' && (
                <div>
                  <h3 className="font-bold text-lg text-[#0f172a] mb-4">Instalaciones</h3>
                  {school.infrastructure && school.infrastructure.length > 0 ? (
                    <ul className="space-y-2">
                      {school.infrastructure.map((facility, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Zap className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                          <span className="text-[#475569]">{facility}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[#64748b]">Información no disponible</p>
                  )}
                </div>
              )}

              {activeTab === 'academics' && (
                <div className="space-y-4">
                  <p className="text-[#64748b]">Los datos académicos detallados están disponibles para colegios verificados.</p>
                  <div className="bg-[#fef3c7] border border-[#f59e0b] rounded-lg p-4 flex items-start gap-3">
                    <Lock className="w-5 h-5 text-[#b45309] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#0f172a] text-sm">Contenido exclusivo</p>
                      <p className="text-[#92400e] text-sm">Verifica tu colegio para acceder a datos completos del MINERD</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-lg p-6 border border-[#e2e8f0] shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-[#0f172a]">Contacto</h3>

              {school.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#2563eb]" />
                  <a href={`tel:${school.phone}`} className="text-[#2563eb] hover:text-[#1e40af] font-medium">
                    {school.phone}
                  </a>
                </div>
              )}

              {school.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#2563eb]" />
                  <a href={`mailto:${school.email}`} className="text-[#2563eb] hover:text-[#1e40af] font-medium">
                    {school.email}
                  </a>
                </div>
              )}

              {school.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-[#2563eb]" />
                  <a
                    href={school.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2563eb] hover:text-[#1e40af] font-medium truncate"
                  >
                    Sitio web
                  </a>
                </div>
              )}

              <div className="space-y-2 pt-4 border-t border-[#e2e8f0]">
                <button className="w-full bg-[#2563eb] hover:bg-[#1e40af] text-white font-bold py-2 rounded-lg transition-colors">
                  Solicitar Información
                </button>
                <button className="w-full border-2 border-[#2563eb] text-[#2563eb] hover:bg-[#eff6ff] font-bold py-2 rounded-lg transition-colors">
                  Agendar Visita
                </button>
              </div>
            </div>

            {/* Costs Card */}
            {(school.tuition_min || school.tuition_max) && (
              <div className="bg-white rounded-lg p-6 border border-[#e2e8f0] shadow-sm space-y-4">
                <h3 className="font-bold text-lg text-[#0f172a]">Costos</h3>
                <div className="space-y-2">
                  <p className="text-sm text-[#64748b]">Rango de matrícula anual</p>
                  <p className="text-2xl font-bold text-[#0f172a]">{formatTuition(school.tuition_min, school.tuition_max)}</p>
                </div>
              </div>
            )}

            {/* Open House Card */}
            {openHouseEvents.length > 0 && (
              <div className="bg-[#fffbeb] rounded-lg p-6 border border-[#f59e0b] shadow-sm space-y-4">
                <h3 className="font-bold text-lg text-[#0f172a]">Open House Próximos</h3>
                {openHouseEvents.slice(0, 2).map((event) => (
                  <div key={event.id} className="text-sm">
                    <p className="font-semibold text-[#0f172a]">
                      {new Date(event.event_date).toLocaleDateString('es-DO', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    {event.start_time && <p className="text-[#64748b]">{event.start_time}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Ad Banners */}
            <AdBanner type="rectangle" />
            <AdBanner type="rectangle" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
