import { useState, useMemo } from "react";

export default function TablaSocios({ cargando, socios, planes, iniciarEdicion, eliminarSocio }) {
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  // Funciones de utilidad para fechas
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const getEstadoSocio = (fechaStr) => {
    if (!fechaStr) return "Desconocido";
    const fechaVencimiento = new Date(fechaStr + "T00:00:00");
    const diffTime = fechaVencimiento - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Vencido";
    if (diffDays <= 3) return "Por vencer";
    return "Activo";
  };

  // Filtrado de socios
  const sociosFiltrados = useMemo(() => {
    return socios.filter((socio) => {
      const coincideTexto = socio.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) || socio.dni.includes(filtroTexto);

      const coincideEstado = filtroEstado ? getEstadoSocio(socio.fecha_vencimiento) === filtroEstado : true;

      return coincideTexto && coincideEstado;
    });
  }, [socios, filtroTexto, filtroEstado]);

  // Cálculos para el Dashboard
  const stats = useMemo(() => {
    let activos = 0,
      porVencer = 0,
      vencidos = 0;
    socios.forEach((socio) => {
      const estado = getEstadoSocio(socio.fecha_vencimiento);
      if (estado === "Activo") activos++;
      if (estado === "Por vencer") porVencer++;
      if (estado === "Vencido") vencidos++;
    });
    return { activos, porVencer, vencidos, total: socios.length };
  }, [socios]);

  return (
    <div className="lg:col-span-2 flex flex-col gap-4">
      {/* SECCIÓN DE FILTROS */}
      <div className="bg-bg-card p-4 rounded-custom border border-border shadow-sm flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">Buscar por Nombre o DNI</label>
            <input
              type="text"
              placeholder="Ej: Juan o 4321..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              className="w-full bg-bg-base border border-border text-gold-primary rounded-custom px-3 py-2 text-sm outline-none focus:border-gold-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">Estado de Cuota</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full bg-bg-base border border-border text-gold-primary rounded-custom px-3 py-2 text-sm outline-none focus:border-gold-primary transition-colors cursor-pointer"
            >
              <option value="">Todos los estados</option>
              <option value="Activo">Activos</option>
              <option value="Por vencer">Por Vencer (3 días)</option>
              <option value="Vencido">Vencidos</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLA DE SOCIOS */}
      <div className="bg-bg-card rounded-custom border border-border shadow-sm overflow-hidden h-fit">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-base text-text-muted border-b border-border text-sm">
                <th className="p-4 font-semibold">Socio</th>
                <th className="p-4 font-semibold">Plan</th>
                <th className="p-4 font-semibold">Vencimiento</th>
                <th className="p-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-text-muted text-sm">
                    Cargando socios...
                  </td>
                </tr>
              ) : socios.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-text-muted text-sm">
                    No hay socios registrados.
                  </td>
                </tr>
              ) : sociosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-text-muted text-sm">
                    No se encontraron socios con esos filtros.
                  </td>
                </tr>
              ) : (
                sociosFiltrados.map((socio) => {
                  const estado = getEstadoSocio(socio.fecha_vencimiento);
                  const planSocio = planes.find((p) => p.id === socio.plan_id);

                  return (
                    <tr key={socio.id} className="border-b border-border hover:bg-bg-base/50 transition-colors">
                      <td className="p-4">
                        <p className="text-gold-primary font-bold text-sm">{socio.nombre}</p>
                        <p className="text-text-muted text-xs mt-0.5">DNI: {socio.dni}</p>
                        {socio.telefono && <p className="text-text-muted text-xs">Tel: {socio.telefono}</p>}
                      </td>
                      <td className="p-4">
                        <span className="text-text-muted text-sm bg-bg-base px-2 py-1 rounded-md border border-border">{planSocio ? planSocio.nombre : "Sin Plan"}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col items-start gap-1">
                          <span className="text-sm font-semibold text-text-muted">{socio.fecha_vencimiento.split("-").reverse().join("/")}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              estado === "Activo" ? "bg-success/10 text-success" : estado === "Por vencer" ? "bg-gold-primary/10 text-gold-primary" : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {estado}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => iniciarEdicion(socio)}
                            className="text-text-muted hover:text-gold-primary transition-colors cursor-pointer text-sm font-semibold px-2 py-1 bg-bg-base border border-border rounded-md"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => eliminarSocio(socio.id)}
                            className="text-gold-primary hover:text-bg-base hover:bg-gold-primary transition-colors cursor-pointer text-sm font-semibold px-2 py-1 bg-bg-base border border-border rounded-custom"
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

      {/* DASHBOARD INFERIOR */}
      {!cargando && socios.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          <div className="bg-bg-card p-4 rounded-custom border border-border shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold text-success">{stats.activos}</span>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider mt-1">Activos</span>
          </div>
          <div className="bg-bg-card p-4 rounded-custom border border-border shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold text-gold-primary">{stats.porVencer}</span>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider mt-1">Por Vencer</span>
          </div>
          <div className="bg-bg-card p-4 rounded-custom border border-border shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold text-red-500">{stats.vencidos}</span>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider mt-1">Vencidos</span>
          </div>
        </div>
      )}
    </div>
  );
}
