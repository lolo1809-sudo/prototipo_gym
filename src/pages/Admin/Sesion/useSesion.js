import { useState } from "react";
import { supabase } from "../../../config";
import { getAuthenticatedLocalId } from "../adminUtils";

export function useSesion() {
  const [dni, setDni] = useState("");
  const [estadoAcceso, setEstadoAcceso] = useState(null); // 'permitido' | 'denegado' | null
  const [mensaje, setMensaje] = useState("");
  const [socio, setSocio] = useState(null);
  const [infoPlan, setInfoPlan] = useState(null); // { nombrePlan, diasTotales, diasRestantes, yaIngresoHoy }
  const [procesando, setProcesando] = useState(false);

  const reproducirAlarma = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = "square";
      const ahora = audioCtx.currentTime;
      oscillator.frequency.setValueAtTime(350, ahora);
      oscillator.frequency.exponentialRampToValueAtTime(600, ahora + 0.4);
      oscillator.frequency.setValueAtTime(350, ahora + 0.75);
      oscillator.frequency.exponentialRampToValueAtTime(600, ahora + 1.15);

      gainNode.gain.setValueAtTime(0.35, ahora);
      gainNode.gain.setValueAtTime(0.35, ahora + 1.2);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ahora + 1.5);

      oscillator.start(ahora);
      oscillator.stop(ahora + 1.5);
    } catch (err) {
      console.error("Audio bloqueado:", err);
    }
  };

  // Devuelve el lunes de la semana actual en formato YYYY-MM-DD
  const obtenerInicioSemana = () => {
    const hoy = new Date();
    const dia = hoy.getDay(); // 0 (Dom) a 6 (Sáb)
    const diff = hoy.getDate() - dia + (dia === 0 ? -6 : 1);
    const lunes = new Date(hoy.setDate(diff));
    return lunes.toISOString().split("T")[0];
  };

  const lanzarAlerta = (estado, texto, dataSocio = null, datosPlan = null) => {
    setEstadoAcceso(estado);
    setMensaje(texto);
    setSocio(dataSocio);
    setInfoPlan(datosPlan);

    if (estado === "denegado") {
      reproducirAlarma();
    }

    setTimeout(() => {
      setEstadoAcceso(null);
      setMensaje("");
      setSocio(null);
      setInfoPlan(null);
    }, 3500);
  };

  const manejarCheckIn = async (e) => {
    e.preventDefault();
    if (!dni.trim()) return;

    setProcesando(true);
    setEstadoAcceso(null);

    try {
      const { localId } = await getAuthenticatedLocalId();

      // 1. Traer socio junto con los datos de su plan (JOIN)
      const { data: socioData, error: errorSocio } = await supabase.from("socios").select("*, planes(nombre, dias_semana)").eq("gimnasio_id", localId).eq("dni", dni.trim()).limit(1).maybeSingle();

      if (errorSocio) throw errorSocio;

      if (!socioData) {
        lanzarAlerta("denegado", "Socio no registrado. Verifique el DNI.");
        return;
      }

      // 2. Validar fecha de vencimiento de cuota
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const fechaVencimiento = new Date(socioData.fecha_vencimiento + "T00:00:00");

      if (fechaVencimiento < hoy) {
        const fechaFormateada = socioData.fecha_vencimiento.split("-").reverse().join("/");
        lanzarAlerta("denegado", `Cuota vencida desde el ${fechaFormateada}.`, socioData);
        return;
      }

      // 3. Consultar asistencias de esta semana
      const hoyStr = new Date().toISOString().split("T")[0];
      const lunesStr = obtenerInicioSemana();

      const { data: asistenciasSemana, error: errorAsist } = await supabase.from("asistencias").select("fecha").eq("socio_id", socioData.id).gte("fecha", lunesStr);

      if (errorAsist) throw errorAsist;

      const diasUsados = asistenciasSemana.length;
      const yaIngresoHoy = asistenciasSemana.some((a) => a.fecha === hoyStr);
      // Si dias_semana es estrictamente null o undefined, usa 7. Si es 0 o un número, respétalo.
      const diasPermitidos = socioData.planes?.dias_semana ?? 7;
      const nombrePlan = socioData.planes?.nombre || "Sin plan asignado";

      // 4. Si ya ingresó hoy, permitir paso sin restar días
      if (yaIngresoHoy) {
        const restantes = Math.max(0, diasPermitidos - diasUsados);
        lanzarAlerta("permitido", "Ya registraste tu ingreso hoy.", socioData, {
          nombrePlan,
          diasTotales: diasPermitidos,
          diasRestantes: restantes,
          yaIngresoHoy: true,
        });
        return;
      }

      // 5. Validar si agotó sus días semanales
      if (diasUsados >= diasPermitidos) {
        lanzarAlerta("denegado", `Límite semanal alcanzado (${diasPermitidos}/${diasPermitidos} días usados).`, socioData, {
          nombrePlan,
          diasTotales: diasPermitidos,
          diasRestantes: 0,
          yaIngresoHoy: false,
        });
        return;
      }

      // 6. Registrar nueva asistencia de hoy
      const { error: errorInsert } = await supabase.from("asistencias").insert([
        {
          socio_id: socioData.id,
          gimnasio_id: localId,
          fecha: hoyStr,
        },
      ]);

      if (errorInsert) throw errorInsert;

      const nuevosRestantes = diasPermitidos - (diasUsados + 1);

      lanzarAlerta("permitido", "Acceso autorizado.", socioData, {
        nombrePlan,
        diasTotales: diasPermitidos,
        diasRestantes: nuevosRestantes,
        yaIngresoHoy: false,
      });
    } catch (error) {
      console.error("Error en Check-In:", error);
      lanzarAlerta("denegado", "Error al conectar con la base de datos.");
    } finally {
      setProcesando(false);
      setDni("");
    }
  };

  return { dni, setDni, estadoAcceso, mensaje, socio, infoPlan, procesando, manejarCheckIn };
}
