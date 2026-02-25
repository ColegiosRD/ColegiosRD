'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { OpenHouseEvent } from '@/lib/types';
import AdBanner from '@/components/AdBanner';
import Footer from '@/components/Footer';
import RatingCircle from '@/components/RatingCircle';
import { Calendar, MapPin, Users } from 'lucide-react';

export default function OpenHousePage() {
  const [events, setEvents] = useState<OpenHouseEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('open_house_events')
          .select('*, school:schools(*, province:provinces(*))')
          .gte('event_date', new Date().toISOString().split('T')[0])
          .order('event_date', { ascending: true });

        if (!error && data) {
          setEvents(data as OpenHouseEvent[]);

          // Set first month as default
          if (data.length > 0) {
            const firstDate = new Date(data[0].event_date);
            setSelectedMonth(`${firstDate.getFullYear()}-${String(firstDate.getMonth() + 1).padStart(2, '0')}`);
          }
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getUniqueMonths = () => {
    const months = new Set<string>();
    events.forEach((event) => {
      const date = new Date(event.event_date);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(month);
    });
    return Array.from(months).sort();
  };

  const getMonthLabel = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('es-DO', { month: 'long', year: 'numeric' });
  };

  const filteredEvents = selectedMonth
    ? events.filter((event) => {
        const date = new Date(event.event_date);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        return month === selectedMonth;
      })
    : events;

  const uniqueMonths = getUniqueMonths();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#b45309] to-[#f59e0b] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-10 h-10" />
            <h1 className="text-4xl md:text-5xl font-bold">Calendario de Open House</h1>
          </div>
          <p className="text-[#fef3c7] text-lg max-w-2xl mx-auto">
            Descubre los próximos eventos de puertas abiertas en los mejores colegios de República Dominicana.
          </p>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdBanner type="banner" />
      </div>

      {/* Month Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-bold text-[#0f172a] mb-4">Filtrar por mes</h2>
          <div className="flex flex-wrap gap-2">
            {uniqueMonths.map((month) => (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedMonth === month
                    ? 'bg-[#f59e0b] text-white'
                    : 'bg-[#f3f4f6] text-[#0f172a] hover:bg-[#e5e7eb]'
                }`}
              >
                {getMonthLabel(month)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="space-y-4">
            {filteredEvents.map((event) => {
              const eventDate = new Date(event.event_date);
              const today = new Date();
              const isFeatured = event.is_featured;

              return (
                <Link
                  key={event.id}
                  href={`/school/${event.school?.slug}`}
                  className={`block rounded-lg p-6 transition-all hover:shadow-lg border-2 ${
                    isFeatured
                      ? 'border-[#f59e0b] bg-[#fffbeb] hover:bg-[#fef3c7]'
                      : 'border-[#e5e7eb] bg-white hover:bg-[#f9fafb]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-6">
                    {/* Date */}
                    <div className={`text-center flex-shrink-0 ${isFeatured ? 'bg-[#f59e0b] text-white' : 'bg-[#f3f4f6] text-[#0f172a]'} rounded-lg p-4 min-w-24`}>
                      <div className="text-2xl font-bold">{eventDate.getDate()}</div>
                      <div className="text-xs font-medium mt-1">
                        {eventDate.toLocaleDateString('es-DO', { month: 'short' })}
                      </div>
                      {event.start_time && <div className="text-xs mt-2">{event.start_time}</div>}
                    </div>

                    {/* School Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-[#0f172a]">{event.school?.name}</h3>

                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[#64748b]">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{event.school?.province?.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{event.school?.type}</span>
                            </div>
                          </div>

                          {event.description && <p className="text-[#475569] mt-3 line-clamp-2">{event.description}</p>}
                        </div>

                        {/* Rating */}
                        <div className="flex-shrink-0">
                          <RatingCircle rating={event.school?.rating} size="md" />
                        </div>
                      </div>

                      {/* Featured Badge */}
                      {isFeatured && (
                        <div className="mt-4 pt-4 border-t border-[#fcd34d]">
                          <span className="inline-block bg-[#f59e0b] text-white text-xs font-bold px-3 py-1 rounded-full">
                            Evento Destacado
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg">
            <Calendar className="w-16 h-16 text-[#cbd5e1] mx-auto mb-4" />
            <p className="text-[#64748b] text-lg font-medium">
              {selectedMonth ? 'No hay eventos en este mes' : 'No hay eventos próximos'}
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
