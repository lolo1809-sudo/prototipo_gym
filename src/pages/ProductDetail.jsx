import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductDetail({ productos = [], local }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [indiceActual, setIndiceActual] = useState(0);

  const producto = productos.find((prod) => String(prod.id) === String(id));
  const imagenes = producto?.imgs && Array.isArray(producto.imgs) ? producto.imgs : [];

  useEffect(() => {
    if (imagenes.length <= 1) return;

    const intervalo = setInterval(() => {
      setIndiceActual((prev) => (prev + 1) % imagenes.length);
    }, 5000);

    return () => clearInterval(intervalo);
  }, [imagenes.length]);

  if (!producto) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-base text-white gap-4">
        <p className="text-text-muted">Producto no encontrado.</p>
        <button onClick={() => navigate(-1)} className="bg-gold-primary hover:bg-gold-hover text-bg-base font-semibold px-5 py-2 rounded-lg transition-colors cursor-pointer">
          Volver
        </button>
      </div>
    );
  }

  const telefonoWsp = local?.whatsapp?.replace(/\D/g, "") || "";
  const mensaje = `¡Hola! Quería consultar disponibilidad de: ${producto.nombre} (${producto.categoria}) - Precio contado/transferencia: $${producto.precio_contado}.`;
  const whatsappUrl = `https://wa.me/${telefonoWsp}?text=${encodeURIComponent(mensaje)}`;

  return (
    <div className="min-h-screen bg-bg-base flex flex-col md:flex-row relative">
      {/* Botón Volver / Cerrar */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 right-6 text-text-muted hover:text-gold-primary text-xl font-bold cursor-pointer z-30 bg-bg-card/90 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center border border-border transition-colors"
      >
        ✕
      </button>

      {/* Carrusel de Imágenes */}
      <div className="relative w-full md:w-1/2 h-[50vh] md:h-screen bg-bg-card flex items-center justify-center border-b md:border-b-0 md:border-r border-border">
        <img
          src={imagenes[indiceActual] || "/placeholder.webp"}
          alt={`${producto.nombre} - ${indiceActual + 1}`}
          className="w-full h-full object-contain md:object-cover transition-all duration-500"
        />

        {imagenes.length > 1 && (
          <>
            <button
              onClick={() => setIndiceActual((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-bg-base/70 hover:bg-bg-base text-white border border-border rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-colors text-2xl z-20"
            >
              ‹
            </button>
            <button
              onClick={() => setIndiceActual((prev) => (prev + 1) % imagenes.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-bg-base/70 hover:bg-bg-base text-white border border-border rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-colors text-2xl z-20"
            >
              ›
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-bg-base/70 px-3 py-1.5 rounded-full border border-border backdrop-blur-xs z-20">
              {imagenes.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setIndiceActual(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${idx === indiceActual ? "w-5 bg-gold-primary" : "w-2 bg-white/50"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Información */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-between overflow-y-auto min-h-[50vh] md:min-h-screen">
        <div>
          {/* Categoría */}
          <span className="text-gold-primary text-xs font-semibold uppercase tracking-[0.2em] block mb-2">{producto.categoria}</span>

          {/* Nombre */}
          <h1 className="text-white font-bold text-3xl md:text-5xl tracking-wide uppercase mb-8">{producto.nombre}</h1>

          {/* Precios */}
          <div className="p-6 rounded-xl bg-bg-card border border-border space-y-4">
            <div>
              <span className="text-xs text-text-muted font-medium uppercase tracking-wider block mb-1">Precio Contado / Transferencia</span>
              <p className="text-gold-primary font-bold text-3xl md:text-4xl">${Number(producto.precio_contado).toLocaleString("es-AR")}</p>
            </div>

            {producto.precio_lista && Number(producto.precio_lista) > Number(producto.precio_contado) && (
              <div className="pt-3 border-t border-border">
                <span className="text-xs text-text-muted uppercase tracking-wider block mb-0.5">Precio de Lista</span>
                <p className="text-text-muted font-medium text-lg line-through">${Number(producto.precio_lista).toLocaleString("es-AR")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Acción principal: Consultar por WhatsApp */}
        <div className="mt-8">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full bg-gold-primary hover:bg-gold-hover text-bg-base font-bold py-4 rounded-lg transition-colors cursor-pointer text-center text-base uppercase tracking-wider"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
