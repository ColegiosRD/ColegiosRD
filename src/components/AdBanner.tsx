'use client';

import { Megaphone } from 'lucide-react';
import Link from 'next/link';

type AdSize = 'leaderboard' | 'rectangle' | 'banner' | 'infeed' | 'institutional';

interface AdBannerProps {
  size: AdSize;
  label: string;
  className?: string;
}

const sizesMap = {
  leaderboard: { height: 'h-[90px]', width: 'w-full', description: '728 x 90' },
  rectangle: { height: 'h-[250px]', width: 'w-[300px]', description: '300 x 250' },
  banner: { height: 'h-[60px]', width: 'w-full', description: '728 x 60' },
  infeed: { height: 'h-[120px]', width: 'w-full', description: '300 x 120' },
  institutional: { height: 'h-[100px]', width: 'w-full', description: '300 x 100' },
};

export default function AdBanner({ size, label, className = '' }: AdBannerProps) {
  const sizeConfig = sizesMap[size];

  return (
    <div
      className={`${sizeConfig.height} ${sizeConfig.width} bg-gradient-to-b from-gray-100 to-gray-50 border-2 border-dashed border-gray-300 rounded-lg relative overflow-hidden ${className}`}
    >
      {/* Gradient Top Stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3b82f6] via-purple-500 to-[#f59e0b]" />

      {/* Content */}
      <div className="h-full flex flex-col items-center justify-center space-y-2 px-4 text-center">
        <Megaphone className="w-6 h-6 text-gray-400" />
        <div>
          <p className="text-sm font-semibold text-gray-700">{label}</p>
          <p className="text-xs text-gray-500">{sizeConfig.description}</p>
        </div>
        <Link
          href="/para-colegios#anunciate"
          className="mt-2 inline-flex items-center px-3 py-1 bg-[#2563eb] text-white text-xs font-bold rounded hover:bg-[#1d4ed8] transition-colors"
        >
          Anúnciate aquí
        </Link>
      </div>
    </div>
  );
}
