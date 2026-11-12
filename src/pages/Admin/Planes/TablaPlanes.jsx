import { Star } from "lucide-react";

export default function TablaPlanes({ cargando, planes, iniciarEdicion, eliminarPlan }) {
  return (
    <div className="lg:col-span-2 bg-bg-card rounded-custom border border-border shadow-sm overflow-hidden h-fit">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-base text-text-muted border-b border-border text-sm">
              <th className="p-4 font-semibold">Plan</th>
              <th className="p-4 font-semibold">Detalles</th>
              <th className="p-4 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="3" className="text-center p-8 text-text-muted text-sm">
                  Cargando planes...
                </td>
              </tr>
            ) : planes.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-8 text-text-muted text-sm">
                  No hay planes registrados.
                </td>
              </tr>
            ) : (
              planes.map((plan) => (
                <tr key={plan.id} className="border-b border-border hover:bg-bg-base/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <p className="text-gold-primary font-bold text-sm">{plan.nombre}</p>
                      {plan.popular && <Star className="w-4 h-4 fill-gold-primary text-gold-primary" />}
                    </div>
                    <p className="text-text-muted text-xs mt-1 max-w-xs truncate">{plan.description || "Sin descripción"}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-text-muted font-bold text-sm">${plan.precio}</p>
                    <p className="text-text-muted text-xs mt-1">
                      {plan.duracion_dias && `${plan.duracion_dias} días`}
                      {plan.dias_semana && ` • ${plan.dias_semana}x sem`}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => iniciarEdicion(plan)}
                        className="text-text-muted hover:text-gold-primary transition-colors cursor-pointer text-sm font-semibold px-2 py-1 bg-bg-base border border-border rounded-md"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarPlan(plan.id)}
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
