import { Link } from "react-router-dom";
import SectionTitle from "./SectionTitle";

function Galeria({ imagenes }) {
  const fotos = imagenes || [];
  const preview = fotos.slice(0, 3); // Agarra solo las primeras 3

  if (fotos.length === 0) return null; // Si no hay fotos, no muestra la sección

  return (
    <section>
      <SectionTitle texto="NUESTRO GIMNASIO" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {preview.map((imgUrl, index) => (
          <div key={index} className="aspect-square rounded-2xl overflow-hidden border border-[var(--color-border)]">
            <img src={imgUrl} alt={`Instalaciones ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        ))}
      </div>

      {fotos.length > 3 && (
        <div className="mt-8 text-center">
          <Link
            to="/galeria"
            className="inline-block bg-[var(--color-bg-card)] border border-[var(--color-gold-muted)] text-[var(--color-gold-primary)] hover:bg-[var(--color-gold-primary)] hover:text-zinc-950 font-bold py-3 px-8 rounded-full transition-colors"
          >
            Ver más fotos
          </Link>
        </div>
      )}
    </section>
  );
}

export default Galeria;
