// Este archivo se encarga de centralizar todos los estados, efectos y funciones (la lógica pesada) del apartado de Local.

import { useState, useEffect } from "react";
import { supabase } from "../../../config";
import { toast } from "sonner";
import { procesarLinkMaps } from "./procesarLinkMaps";
import { getAuthenticatedLocalId } from "../adminUtils";

export function useGym() {
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [localId, setLocalId] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    whatsapp: "",
    instagram: "",
    ubicacion: "",
    descripcion: "",
    horarios_atencion: "",
  });

  useEffect(() => {
    cargarDatosDelLocal();
  }, []);

  const cargarDatosDelLocal = async () => {
    setCargando(true);
    try {
      const { localId: id } = await getAuthenticatedLocalId();

      const { data, error } = await supabase.from("gimnasios").select("*").eq("id", id).single();

      if (error) throw error;

      if (data) {
        setLocalId(data.id);
        setForm({
          nombre: data.nombre || "",
          whatsapp: data.whatsapp || "",
          instagram: data.instagram || "",
          ubicacion: data.ubicacion || "",
          descripcion: data.descripcion || "",
          horarios_atencion: data.horarios_atencion || "",
        });
      }
    } catch (error) {
      toast.error("Error al cargar la información: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!localId) return toast.error("No se encontró el gimnasio para actualizar.");

    let urlMapsNormalizada = "";
    if (form.ubicacion) {
      const urlValida = procesarLinkMaps(form.ubicacion);
      if (!urlValida) {
        toast.error("El link del mapa no es válido. Debes usar la opción 'Insertar en un mapa' de Google Maps.");
        return;
      }
      urlMapsNormalizada = urlValida;
    }

    setProcesando(true);

    const datosAEnviar = {
      ...form,
      ubicacion: urlMapsNormalizada,
    };

    const { error } = await supabase.from("gimnasios").update(datosAEnviar).eq("id", localId);

    if (error) {
      toast.error("Error al actualizar: " + error.message);
    } else {
      setForm((prev) => ({ ...prev, ubicacion: urlMapsNormalizada }));
      toast.success("Información del gimnasio actualizada correctamente.");
    }
    setProcesando(false);
  };

  return {
    cargando,
    procesando,
    form,
    handleChange,
    manejarSubmit,
  };
}
