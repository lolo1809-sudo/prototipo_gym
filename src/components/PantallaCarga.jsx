export default function PantallaCarga() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-base)] text-white gap-4">
      {/* Spinner animado */}
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-gold-primary)] animate-spin" />
      </div>

      {/* Texto de carga */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-bold tracking-widest uppercase text-white">Cargando gimnasio</p>
        <span className="text-xs text-[var(--color-text-muted)] tracking-wide">Un momento, por favor...</span>
      </div>
    </div>
  );
}
