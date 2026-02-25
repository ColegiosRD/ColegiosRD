'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { School } from '@/lib/types';
import AdBanner from '@/components/AdBanner';
import Footer from '@/components/Footer';
import RatingCircle from '@/components/RatingCircle';
import { Trophy, Award, Users, TrendingUp } from 'lucide-react';

export default function OrgulloPublicoPage() {
  const [publicSchools, setPublicSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicSchools = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('schools')
          .select('*, province:provinces(*)')
          .eq('type', 'Público')
          .order('rating', { ascending: false, nullsFirst: false })
          .order('prueba_nacional', { ascending: false, nullsFirst: false });

        if (!error && data) {
          setPublicSchools(data as School[]);
        }
      } catch (error) {
        console.error('Error fetching public schools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicSchools();
  }, []);

  const topTenSchools = publicSchools.slice(0, 10);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#065f46] to-[#047857] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Orgullo Público</h1>
          <p className="text-[#d1fae5] text-xl font-semibold max-w-2xl mx-auto">La excelencia no tiene precio</p>
          <p className="text-[#a7f3d0] text-lg max-w-3xl mx-auto">
            Celebramos los colegios públicos que lideran la excelencia académica en República Dominicana con datos
            oficiales del MINERD.
          </p>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdBanner type="banner" />
      </div>

      {/* Main Ranking */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-300 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : publicSchools.length > 0 ? (
            <div className="space-y-4">
              {publicSchools.map((school, idx) => {
                const isTopTen = idx < 10;
                const isTopFive = idx < 5;

                return (
                  <Link
                    key={school.id}
                    href={`/school/${school.slug}`}
                    className={`rounded-lg p-6 transition-all hover:shadow-lg border-2 ${
                      isTopFive
                        ? 'border-[#047857] bg-gradient-to-r from-[#f0fdf4] to-[#dbeafe] hover:from-[#dcfce7] hover:to-[#bfdbfe]'
                        : 'border-[#d1e7dd] bg-[#f8fbf9] hover:bg-[#f0fdf4]'
                    }`}
                  >
                    <div className="flex items-start gap-6">
                      {/* Rank */}
                      <div className="text-center flex-shrink-0">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl ${
                            isTopFive
                              ? 'bg-[#047857] text-white'
                              : isTopTen
                                ? 'bg-[#10b981] text-white'
                                : 'bg-[#d1e7dd] text-[#0f512f]'
                          }`}
                        >
                          #{idx + 1}
                        </div>
                      </div>

                      {/* School Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#0f172a]">{school.name}</h3>

                        <div className="flex flex-wrap items-center gap-6 mt-3 text-sm">
                          <div className="flex items-center gap-2 text-[#64748b]">
                            <Users className="w-4 h-4" />
                            <span>{school.enrollment ? `${school.enrollment.toLocaleString()} estudiantes` : 'N/A'}</span>
                          </div>

                          {school.prueba_nacional && (
                            <div className="flex items-center gap-2 text-[#64748b]">
                              <TrendingUp className="w-4 h-4" />
                              <span>Prueba: {school.prueba_nacional.toFixed(1)}</span>
                            </div>
                          )}

                          <div className="text-[#0f512f] font-semibold">{school.province?.name}</div>
                        </div>

                        {school.description && (
                          <p className="text-[#475569] mt-3 text-sm line-clamp-2">{school.description}</p>
                        )}

                        {/* Top 10 Badge */}
                        {isTopTen && (
                          <div className="mt-4 flex items-center gap-2">
                            <Award className="w-4 h-4 text-[#047857]" />
                            <span className="text-xs font-bold text-[#047857] bg-[#dcfce7] px-3 py-1 rounded-full">
                              Entrevista editorial gratuita incluida
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex-shrink-0">
                        <RatingCircle rating={school.rating} size="md" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg">
              <Trophy className="w-16 h-16 text-[#cbd5e1] mx-auto mb-4" />
              <p className="text-[#64748b] text-lg font-medium">No hay colegios públicos disponibles</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-[#f0fdf4] py-12 my-12 border-t-4 border-[#047857]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0f512f]">
            Valoramos la excelencia en la educación pública
          </h2>
          <p className="text-[#0f512f]/70 max-w-2xl mx-auto">
            Estos colegios son ejemplo de dedicación, calidad académica y compromiso con la educación dominicana.
          </p>
          <Link
            href="/ranking?type=P%C3%BAblico"
            className="inline-block bg-[#047857] hover:bg-[#065f46] text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Ver todos los colegios públicos
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
