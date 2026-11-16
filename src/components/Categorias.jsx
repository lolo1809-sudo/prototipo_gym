import React from "react";
import { Link } from "react-router-dom";
import SectionTitle from "./SectionTitle";
import { CATEGORIAS } from "../config";

export default function Categorias({ productos = [] }) {
  // Filtramos solo las categorías que tienen al menos un producto asociado
  const categoriasDisponibles = CATEGORIAS.filter((cat) => {
    return productos.some((prod) => prod.categoria_slug === cat.slug);
  });

  // Si el gimnasio no tiene productos en ninguna categoría, no se muestra nada
  if (categoriasDisponibles.length === 0) return null;

  return (
    <section id="categorias" className="w-full bg-bg-base">
      <SectionTitle texto="CATEGORÍAS" />

      <div className="grid grid-cols-1 md:grid-cols-2 border border-border">
        {categoriasDisponibles.map((cat, index) => (
          <Link key={cat.slug} to={`/categorias/${cat.slug}`} className="relative w-full aspect-[2/1] overflow-hidden bg-bg-card group block border border-border">
            <img
              src={cat.img}
              alt={cat.nombre}
              loading={index < 2 ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={index < 2 ? "high" : "auto"}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-bg-base/40 group-hover:bg-bg-base/15 transition-colors duration-500"></div>
            <div className="absolute inset-0 flex items-center justify-center md:justify-start px-4 md:pl-16 pointer-events-none">
              <h3 className="text-white text-xl sm:text-3xl md:text-5xl font-extrabold uppercase tracking-widest drop-shadow-xl text-center md:text-left">{cat.nombre}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
