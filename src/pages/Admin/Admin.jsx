import { useNavigate } from "react-router-dom";
import { supabase } from "../../config";
import { toast } from "sonner";
import { Image, Package, Store, MessageSquareQuote, CreditCard, Users, UserCheck } from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    toast.info("Sesión cerrada");
    navigate("/login");
  };

  const modulos = [
    {
      id: "galeria",
      titulo: "Galería del Gimnasio",
      descripcion: "Gestiona las imágenes de tu gimnasio.",
      ruta: "/admin/galeria",
      icono: <Image className="w-12 h-12 mb-4 text-text-muted group-hover:text-gold-primary transition-colors" strokeWidth={1.5} />,
    },
    {
      id: "stock",
      titulo: "Control de Stock",
      descripcion: "Gestiona los productos, imágenes, y precios de tu catálogo.",
      ruta: "/admin/stock",
      icono: <Package className="w-12 h-12 mb-4 text-text-secondary group-hover:text-accent transition-colors" strokeWidth={1.5} />,
    },
    {
      id: "gimnasio",
      titulo: "Información del Gimnasio",
      descripcion: "Actualiza el nombre, WhatsApp, Instagram, ubicación, descripción y horarios.",
      ruta: "/admin/gym",
      icono: <Store className="w-12 h-12 mb-4 text-text-muted group-hover:text-gold-primary transition-colors" strokeWidth={1.5} />,
    },
    {
      id: "comentarios",
      titulo: "Comentarios y Reseñas",
      descripcion: "Administra, agrega o elimina las reseñas mostradas en la página de tu gimnasio.",
      ruta: "/admin/comentarios",
      icono: <MessageSquareQuote className="w-12 h-12 mb-4 text-text-muted group-hover:text-gold-primary transition-colors" strokeWidth={1.5} />,
    },
    {
      id: "planes",
      titulo: "Planes disponibles",
      descripcion: "Administra, agrega o elimina los planes mostrados en la página de tu gimnasio.",
      ruta: "/admin/planes",
      icono: <CreditCard className="w-12 h-12 mb-4 text-text-muted group-hover:text-gold-primary transition-colors" strokeWidth={1.5} />,
    },
    {
      id: "socios",
      titulo: "Socios actuales",
      descripcion: "Administra, agrega o elimina los socios de tu gimnasio.",
      ruta: "/admin/socios",
      icono: <Users className="w-12 h-12 mb-4 text-text-muted group-hover:text-gold-primary transition-colors" strokeWidth={1.5} />,
    },
    {
      id: "sesion",
      titulo: "Control de Acceso",
      descripcion: "Verificación de ingreso por DNI para socios.",
      ruta: "/admin/sesion",
      icono: <UserCheck className="w-12 h-12 mb-4 text-text-muted group-hover:text-gold-primary transition-colors" strokeWidth={1.5} />,
    },
  ];

  return (
    <div className="min-h-screen bg-bg-base p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gold-primary tracking-wide">Panel de Administración</h1>
          <p className="text-text-muted text-sm mt-1">Selecciona el módulo que deseas gestionar</p>
        </div>
        <button
          onClick={cerrarSesion}
          className="bg-bg-card border border-border text-gold-primary px-4 py-2 rounded-lg hover:border-gold-primary hover:bg-gold-primary hover:text-bg-base transition-colors cursor-pointer text-sm font-semibold"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Grid de Tarjetas */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {modulos.map((mod) => (
          <div
            key={mod.id}
            onClick={() => navigate(mod.ruta)}
            className="bg-bg-card border border-border rounded-xl p-8 flex flex-col items-center text-center hover:border-gold-primary hover:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all cursor-pointer group"
          >
            <div className="transform group-hover:scale-110 transition-transform duration-300">{mod.icono}</div>
            <h2 className="text-xl font-bold text-gold-primary mb-2 group-hover:text-gold-hover transition-colors">{mod.titulo}</h2>
            <p className="text-text-muted text-sm leading-relaxed">{mod.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
