import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pulso — Diagnóstico para tu negocio',
  description:
    'Sabe cómo está tu negocio antes de que sea tarde. Diagnóstico gratuito en 3 minutos para microempresarios colombianos.',
  keywords:
    'diagnóstico negocio, salud financiera, microempresa, Colombia, flujo de caja, ventas',
  openGraph: {
    title: 'Pulso — Diagnóstico para tu negocio',
    description:
      'Sabe cómo está tu negocio antes de que sea tarde. Gratis, en 3 minutos.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e3a5f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
