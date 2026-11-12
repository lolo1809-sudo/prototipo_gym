import AdminLayout from "../AdminLayout";
import { useSocios } from "./useSocios";
import FormularioSocios from "./FormularioSocios";
import TablaSocios from "./TablaSocios";

export default function AdminSocios() {
  const { socios, planes, cargando, procesando, form, editandoId, handleChange, handlePlanChange, manejarSubmit, iniciarEdicion, cancelarEdicion, eliminarSocio } = useSocios();

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <FormularioSocios
          form={form}
          planes={planes}
          editandoId={editandoId}
          procesando={procesando}
          handleChange={handleChange}
          handlePlanChange={handlePlanChange}
          manejarSubmit={manejarSubmit}
          cancelarEdicion={cancelarEdicion}
        />

        <TablaSocios cargando={cargando} socios={socios} planes={planes} iniciarEdicion={iniciarEdicion} eliminarSocio={eliminarSocio} />
      </div>
    </AdminLayout>
  );
}
