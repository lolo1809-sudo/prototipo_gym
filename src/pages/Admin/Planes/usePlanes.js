import { useState, useEffect } from "react";
import { supabase } from "../../../config";
import { toast } from "sonner";
import { getAuthenticatedLocalId } from "../adminUtils";

const ESTADO_INICIAL = {
  nombre: "",
  precio: "",
  duracion_dias: 30,
  dias_semana: 3,
  description: "",
  popular: false,
};

export function usePlanes() {
  const [gimnasioId, setGimnasioId] = useState(null);
  const [planes, setPlanes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    cargarPlanes();
  }, []);

  const cargarPlanes = async () => {
    setCargando(true);
    try {
      const { localId: id } = await getAuthenticatedLocalId();
      setGimnasioId(id);

      const { data, error } = await supabase.from("planes").select("*").eq("gimnasio_id", id).order("precio", { ascending: true });

      if (error) throw error;
      setPlanes(data || []);
    } catch (error) {
      toast.error("Error al cargar planes: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!gimnasioId) return toast.error("No se pudo identificar el gimnasio.");

    setProcesando(true);

    // Convertimos a número los campos numéricos y manejamos opcionales
    const planAEnviar = {
      ...form,
      gimnasio_id: gimnasioId,
      precio: Number(form.precio),
      duracion_dias: form.duracion_dias ? Number(form.duracion_dias) : null,
      dias_semana: form.dias_semana ? Number(form.dias_semana) : null,
    };

    if (editandoId) {
      const { error } = await supabase.from("planes").update(planAEnviar).eq("id", editandoId);
      if (error) toast.error("Error al actualizar.");
      else toast.success("Plan actualizado.");
    } else {
      const { error } = await supabase.from("planes").insert([planAEnviar]);
      if (error) toast.error("Error al crear el plan.");
      else toast.success("Plan creado exitosamente.");
    }

    setForm(ESTADO_INICIAL);
    setEditandoId(null);
    cargarPlanes();
    setProcesando(false);
  };

  const iniciarEdicion = (plan) => {
    setForm({
      nombre: plan.nombre,
      precio: plan.precio,
      duracion_dias: plan.duracion_dias || "",
      dias_semana: plan.dias_semana || "",
      description: plan.description || "",
      popular: plan.popular || false,
    });
    setEditandoId(plan.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelarEdicion = () => {
    setForm(ESTADO_INICIAL);
    setEditandoId(null);
  };

  const eliminarPlan = async (id) => {
    toast("¿Eliminar este plan?", {
      action: {
        label: "Eliminar",
        onClick: async () => {
          const { error } = await supabase.from("planes").delete().eq("id", id);
          if (error) toast.error("Error al eliminar.");
          else {
            toast.success("Plan eliminado.");
            cargarPlanes();
          }
        },
      },
      cancel: { label: "Cancelar" },
    });
  };

  return { planes, cargando, procesando, form, editandoId, handleChange, manejarSubmit, iniciarEdicion, cancelarEdicion, eliminarPlan };
}
