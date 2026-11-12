import { Link } from "react-router-dom";

function GaleriaCompleta({ imagenes }) {
  const fotos = imagenes || [];

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Galería <span className="text-[var(--color-gold-primary)]">Completa</span>
          </h2>
          <Link to="/" className="text-[var(--color-text-muted)] hover:text-[var(--color-gold-primary)] transition-colors text-sm md:text-base">
            ← Volver al inicio
          </Link>
        </div>

        {fotos.length === 0 ? (
          <p className="text-[var(--color-text-muted)]">No hay imágenes disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {fotos.map((imgUrl, index) => (
              <div key={index} className="aspect-square rounded-xl overflow-hidden border border-[var(--color-border)]">
                <img src={imgUrl} alt={`Instalaciones ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GaleriaCompleta;
