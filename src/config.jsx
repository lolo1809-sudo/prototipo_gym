// Conectar la aplicación de React con la base de datos de Supabase
import { createClient } from "@supabase/supabase-js";
import { Pill, Dumbbell } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Lista centralizada única de categorías
export const CATEGORIAS = [
  {
    slug: "suplementos",
    nombre: "Suplementos",
    img: "https://images.unsplash.com/photo-1693996045300-521e9d08cabc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    icon: <Pill className="w-5 h-5" />,
  },

  {
    slug: "accesorios",
    nombre: "Accesorios Deportivos",
    img: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    icon: <Dumbbell className="w-5 h-5" />,
  },
];
