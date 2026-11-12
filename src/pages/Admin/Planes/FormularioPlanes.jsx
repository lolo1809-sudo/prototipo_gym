export default function FormularioPlanes({ form, editandoId, procesando, handleChange, manejarSubmit, cancelarEdicion }) {
  return (
    <div className="lg:col-span-1 bg-bg-card p-6 rounded-custom border border-border shadow-sm h-fit">
      <h2 className="text-xl font-bold text-gold-primary mb-4">{editandoId ? "Editar Plan" : "Nuevo Plan"}</h2>
      <form onSubmit={manejarSubmit} className="flex flex-col gap-4 text-sm">
        <div>
          <label className="block text-text-muted font-semibold mb-1">Nombre del Plan</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            placeholder="Ej: Pase Libre"
            className="w-full bg-bg-base border border-border text-gold-primary rounded-custom px-3 py-2 outline-none focus:border-gold-primary"
          />
        </div>

        <div>
          <label className="block text-text-muted font-semibold mb-1">Precio ($)</label>
          <input
            type="number"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            required
            placeholder="Ej: 15000"
            className="w-full bg-bg-base border border-border text-gold-primary rounded-custom px-3 py-2 outline-none focus:border-gold-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-text-muted font-semibold mb-1">Días de duración</label>
            <input
              type="number"
              name="duracion_dias"
              value={form.duracion_dias}
              onChange={handleChange}
              placeholder="Ej: 30"
              className="w-full bg-bg-base border border-border text-gold-primary rounded-custom px-3 py-2 outline-none focus:border-gold-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-text-muted font-semibold mb-1">Días / semana</label>
            <input
              type="number"
              name="dias_semana"
              value={form.dias_semana}
              onChange={handleChange}
              placeholder="Ej: 3"
              className="w-full bg-bg-base border border-border text-gold-primary rounded-custom px-3 py-2 outline-none focus:border-gold-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-text-muted font-semibold mb-1">Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            placeholder="Detalles de lo que incluye el plan..."
            className="w-full bg-bg-base border border-border text-gold-primary rounded-custom px-3 py-2 outline-none focus:border-gold-primary resize-none"
          ></textarea>
        </div>

        <label className="flex items-center gap-2 cursor-pointer mt-1">
          <input type="checkbox" name="popular" checked={form.popular} onChange={handleChange} className="w-4 h-4 accent-gold-primary cursor-pointer" />
          <span className="text-text-muted font-semibold">Marcar como plan Destacado / Popular</span>
        </label>

        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            disabled={procesando}
            className="flex-1 bg-gold-primary hover:bg-gold-hover text-bg-base font-bold py-2.5 rounded-custom transition-colors cursor-pointer disabled:opacity-50"
          >
            {procesando ? "Guardando..." : editandoId ? "Actualizar" : "Crear"}
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
