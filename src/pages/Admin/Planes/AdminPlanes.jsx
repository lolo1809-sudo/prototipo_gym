import AdminLayout from "../AdminLayout";
import { usePlanes } from "./usePlanes";
import FormularioPlanes from "./FormularioPlanes";
import TablaPlanes from "./TablaPlanes";

export default function AdminPlanes() {
  const { planes, cargando, procesando, form, editandoId, handleChange, manejarSubmit, iniciarEdicion, cancelarEdicion, eliminarPlan } = usePlanes();

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <FormularioPlanes form={form} editandoId={editandoId} procesando={procesando} handleChange={handleChange} manejarSubmit={manejarSubmit} cancelarEdicion={cancelarEdicion} />

        <TablaPlanes cargando={cargando} planes={planes} iniciarEdicion={iniciarEdicion} eliminarPlan={eliminarPlan} />
      </div>
    </AdminLayout>
  );
}
