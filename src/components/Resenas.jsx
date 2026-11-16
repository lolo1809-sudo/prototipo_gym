import React from "react";

export default function Resenas({ resenas }) {
  if (!resenas || resenas.length === 0) return null;

  // 1. Multiplicamos el array para llenar pantallas anchas sin importar si tienes pocas reseñas
  let arrayBase = [...resenas];
  while (arrayBase.length < 8) {
    arrayBase = [...arrayBase, ...resenas];
  }
  // 2. Duplicamos una vez más el bloque completo para que el bucle sea infinito y perfecto
  const cintaResenas = [...arrayBase, ...arrayBase];

  return (
    <section className="w-full overflow-hidden bg-[var(--color-bg-base)] pt-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center text-white uppercase tracking-wider">
          Lo que dicen <span className="text-[var(--color-gold-primary)]">nuestros clientes</span>
        </h2>
      </div>

      {/* Contenedor relativo de la cinta con difuminado en los bordes */}
      <div className="relative w-full flex overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-12 md:w-24 bg-gradient-to-r from-[var(--color-bg-base)] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 h-full w-12 md:w-24 bg-gradient-to-l from-[var(--color-bg-base] to-transparent z-10 pointer-events-none"></div>

        {/* Pista de la cinta */}
        <div className="animate-cinta flex gap-4 px-4">
          {cintaResenas.map((resena, index) => (
            <div
              key={`${resena.id}-${index}`}
              className="w-[320px] shrink-0 p-5 rounded-2xl shadow-sm bg-[var(--color-bg-card)] border border-[var(--color-border)] flex flex-col justify-between cursor-default"
            >
              <div>
                {/* Nombre del cliente */}
                <h3 className="font-semibold text-white mb-1">{resena.nombre}</h3>

                {/* Estrellas */}
                <div className="flex text-[var(--color-gold-primary)] text-sm mb-3">
                  {"★".repeat(resena.cant_estrellas)}
                  <span className="text-[var(--color-border)]">{"★".repeat(5 - resena.cant_estrellas)}</span>
                </div>

                {/* Comentario */}
                <p className="text-sm line-clamp-4 text-[var(--color-text-muted)]">"{resena.comentario}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
