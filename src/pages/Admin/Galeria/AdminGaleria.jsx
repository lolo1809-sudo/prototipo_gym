import AdminLayout from "../AdminLayout";
import { useGaleria } from "./useGaleria";
import { Trash2, Upload } from "lucide-react";

export default function AdminGaleria() {
  const { imagenes, cargando, procesando, fileInputRef, handleFilesChange, eliminarImagen } = useGaleria();

  return (
    <AdminLayout>
      <div className="bg-bg-card p-6 rounded-xl border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-gold-primary">Galería del Gimnasio</h2>

          <label
            className={`w-full sm:w-auto justify-center flex items-center gap-2 bg-gold-primary hover:bg-gold-hover text-bg-base font-bold py-2.5 px-4 rounded-lg transition-colors cursor-pointer ${
              procesando ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <Upload className="w-5 h-5" />
            {procesando ? "Subiendo imágenes..." : "Subir Imágenes"}
            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFilesChange} className="hidden" disabled={procesando} />
          </label>
        </div>

        {cargando ? (
          <p className="text-text-muted text-center py-10 font-semibold">Cargando galería...</p>
        ) : imagenes.length === 0 ? (
          <p className="text-text-muted text-center py-10 font-semibold">No hay imágenes en la galería actualmente.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imagenes.map((url, index) => (
              <div key={index} className="relative group rounded-lg overflow-hidden border border-border bg-bg-base">
                <img src={url} alt={`Galería ${index + 1}`} className="w-full h-48 object-cover" />

                <div className="absolute inset-0 bg-bg-base/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => eliminarImagen(url)}
                    className="bg-bg-card text-text-muted hover:text-bg-base hover:bg-gold-primary p-3 rounded-full border border-border transition-colors cursor-pointer"
                    title="Eliminar imagen"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
