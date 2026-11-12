import { useState, useEffect, useRef } from "react";
import { supabase } from "../../../config";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { getAuthenticatedLocalId } from "../adminUtils";

export function useGaleria() {
  const [imagenes, setImagenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [gimnasioId, setGimnasioId] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    cargarGaleria();
  }, []);

  const cargarGaleria = async () => {
    setCargando(true);
    try {
      const { localId } = await getAuthenticatedLocalId();
      setGimnasioId(localId);

      const { data, error } = await supabase.from("gimnasios").select("imgs").eq("id", localId).single();

      if (error) throw error;
      setImagenes(data.imgs || []);
    } catch (error) {
      toast.error("Error al cargar la galería: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  const handleFilesChange = async (e) => {
    const archivos = Array.from(e.target.files);
    if (!archivos.length) return;

    setProcesando(true);
    try {
      // Obtenemos userId para la estructura de carpetas
      const { userId, localId } = await getAuthenticatedLocalId();
      let urlsNuevas = [];

      for (const archivo of archivos) {
        const opcionesCompresion = {
          maxSizeMB: 0.12,
          maxWidthOrHeight: 850,
          useWebWorker: true,
          fileType: "image/webp",
        };

        let archivoComprimido = archivo;
        const nombreOriginal = archivo.name.split(".")[0];

        try {
          archivoComprimido = await imageCompression(archivo, opcionesCompresion);
        } catch (errorCompresion) {
          console.error("Error al comprimir:", errorCompresion);
        }

        // Se guarda en: imgs/{userId}/{timestamp}-{random}-{nombre}.webp
        const nombreArchivo = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${nombreOriginal}.webp`;

        const { error: errorUpload } = await supabase.storage.from("imgs").upload(nombreArchivo, archivoComprimido);
        if (errorUpload) throw errorUpload;

        const { data: urlData } = supabase.storage.from("imgs").getPublicUrl(nombreArchivo);
        urlsNuevas.push(urlData.publicUrl);
      }

      const imgsActualizadas = [...imagenes, ...urlsNuevas];
      const { error: errorUpdate } = await supabase.from("gimnasios").update({ imgs: imgsActualizadas }).eq("id", localId);
      if (errorUpdate) throw errorUpdate;

      toast.success("Imágenes subidas correctamente");
      setImagenes(imgsActualizadas);
    } catch (error) {
      toast.error("Error al subir imágenes: " + error.message);
    } finally {
      setProcesando(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const eliminarImagen = (urlAEliminar) => {
    toast("¿Seguro que deseas eliminar esta imagen?", {
      duration: Infinity,
      action: {
        label: "Eliminar",
        onClick: async () => {
          try {
            // Corta después de "imgs/" para obtener "userId/nombre-archivo.webp"
            const ruta = urlAEliminar.split("imgs/")[1];

            if (ruta) {
              const rutaDecodificada = decodeURIComponent(ruta.split("?")[0]);
              const { error: errorStorage } = await supabase.storage.from("imgs").remove([rutaDecodificada]);

              if (errorStorage) throw errorStorage;
            }

            const imgsRestantes = imagenes.filter((url) => url !== urlAEliminar);
            const { error: errorUpdate } = await supabase.from("gimnasios").update({ imgs: imgsRestantes }).eq("id", gimnasioId);

            if (errorUpdate) throw errorUpdate;

            toast.success("Imagen eliminada correctamente");
            setImagenes(imgsRestantes);
          } catch (error) {
            toast.error("Error al eliminar: " + error.message);
          }
        },
      },
      cancel: { label: "Cancelar" },
    });
  };

  return {
    imagenes,
    cargando,
    procesando,
    fileInputRef,
    handleFilesChange,
    eliminarImagen,
  };
}
