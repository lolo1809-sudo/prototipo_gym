import { useState, useEffect } from "react";
import { supabase } from "../../../config";
import { toast } from "sonner";
import { getAuthenticatedLocalId } from "../adminUtils";

const ESTADO_INICIAL = {
  nombre: "",
  dni: "",
  telefono: "",
  plan_id: "",
  monto: "",
  metodo_pago: "efectivo",
  fecha_vencimiento: "",
};

export function useSocios() {
  const [gimnasioId, setGimnasioId] = useState(null);
  const [socios, setSocios] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const { localId } = await getAuthenticatedLocalId();
      setGimnasioId(localId);

      // Cargar planes para el selector
      const { data: planesData, error: errorPlanes } = await supabase.from("planes").select("*").eq("gimnasio_id", localId);
      if (errorPlanes) throw errorPlanes;
      setPlanes(planesData || []);

      // Cargar socios
      const { data: sociosData, error: errorSocios } = await supabase.from("socios").select("*").eq("gimnasio_id", localId).order("created_at", { ascending: false });
      if (errorSocios) throw errorSocios;
      setSocios(sociosData || []);
    } catch (error) {
      toast.error("Error al cargar datos: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Autocompleta monto y vencimiento al elegir un plan
  const handlePlanChange = (e) => {
    const planId = e.target.value;
    const planSeleccionado = planes.find((p) => p.id === planId);

    if (planSeleccionado) {
      const nuevaFecha = new Date();
      nuevaFecha.setDate(nuevaFecha.getDate() + (planSeleccionado.duracion_dias || 30));

      setForm({
        ...form,
        plan_id: planId,
        monto: planSeleccionado.precio,
        fecha_vencimiento: nuevaFecha.toISOString().split("T")[0],
      });
    } else {
      setForm({ ...form, plan_id: planId });
    }
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!gimnasioId) return toast.error("No se pudo identificar el gimnasio.");
    setProcesando(true);

    try {
      const socioAEnviar = {
        gimnasio_id: gimnasioId,
        nombre: form.nombre,
        dni: form.dni,
        telefono: form.telefono,
        plan_id: form.plan_id,
        fecha_vencimiento: form.fecha_vencimiento,
      };

      if (editandoId) {
        // 1. Actualizar socio
        const { data: ultimoPago, error: errorBuscarPago } = await supabase.from("pagos").select("id").eq("socio_id", editandoId).order("fecha_pago", { ascending: false }).limit(1).maybeSingle();

        if (errorBuscarPago) throw errorBuscarPago;

        // 2. Actualizar el último pago registrado de este socio
        if (ultimoPago) {
          const { error: errorUpdatePago } = await supabase
            .from("pagos")
            .update({ monto: Number(form.monto), metodo_pago: form.metodo_pago })
            .eq("id", ultimoPago.id);
          if (errorUpdatePago) throw errorUpdatePago;
        } else {
          // Si por alguna razón no tenía pago, se lo creamos
          const { error: errorInsertPago } = await supabase.from("pagos").insert([{ socio_id: editandoId, monto: Number(form.monto), metodo_pago: form.metodo_pago }]);
          if (errorInsertPago) throw errorInsertPago;
        }

        toast.success("Socio y pago actualizados.");
      } else {
        // 1. Insertar socio
        const { data: nuevoSocio, error: errorSocio } = await supabase.from("socios").insert([socioAEnviar]).select().single();
        if (errorSocio) throw errorSocio;

        // 2. Insertar pago vinculado al socio recién creado
        const { error: errorPago } = await supabase.from("pagos").insert([{ socio_id: nuevoSocio.id, monto: Number(form.monto), metodo_pago: form.metodo_pago }]);
        if (errorPago) throw errorPago;

        toast.success("Socio y pago registrados exitosamente.");
      }

      setForm(ESTADO_INICIAL);
      setEditandoId(null);
      cargarDatos();
    } catch (error) {
      toast.error("Error al guardar: " + error.message);
    } finally {
      setProcesando(false);
    }
  };

  const iniciarEdicion = async (socio) => {
    const { data: pagoData } = await supabase.from("pagos").select("*").eq("socio_id", socio.id).order("fecha_pago", { ascending: false }).limit(1).maybeSingle();

    const planDelSocio = planes.find((p) => p.id === socio.plan_id);

    setForm({
      nombre: socio.nombre,
      dni: socio.dni,
      telefono: socio.telefono || "",
      plan_id: socio.plan_id || "",
      fecha_vencimiento: socio.fecha_vencimiento || "",
      monto: pagoData?.monto ?? planDelSocio?.precio ?? "",
      metodo_pago: pagoData?.metodo_pago || "efectivo",
    });
    setEditandoId(socio.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelarEdicion = () => {
    setForm(ESTADO_INICIAL);
    setEditandoId(null);
  };

  const eliminarSocio = async (id) => {
    toast("¿Eliminar este socio y su historial?", {
      action: {
        label: "Eliminar",
        onClick: async () => {
          // 1. Borrar pagos primero (para evitar errores de clave foránea)
          await supabase.from("pagos").delete().eq("socio_id", id);

          // 2. Borrar socio
          const { error } = await supabase.from("socios").delete().eq("id", id);

          if (error) toast.error("Error al eliminar el socio.");
          else {
            toast.success("Socio eliminado.");
            cargarDatos();
          }
        },
      },
      cancel: { label: "Cancelar" },
    });
  };

  return { socios, planes, cargando, procesando, form, editandoId, handleChange, handlePlanChange, manejarSubmit, iniciarEdicion, cancelarEdicion, eliminarSocio };
}
