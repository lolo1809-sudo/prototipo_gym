// Este componente renderiza puramente la tabla y sus tres estados visuales (cargando, vacía o con productos).

import { useState, useMemo } from "react";

export default function TablaProductos({ cargando, productos, iniciarEdicion, eliminarProducto }) {
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  // Obtener categorías únicas presentes en los productos
  const categoriasDisponibles = useMemo(() => {
    const cats = productos.map((p) => p.categoria).filter(Boolean);
    return Array.from(new Set(cats));
  }, [productos]);

  const limpiarFiltros = () => {
    setFiltroNombre("");
    setFiltroCategoria("");
  };

  // Filtrar los productos en memoria
  const productosFiltrados = useMemo(() => {
    return productos.filter((prod) => {
      const coincideNombre = (prod.nombre || "").toLowerCase().includes(filtroNombre.toLowerCase().trim());

      const coincideCategoria = filtroCategoria ? prod.categoria === filtroCategoria : true;

      return coincideNombre && coincideCategoria;
    });
  }, [productos, filtroNombre, filtroCategoria]);

  const hayFiltrosActivos = filtroNombre !== "" || filtroCategoria !== "";

  return (
    <div className="lg:col-span-2 flex flex-col gap-4">
      {/* SECCIÓN DE FILTROS */}
      <div className="bg-bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Búsqueda por Nombre */}
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">Buscar por nombre</label>
            <input
              type="text"
              placeholder="Ej: Creatina, Remera..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              className="w-full bg-bg-base border border-border text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-gold-primary transition-colors"
            />
          </div>

          {/* Selector de Categoría */}
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">Categoría</label>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full bg-bg-base border border-border text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-gold-primary transition-colors cursor-pointer"
            >
              <option value="">Todas las categorías</option>
              {categoriasDisponibles.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Barra inferior: Contador de resultados y reset */}
        {hayFiltrosActivos && (
          <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
            <span className="text-text-muted">
              Mostrando {productosFiltrados.length} de {productos.length} productos
            </span>
            <button type="button" onClick={limpiarFiltros} className="text-gold-primary hover:text-gold-hover font-semibold transition-colors cursor-pointer">
              Restablecer filtros
            </button>
          </div>
        )}
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="bg-bg-card rounded-xl border border-border shadow-sm overflow-hidden h-fit">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-base/60 text-text-muted border-b border-border text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Producto</th>
                <th className="p-4 font-semibold">Precios</th>
                <th className="p-4 font-semibold">Categoría</th>
                <th className="p-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-text-muted text-sm">
                    Cargando catálogo...
                  </td>
                </tr>
              ) : productos.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-text-muted text-sm">
                    No hay productos todavía.
                  </td>
                </tr>
              ) : productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-text-muted text-sm">
                    No se encontraron productos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((prod) => {
                  const portada = Array.isArray(prod.imgs) ? prod.imgs[0] : prod.imgs;
                  const cantidadFotos = Array.isArray(prod.imgs) ? prod.imgs.length : 1;

                  return (
                    <tr key={prod.id} className="border-b border-border hover:bg-bg-base/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3 min-w-[180px]">
                          <div className="relative shrink-0 w-12 h-12">
                            <img src={portada || "/placeholder.webp"} alt={prod.nombre} className="w-12 h-12 shrink-0 object-cover rounded-md border border-border bg-bg-base" />
                            {cantidadFotos > 1 && <span className="absolute -bottom-1 -right-1 bg-gold-primary text-bg-base text-[9px] font-bold px-1 rounded-sm">+{cantidadFotos - 1}</span>}
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-bold text-sm truncate">{prod.nombre}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <p className="text-gold-primary font-bold text-sm">${Number(prod.precio_contado).toLocaleString("es-AR")}</p>
                        {prod.precio_lista && <p className="text-text-muted text-xs">Lista: ${Number(prod.precio_lista).toLocaleString("es-AR")}</p>}
                      </td>

                      <td className="p-4">
                        <span className="text-white text-xs bg-bg-base px-2.5 py-1 rounded-md border border-border">{prod.categoria}</span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => iniciarEdicion(prod)}
                            className="text-text-muted hover:text-white transition-colors cursor-pointer text-xs font-semibold px-3 py-1.5 bg-bg-base border border-border hover:border-gold-primary rounded-lg"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => eliminarProducto(prod)}
                            className="text-red-400 hover:text-white hover:bg-red-500/80 transition-colors cursor-pointer text-xs font-semibold px-3 py-1.5 bg-bg-base border border-border hover:border-red-500 rounded-lg"
                          >
                            Borrar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
