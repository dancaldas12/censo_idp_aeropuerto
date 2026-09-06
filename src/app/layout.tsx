import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Censo Geográfico | Iglesia IDP Aeropuerto',
  description:
    'Plataforma oficial de censo geográfico para miembros y creyentes de la Iglesia IDP Aeropuerto para la planificación de futuras células pastorales.',
  keywords: ['IDP Aeropuerto', 'Censo Geográfico', 'Células', 'Iglesia', 'Registro'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0b132b',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased min-h-screen min-h-[100dvh] flex flex-col text-slate-100 selection:bg-brand-500 selection:text-white">

        {/* Sticky header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80 shadow-sm">
          <div className="max-w-3xl mx-auto px-3.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2.5">
            {/* Logo + name */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 sm:h-11 sm:w-11 shrink-0 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg shadow-brand-500/20 border border-slate-700/60 overflow-hidden select-none">
                <img
                  src="/logo.jpg"
                  alt="Logo IDP Aeropuerto"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div className="min-w-0">
                <span className="block font-extrabold text-sm sm:text-base bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-amber-300 truncate">
                  IDP Aeropuerto
                </span>
                <span className="block text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-semibold -mt-0.5 hidden xs:block sm:block">
                  Censo Geográfico 2026
                </span>
              </div>
            </div>

            {/* Badge */}
            <span className="flex items-center gap-1.5 px-2.5 py-1 sm:py-1.5 rounded-full bg-emerald-950/70 border border-emerald-600/50 text-emerald-300 text-[10px] sm:text-xs font-semibold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden xxs:inline">Oficial &amp; Seguro</span>
              <span className="xxs:hidden">Oficial</span>
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 max-w-3xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/60 bg-slate-950/90 py-5 pb-8 sm:pb-5">
          <div className="max-w-3xl mx-auto px-4 text-center text-xs text-slate-500 space-y-1">
            <p>© {new Date().getFullYear()} Iglesia IDP Aeropuerto — Todos los derechos reservados.</p>
            <p className="text-[11px] text-slate-600">Datos protegidos exclusivamente para fines pastorales.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
