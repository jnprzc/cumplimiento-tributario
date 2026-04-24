import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pulso — Diagnóstico Tributario',
  description:
    'Conoce el nivel de cumplimiento tributario de tu empresa en segundos. Gratis, sin registro.',
  keywords: 'diagnóstico tributario, cumplimiento fiscal, NIT, Colombia, microempresas',
  openGraph: {
    title: 'Pulso — Diagnóstico Tributario',
    description: 'Conoce el estado tributario de tu empresa en segundos.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
