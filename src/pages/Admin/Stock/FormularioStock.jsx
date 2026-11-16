// Este archivo contiene exclusivamente el renderizado del formulario,
// recibiendo por props lo que necesita.

import { CATEGORIAS } from "../../../config";

export default function Formulario({
  form,
  editandoId,
  procesando,
  archivosSeleccionados,
  fileInputRef,
  handleChange,
  handleCategoriaChange,
  handleFilesChange,
  eliminarImagenExistente,
  manejarSubmit,
  cancelarEdicion,
}) {
  return (
    <div className="lg:col-span-1 bg-bg-card p-6 rounded-xl border border-border shadow-sm h-fit">
      <h2 className="text-xl font-bold text-white mb-4">{editandoId ? "Editar Producto" : "Nuevo Producto"}</h2>

      <form onSubmit={manejarSubmit} className="flex flex-col gap-4 text-sm">
        <div>
          <label className="block text-text-muted font-semibold mb-1">Nombre</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            placeholder="Ej: Proteína Whey 1kg"
            className="w-full bg-bg-base border border-border text-white rounded-lg px-3 py-2 outline-none focus:border-gold-primary transition-colors"
          />
        </div>

        {/* Selector de Categoría */}
        <div>
          <label className="block text-text-muted font-semibold mb-1">Categoría</label>
          <select
            name="categoria_slug"
            value={form.categoria_slug}
            onChange={handleCategoriaChange}
            required
            className="w-full bg-bg-base border border-border text-white rounded-lg px-3 py-2 outline-none focus:border-gold-primary transition-colors cursor-pointer"
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>
            {CATEGORIAS.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Precios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-text-muted font-semibold mb-1">Precio Contado</label>
            <input
              type="number"
              min="0"
              step="any"
              name="precio_contado"
              value={form.precio_contado}
              onChange={handleChange}
              required
              placeholder="45000"
              className="w-full bg-bg-base border border-border text-white rounded-lg px-3 py-2 outline-none focus:border-gold-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <div>
            <label className="block text-text-muted font-semibold mb-1">Precio Lista</label>
            <input
              type="number"
              min="0"
              step="any"
              name="precio_lista"
              value={form.precio_lista}
              onChange={handleChange}
              required
              placeholder="52000"
              className="w-full bg-bg-base border border-border text-white rounded-lg px-3 py-2 outline-none focus:border-gold-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        {/* Selector de Imágenes */}
        <div>
          <label className="block text-text-muted font-semibold mb-1">Imágenes del Producto</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className="w-full bg-bg-base border border-border text-white rounded-lg px-3 py-2 outline-none focus:border-gold-primary text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-gold-primary file:text-bg-base hover:file:bg-gold-hover transition-colors cursor-pointer"
          />

          {archivosSeleccionados.length > 0 && <p className="text-xs text-gold-primary mt-1.5">{archivosSeleccionados.length} nueva(s) imagen(es) seleccionada(s).</p>}

          {form.imgs && form.imgs.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-text-muted mb-1.5">Imágenes actuales:</p>
              <div className="flex flex-wrap gap-2">
                {form.imgs.map((url, index) => (
                  <div key={index} className="relative group">
                    <img src={url} alt="preview" className="w-12 h-12 object-cover rounded-md border border-border" />
                    <button
                      type="button"
                      onClick={() => eliminarImagenExistente(url)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] hover:bg-red-600 cursor-pointer"
                      title="Quitar imagen"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          <button
            type="submit"
            disabled={procesando}
            className="flex-1 bg-gold-primary hover:bg-gold-hover text-bg-base font-bold py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {procesando ? "Guardando..." : editandoId ? "Actualizar" : "Crear"}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={cancelarEdicion}
              className="px-4 bg-bg-base text-white font-semibold rounded-lg border border-border hover:border-gold-primary transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
