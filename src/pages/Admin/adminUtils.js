// Funciones reutilizables en los archivos de Admin

import { supabase } from "../../config";

export async function getAuthenticatedLocalId() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("No hay una sesión activa.");

  const { data: gimnasioData, error: gimnasioError } = await supabase.from("gimnasios").select("id").eq("user_id", user.id).single();

  if (gimnasioError || !gimnasioData) throw new Error("No se encontró un gimnasio asociado.");

  return { userId: user.id, localId: gimnasioData.id };
}
