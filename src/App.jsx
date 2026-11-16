import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "./config.jsx";
import { Toaster } from "sonner";

// Páginas
import Inicio from "./pages/Inicio";
import GaleriaCompleta from "./pages/GaleriaCompleta.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";

// Componentes
import PantallaCarga from "./components/PantallaCarga";
import ScrollToTop from "./components/ScrollToTop.jsx";
import RutaProtegida from "./components/RutaProtegida.jsx";
import LayoutPublico from "./components/LayoutPublico.jsx";

// Admin
import Admin from "./pages/Admin/Admin";
import AdminGaleria from "./pages/Admin/Galeria/AdminGaleria";
import AdminGym from "./pages/Admin/InfoGym/AdminGym";
import AdminComentarios from "./pages/Admin/Comentarios/AdminComentarios";
import AdminPlanes from "./pages/Admin/Planes/AdminPlanes.jsx";
import AdminSocios from "./pages/Admin/Socios/AdminSocios.jsx";
import AdminSesion from "./pages/Admin/Sesion/AdminSesion.jsx";
import AdminStock from "./pages/Admin/Stock/AdminStock.jsx";

function App() {
  const [gymData, setGymData] = useState(null);
  const [planesData, setPlanesData] = useState([]);
  const [resenasData, setResenasData] = useState([]);
  const [productosData, setProductosData] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatosDelGym = async () => {
      setCargando(true);

      const currentHost = window.location.hostname.replace(/^www\./, "");

      try {
        // Consultas en paralelo filtrando por el slug del gimnasio
        const [respGym, respPlanes, respResenas, respProductos] = await Promise.all([
          // 1. Datos del gimnasio
          supabase.from("gimnasios").select("*").eq("slug", currentHost).maybeSingle(),

          // 2. Planes asociados al gimnasio
          supabase
            .from("planes")
            .select(
              `
              *,
              gimnasios!inner ( slug )
            `,
            )
            .eq("gimnasios.slug", currentHost),

          // 3. Reseñas asociadas al gimnasio
          supabase
            .from("resenas")
            .select(
              `
              *,
              gimnasios!inner ( slug )
            `,
            )
            .eq("gimnasios.slug", currentHost),

          // 4. Productos asociados al gimnasio
          supabase
            .from("productos")
            .select(
              `
              *,
              gimnasios!inner ( slug )
            `,
            )
            .eq("gimnasios.slug", currentHost)
            .order("created_at", { ascending: false }),
        ]);

        if (!respGym.error && respGym.data) {
          setGymData(respGym.data);
        }

        if (!respPlanes.error) {
          setPlanesData(respPlanes.data || []);
        }

        if (!respResenas.error) {
          setResenasData(respResenas.data || []);
        }

        if (!respProductos.error) {
          setProductosData(respProductos.data || []);
        }
      } catch (error) {
        console.error("Error cargando los datos del gimnasio:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatosDelGym();
  }, []);

  if (cargando) {
    return <PantallaCarga />;
  }

  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" theme="dark" />
      <ScrollToTop />

      <Routes>
        {/* Rutas de administrador (privadas), NO se muestra el Footer.jsx */}
        <Route path="/login" element={<Login />} />
        <Route element={<RutaProtegida />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/galeria" element={<AdminGaleria />} />
          <Route path="/admin/gym" element={<AdminGym />} />
          <Route path="/admin/comentarios" element={<AdminComentarios />} />
          <Route path="/admin/planes" element={<AdminPlanes />} />
          <Route path="/admin/socios" element={<AdminSocios />} />
          <Route path="/admin/sesion" element={<AdminSesion />} />
          <Route path="/admin/stock" element={<AdminStock />} />
        </Route>

        {/* Rutas públicas, se muestra el Footer.jsx */}
        <Route element={<LayoutPublico gym={gymData} />}>
          <Route path="/" element={<Inicio gym={gymData} planes={planesData} resenas={resenasData} productos={productosData} />} />
          <Route path="/galeria" element={<GaleriaCompleta imagenes={gymData?.imgs || []} />} />
          <Route path="/categorias/:categoria" element={<CategoryPage productos={productosData} />} />
          <Route path="/producto/:id" element={<ProductDetail productos={productosData} local={gymData} />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
