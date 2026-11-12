export default function FormularioSocios({ form, planes, editandoId, procesando, handleChange, handlePlanChange, manejarSubmit, cancelarEdicion }) {
  return (
    <div className="lg:col-span-1 bg-bg-card p-6 rounded-custom border border-border shadow-sm h-fit">
      <h2 className="text-xl font-bold text-gold-primary mb-4">{editandoId ? "Editar Socio" : "Nuevo Socio"}</h2>
      <form onSubmit={manejarSubmit} className="flex flex-col gap-4 text-sm">
        <div>
          <label className="block text-text-muted font-semibold mb-1">Nombre Completo</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            placeholder="Ej: Juan Pérez"
            className="w-full bg-bg-base border border-border text-gold-primary rounded-custom px-3 py-2 outline-none focus:border-gold-primary"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-text-muted font-semibold mb-1">DNI</label>
            <input
              name="dni"
              value={form.dni}
              onChange={handleChange}
              required
              placeholder="Sin puntos"
              className="w-full bg-bg-base border border-border text-gold-primary rounded-custom px-3 py-2 outline-none focus:border-gold-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-text-muted font-semibold mb-1">Teléfono</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Ej: 2645..."
              className="w-full bg-bg-base border border-border text-gold-primary rounded-custom px-3 py-2 outline-none focus:border-gold-primary"
            />
          </div>
        </div>

        <hr className="border-border my-2" />

        <div>
          <label className="block text-text-muted font-semibold mb-1">Plan a contratar</label>
          <select
            name="plan_id"
            value={form.plan_id}
            onChange={handlePlanChange}
            required
            className="w-full bg-bg-base border border-border text-gold-primary rounded-custom px-3 py-2 outline-none focus:border-gold-primary cursor-pointer"
          >
            <option value="" disabled>
              Selecciona un plan
            </option>
            {planes.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.nombre} - ${plan.precio}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-text-muted font-semibold mb-1">Monto ($)</label>
            <input
              type="number"
              name="monto"
              value={form.monto}
              onChange={handleChange}
              required
              className="w-full bg-bg-base border border-border text-gold-primary rounded-custom px-3 py-2 outline-none focus:border-gold-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-text-muted font-semibold mb-1">Método</label>
            <select
              name="metodo_pago"
              value={form.metodo_pago}
              onChange={handleChange}
              className="w-full bg-bg-base border border-border text-gold-primary rounded-custom px-3 py-2 outline-none focus:border-gold-primary cursor-pointer"
            >
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-text-muted font-semibold mb-1">Fecha de Vencimiento</label>
          <input
            type="date"
            name="fecha_vencimiento"
            value={form.fecha_vencimiento}
            onChange={handleChange}
            required
            className="w-full bg-bg-base border border-border text-gold-primary rounded-custom px-3 py-2 outline-none focus:border-gold-primary"
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            disabled={procesando}
            className="flex-1 bg-gold-primary hover:bg-gold-hover text-bg-base font-bold py-2.5 rounded-custom transition-colors cursor-pointer disabled:opacity-50"
          >
            {procesando ? "Guardando..." : editandoId ? "Actualizar" : "Registrar Socio"}
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={cancelarEdicion}
              className="px-4 bg-bg-base text-gold-primary font-semibold rounded-custom border border-border hover:bg-border transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
