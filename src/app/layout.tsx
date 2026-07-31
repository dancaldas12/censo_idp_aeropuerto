import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Censo Geográfico | Iglesia IDP Aeropuerto',
  description:
    'Plataforma oficial de censo geográfico para miembros y creyentes de la Iglesia IDP Aeropuerto para la planificación de futuras células pastorales.',
  keywords: ['IDP Aeropuerto', 'Censo Geográfico', 'Células', 'Iglesia', 'Registro'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased min-h-screen flex flex-col text-slate-100 selection:bg-brand-500 selection:text-white">

        {/* Sticky header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
          <div className="max-w-3xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-3">
            {/* Logo + name */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center shadow-lg shadow-brand-500/20 text-white font-extrabold text-base sm:text-lg">
                ✝
              </div>
              <div className="min-w-0">
                <span className="block font-extrabold text-sm sm:text-base bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-amber-300 truncate">
                  IDP Aeropuerto
                </span>
                <span className="block text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-semibold -mt-0.5 hidden sm:block">
                  Censo Geográfico 2026
                </span>
              </div>
            </div>

            {/* Badge */}
            <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-[10px] sm:text-xs font-semibold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Oficial &amp; Seguro
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 sm:py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/60 bg-slate-950/80 py-4">
          <div className="max-w-3xl mx-auto px-4 text-center text-xs text-slate-500 space-y-0.5">
            <p>© {new Date().getFullYear()} Iglesia IDP Aeropuerto — Todos los derechos reservados.</p>
            <p>Datos protegidos exclusivamente para fines pastorales.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
