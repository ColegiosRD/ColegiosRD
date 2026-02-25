'use client';

import Link from 'next/link';
import { Users, DollarSign, FileText, CheckCircle, Star } from 'lucide-react';
import RatingCircle from './RatingCircle';

interface School {
  id: string;
  slug: string;
  name: string;
  province: string;
  type: 'Privado' | 'Público';
  rating: number;
  verificado: boolean;
  premium: boolean;
  elite: boolean;
  pruebaPromedio: number;
  estudiantesPorClase: number;
  cuota?: number;
}

interface SchoolCardProps {
  school: School;
  rank: number;
}

export default function SchoolCard({ school, rank }: SchoolCardProps) {
  let verificationColor = 'border-gray-300';
  let verificationBg = 'bg-gray-50';
  let verificationBadge = null;

  if (school.elite) {
    verificationColor = 'border-[#f59e0b]';
    verificationBg = 'bg-amber-50';
    verificationBadge = (
      <div className="absolute top-3 right-3 bg-[#f59e0b] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
        <Star className="w-3 h-3" />
        <span>Elite</span>
      </div>
    );
  } else if (school.premium) {
    verificationColor = 'border-[#3b82f6]';
    verificationBg = 'bg-blue-50';
    verificationBadge = (
      <div className="absolute top-3 right-3 bg-[#3b82f6] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
        <CheckCircle className="w-3 h-3" />
        <span>Premium</span>
      </div>
    );
  } else if (school.verificado) {
    verificationColor = 'border-[#10b981]';
    verificationBg = 'bg-green-50';
    verificationBadge = (
      <div className="absolute top-3 right-3 bg-[#10b981] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
        <CheckCircle className="w-3 h-3" />
        <span>Verificado</span>
      </div>
    );
  }

  const typeColor = school.type === 'Privado' ? 'bg-[#dbeafe] text-[#1e40af]' : 'bg-green-100 text-green-800';

  return (
    <Link href={`/school/${school.slug}`}>
      <div className={`relative bg-white rounded-2xl border-2 ${verificationColor} p-5 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer`}>
        {verificationBadge}

        {/* Rank */}
        <div className="absolute top-3 left-3 bg-[#1a365d] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
          {rank}
        </div>

        <div className="mt-6 space-y-4">
          {/* Name and Province */}
          <div>
            <h3 className="font-bold text-lg text-[#1a365d] line-clamp-2 hover:text-[#2563eb] transition-colors">
              {school.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{school.province}</p>
          </div>

          {/* Type Badge */}
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${typeColor}`}>
              {school.type}
            </span>
          </div>

          {/* Rating and Stats */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            {/* Rating Circle */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <RatingCircle rating={school.rating} size={48} />
              <p className="text-xs text-gray-600 text-center">Calificación</p>
            </div>

            {/* Prueba Nacional */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="bg-[#f3f4f6] rounded-lg px-3 py-2 w-full text-center">
                <p className="font-bold text-sm text-[#1a365d]">{school.pruebaPromedio}%</p>
              </div>
              <p className="text-xs text-gray-600 text-center">Prueba Nacional</p>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="space-y-2 pt-2 border-t border-gray-200">
            {/* Estudiantes por clase */}
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <Users className="w-4 h-4 text-[#2563eb]" />
              <span>{school.estudiantesPorClase} estudiantes/clase</span>
            </div>

            {/* Cuota */}
            {school.cuota && (
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <DollarSign className="w-4 h-4 text-[#10b981]" />
                <span>RD${school.cuota.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <button className="w-full mt-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
            <span>Ver Detalles</span>
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
