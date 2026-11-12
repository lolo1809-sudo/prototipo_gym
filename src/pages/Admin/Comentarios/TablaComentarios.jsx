// Este componente renderiza puramente la tabla

import { Star } from "lucide-react";

export default function TablaComentarios({ cargando, resenas, iniciarEdicion, eliminarResena }) {
  return (
    <div className="lg:col-span-2 bg-bg-card rounded-custom border border-border shadow-sm overflow-hidden h-fit">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-base text-text-muted border-b border-border text-sm">
              <th className="p-4 font-semibold">Cliente</th>
              <th className="p-4 font-semibold">Estrellas</th>
              <th className="p-4 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="3" className="text-center p-8 text-text-muted text-sm">
                  Cargando reseñas...
                </td>
              </tr>
            ) : resenas.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-8 text-text-muted text-sm">
                  No hay reseñas todavía.
                </td>
              </tr>
            ) : (
              resenas.map((resena) => (
                <tr key={resena.id} className="border-b border-border hover:bg-bg-base/50 transition-colors">
                  <td className="p-4">
                    <p className="text-gold-primary font-bold text-sm">{resena.nombre}</p>
                    <p className="text-text-muted text-xs mt-1 max-w-xs truncate">{resena.comentario}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <span className="text-gold-primary font-bold text-sm">{resena.cant_estrellas}</span>
                      <Star className="w-3.5 h-3.5 fill-gold-primary text-gold-primary" />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => iniciarEdicion(resena)}
                        className="text-text-muted hover:text-gold-primary transition-colors cursor-pointer text-sm font-semibold px-2 py-1 bg-bg-base border border-border rounded-md"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarResena(resena.id)}
                        className="text-gold-primary hover:text-bg-base hover:bg-gold-primary transition-colors cursor-pointer text-sm font-semibold px-2 py-1 bg-bg-base border border-border rounded-custom"
                      >
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
