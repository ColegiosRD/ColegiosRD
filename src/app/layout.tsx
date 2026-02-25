import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ColegiosRD.com - Encuentra el mejor colegio en República Dominicana',
  description:
    'Rankings de colegios basados en datos oficiales del MINERD. Compara colegios privados y públicos por calidad académica, infraestructura, costos y más.',
  keywords: [
    'colegios',
    'República Dominicana',
    'ranking',
    'educación',
    'escuelas',
    'privadas',
    'públicas',
    'comparar',
    'MINERD',
  ],
  openGraph: {
    title: 'ColegiosRD.com - Encuentra el mejor colegio en República Dominicana',
    description:
      'Rankings de colegios basados en datos oficiales del MINERD. Compara colegios privados y públicos por calidad académica, infraestructura, costos y más.',
    type: 'website',
    url: 'https://colegiosrd.com',
    siteName: 'ColegiosRD.com',
    images: [
      {
        url: 'https://colegiosrd.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ColegiosRD.com',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ColegiosRD.com',
    description: 'Encuentra y compara colegios en República Dominicana',
    images: ['https://colegiosrd.com/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head />
      <body className={`${inter.className} bg-[#f8fafc]`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
