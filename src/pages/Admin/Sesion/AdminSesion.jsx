import AdminLayout from "../AdminLayout";
import { useSesion } from "./useSesion";
import { CheckCircle, AlertOctagon, UserCheck, Calendar } from "lucide-react";

export default function AdminSesion() {
  const { dni, setDni, estadoAcceso, mensaje, socio, infoPlan, procesando, manejarCheckIn } = useSesion();

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto flex flex-col gap-8 mt-4 lg:mt-10">
        {/* ENCABEZADO */}
        <div className="text-center">
          <UserCheck className="w-16 h-16 mx-auto mb-4 text-gold-primary" strokeWidth={1.5} />
          <h2 className="text-3xl font-bold text-gold-primary mb-2">Control de Acceso</h2>
          <p className="text-text-muted">Ingresa el DNI del socio para verificar el estado de su cuota.</p>
        </div>

        {/* FORMULARIO DE INGRESO */}
        <div className="bg-bg-card p-8 rounded-custom border border-border shadow-md">
          <form onSubmit={manejarCheckIn} className="flex flex-col gap-6">
            <div>
              <input
                type="number"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                autoFocus
                placeholder="Ej: 43123456"
                disabled={procesando || estadoAcceso !== null}
                className="w-full bg-bg-base border-2 border-border text-gold-primary rounded-custom px-6 py-5 text-4xl text-center font-bold outline-none focus:border-gold-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={procesando || !dni.trim() || estadoAcceso !== null}
              className="w-full bg-gold-primary hover:bg-gold-hover text-bg-base text-lg font-bold py-4 rounded-custom transition-colors cursor-pointer disabled:opacity-50"
            >
              {procesando ? "Verificando..." : "Verificar Ingreso"}
            </button>
          </form>
        </div>

        {/* CARTEL DE ESTADO */}
        {estadoAcceso && (
          <div
            className={`p-6 rounded-custom border-2 flex items-center gap-6 animate-in fade-in zoom-in duration-300 ${
              estadoAcceso === "permitido" ? "bg-success/10 border-success text-success" : "bg-red-500/10 border-red-500 text-red-500"
            }`}
          >
            <div className="shrink-0">{estadoAcceso === "permitido" ? <CheckCircle className="w-16 h-16" strokeWidth={2} /> : <AlertOctagon className="w-16 h-16" strokeWidth={2} />}</div>

            <div className="flex flex-col flex-1">
              <h3 className="text-2xl font-bold uppercase tracking-wide">{estadoAcceso === "permitido" ? "Acceso Permitido" : "Acceso Denegado"}</h3>

              {socio && <p className="text-xl font-bold mt-1 text-white">{socio.nombre}</p>}

              {infoPlan && (
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-bg-base/80 text-gold-primary border border-border">{infoPlan.nombrePlan}</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-bg-base/80 text-white border border-border flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gold-primary" />
                    Días restantes esta semana: {infoPlan.diasRestantes} / {infoPlan.diasTotales}
                  </span>
                </div>
              )}

              <p className="text-sm mt-2 opacity-90 font-medium">{mensaje}</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
