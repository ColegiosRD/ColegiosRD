'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { School, Province, SchoolFilters } from '@/lib/types';
import SchoolCard from '@/components/SchoolCard';
import AdBanner from '@/components/AdBanner';
import Footer from '@/components/Footer';
import { Search, Filter } from 'lucide-react';

export default function RankingPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SchoolFilters>({
    search: '',
    type: 'all',
    zone: '',
    province: '',
    sortBy: 'rating',
  });

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const { data, error } = await supabase.from('provinces').select('*').order('name');

        if (!error && data) {
          setProvinces(data);
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);

        let query = supabase.from('schools').select('*, province:provinces(*)');

        // Apply filters
        if (filters.type && filters.type !== 'all') {
          query = query.eq('type', filters.type);
        }

        if (filters.province) {
          query = query.eq('province_id', parseInt(filters.province));
        }

        if (filters.search) {
          query = query.ilike('name', `%${filters.search}%`);
        }

        // Apply sorting
        switch (filters.sortBy) {
          case 'prueba':
            query = query.order('prueba_nacional', { ascending: false, nullsFirst: false });
            break;
          case 'students':
            query = query.order('enrollment', { ascending: false, nullsFirst: false });
            break;
          case 'name':
            query = query.order('name', { ascending: true });
            break;
          case 'rating':
          default:
            query = query.order('rating', { ascending: false, nullsFirst: false });
            break;
        }

        const { data, error } = await query.limit(100);

        if (!error && data) {
          setSchools(data as School[]);
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, [filters]);

  const uniqueZones = useMemo(() => {
    const zones = new Set(provinces.map((p) => p.zone));
    return Array.from(zones).sort();
  }, [provinces]);

  const filteredProvinces = useMemo(() => {
    if (!filters.zone) return provinces;
    return provinces.filter((p) => p.zone === filters.zone);
  }, [provinces, filters.zone]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'zone' && { province: '' }), // Reset province when zone changes
    }));
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a365d] to-[#2563eb] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Ranking de Colegios 2026</h1>
          <p className="text-[#93c5fd] text-lg">Explora y compara colegios basados en datos oficiales del MINERD</p>
        </div>
      </section>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="flex items-center space-x-2 text-[#0f172a] font-semibold">
            <Filter className="w-5 h-5" />
            <span>Filtros</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-2">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                <input
                  type="text"
                  placeholder="Nombre del colegio"
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-2">Tipo</label>
              <select
                value={filters.type || 'all'}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-[#0f172a]"
              >
                <option value="all">Todos</option>
                <option value="Privado">Privados</option>
                <option value="Público">Públicos</option>
              </select>
            </div>

            {/* Zone Filter */}
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-2">Zona</label>
              <select
                value={filters.zone || ''}
                onChange={(e) => handleFilterChange('zone', e.target.value)}
                className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-[#0f172a]"
              >
                <option value="">Todas las zonas</option>
                {uniqueZones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>

            {/* Province Filter */}
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-2">Provincia</label>
              <select
                value={filters.province || ''}
                onChange={(e) => handleFilterChange('province', e.target.value)}
                className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-[#0f172a]"
              >
                <option value="">Todas las provincias</option>
                {filteredProvinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-2">Ordenar por</label>
              <select
                value={filters.sortBy || 'rating'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-[#0f172a]"
              >
                <option value="rating">Calificación</option>
                <option value="prueba">Prueba Nacional</option>
                <option value="students">Estudiantes</option>
                <option value="name">Nombre (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-[#64748b] font-medium">
            {schools.length} colegio{schools.length !== 1 ? 's' : ''} encontrado{schools.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdBanner size="leaderboard" label="Espacio publicitario — Ranking" />
      </div>

      {/* Schools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-300 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : schools.length > 0 ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schools.map((school, idx) => (
                <div key={school.id}>
                  <SchoolCard school={school} />
                  {/* In-feed ads every 6 cards */}
                  {(idx + 1) % 6 === 0 && idx !== schools.length - 1 && (
                    <div className="mt-6">
                      <AdBanner size="rectangle" label="Espacio publicitario" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[#64748b] text-lg font-medium">No se encontraron colegios con los filtros seleccionados</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
