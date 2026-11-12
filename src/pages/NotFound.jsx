import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-base)] flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md w-full bg-[var(--color-bg-card)] border border-[var(--color-border)] p-8 md:p-12 rounded-2xl shadow-sm flex flex-col items-center">
        {/* Número 404 estilizado */}
        <span className="text-[var(--color-gold-primary)] text-6xl md:text-7xl font-extrabold tracking-widest mb-2">404</span>

        {/* Título */}
        <h1 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide mb-3">Página no encontrada</h1>

        {/* Descripción */}
        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-8">Lo sentimos, la página que buscas no existe, ha sido movida o la URL es incorrecta.</p>

        {/* Botón para volver al inicio */}
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[var(--color-gold-primary)] hover:bg-[var(--color-gold-hover)] text-[var(--color-bg-base)] font-semibold text-sm uppercase tracking-wider transition-colors cursor-pointer"
        >
          ← Volver al inicio
        </Link>
      </div>
    </main>
  );
}
