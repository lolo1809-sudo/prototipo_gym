import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SectionTitle from "../components/SectionTitle";
import EmptyCategory from "../components/EmptyCategory";
import Sidebar from "../components/Sidebar";
import { CATEGORIAS } from "../config";

export default function CategoryPage({ productos = [] }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orden, setOrden] = useState("default");
  const { categoria } = useParams();

  // 1. Filtrar los productos según la categoría actual de la URL
  const productosCategoria = useMemo(() => {
    return productos.filter((prod) => prod.categoria_slug === categoria);
  }, [productos, categoria]);

  // 2. Ordenar por precio_contado (numeric en la BD)
  const productosMostrados = useMemo(() => {
    const resultado = [...productosCategoria];

    if (orden === "menor-mayor") {
      resultado.sort((a, b) => Number(a.precio_contado) - Number(b.precio_contado));
    } else if (orden === "mayor-menor") {
      resultado.sort((a, b) => Number(b.precio_contado) - Number(a.precio_contado));
    }

    return resultado;
  }, [productosCategoria, orden]);

  // Nombre oficial con acentos y mayúsculas
  const catEncontrada = CATEGORIAS.find((c) => c.slug === categoria);
  const tituloFormateado = catEncontrada ? catEncontrada.nombre.toUpperCase() : categoria ? categoria.replace(/[-_]/g, " ").toUpperCase() : "CATEGORÍA";

  return (
    <main className="w-full bg-bg-base py-12 px-4 min-h-screen relative">
      {/* Sidebar Drawer */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Barra superior adaptada para mobile (apilada) y escritorio (en línea) */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-bg-card border border-border text-white hover:border-gold-primary transition-colors cursor-pointer text-sm font-semibold w-full sm:w-auto"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gold-primary">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          Categorías
        </button>

        <Link to="../" className="text-xs text-center sm:text-right tracking-widest uppercase font-bold text-text-muted transition-colors duration-200 hover:text-gold-primary">
          ← Volver al inicio
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        <SectionTitle texto={tituloFormateado} className="mt-4" />

        {/* Barra de Ordenamiento adaptada también para mobile */}
        {productosCategoria.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 mb-8 pb-4 border-b border-border">
            <span className="text-xs text-text-muted">
              {productosMostrados.length} {productosMostrados.length === 1 ? "producto" : "productos"}
            </span>

            <div className="flex items-center justify-between sm:justify-end gap-2">
              <label htmlFor="orden" className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Ordenar:
              </label>
              <select
                id="orden"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                className="bg-bg-card text-white text-xs px-3 py-1.5 rounded-lg border border-border focus:outline-none focus:border-gold-primary cursor-pointer"
              >
                <option value="default">Más recientes</option>
                <option value="menor-mayor">Menor precio</option>
                <option value="mayor-menor">Mayor precio</option>
              </select>
            </div>
          </div>
        )}

        {/* Grilla de Productos */}
        {productosMostrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productosMostrados.map((prod) => (
              <ProductCard key={prod.id} id={prod.id} nombre={prod.nombre} imgs={prod.imgs} className="flex" />
            ))}
          </div>
        ) : (
          <EmptyCategory categoria={tituloFormateado} />
        )}
      </div>
    </main>
  );
}
