import { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { ModalTarea } from "./ModalTareas";
import type { Tarea } from "./tareas.types";
import { eliminarTarea, obtenerTareas, actualizarTarea } from "./tareas.service";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

type Filtro = "todas" | "completadas" | "pendientes" | "proceso" | "retrasadas";

// Función para comparar fechas correctamente (ignorando segundos/milisegundos)
const isRetrasada = (fechaFinStr: string) => {
  if (!fechaFinStr) return false;
  // Asegura que la fecha tenga segundos para evitar desfases por zona horaria
  const fechaFin = new Date(fechaFinStr.length === 16 ? fechaFinStr + ":00" : fechaFinStr);
  const ahora = new Date();
  return fechaFin.getTime() < ahora.getTime();
};

export const Tareas = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<Tarea | undefined>();
  const [filtro, setFiltro] = useState<Filtro>("todas");

  const cargarTareas = async () => {
    try {
      const data = await obtenerTareas();
      setTareas(data);
    } catch (error) {
      console.error("Error al obtener las tareas:", error);
    }
  };

  const abrirModal = (tarea?: Tarea) => {
    setTareaEditando(tarea);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setTareaEditando(undefined);
    setMostrarModal(false);
    cargarTareas();
  };

  const confirmarEliminacion = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Está seguro de eliminar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      await eliminarTarea(id);
      toast.success("Tarea eliminada", { position: "top-right", autoClose: 1000 });
      cargarTareas();
    }
  };

  const marcarCompletada = async (t: Tarea) => {
    await actualizarTarea(t.id, { ...t, completada: !t.completada });
    cargarTareas();
  };

  const marcarEnEjecucion = async (t: Tarea) => {
    await actualizarTarea(t.id, { ...t, enEjecucion: !t.enEjecucion });
    cargarTareas();
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  const filtrarTareas = () => {
    switch (filtro) {
      case "completadas":
        return tareas.filter(t => t.completada);
      case "pendientes":
        return tareas.filter(t => !t.completada);
      case "proceso":
        return tareas.filter(t => t.enEjecucion);
      case "retrasadas":
        return tareas.filter(t => isRetrasada(t.fechaFin));
      default:
        return tareas;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Tareas</h2>
        <button onClick={() => abrirModal()} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition">
          <FiPlus className="text-lg" />
          <span className="text-sm sm:text-base">Agregar</span>
        </button>
      </div>
      <div className="flex gap-2 mb-2">
        <button onClick={() => setFiltro("todas")} className={`px-3 py-1 rounded-xl ${filtro === "todas" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Todas</button>
        <button onClick={() => setFiltro("completadas")} className={`px-3 py-1 rounded-xl ${filtro === "completadas" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Completadas</button>
        <button onClick={() => setFiltro("pendientes")} className={`px-3 py-1 rounded-xl ${filtro === "pendientes" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Pendientes</button>
        <button onClick={() => setFiltro("proceso")} className={`px-3 py-1 rounded-xl ${filtro === "proceso" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>En ejecución</button>
        <button onClick={() => setFiltro("retrasadas")} className={`px-3 py-1 rounded-xl ${filtro === "retrasadas" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Retrasadas</button>
      </div>
      <div className="max-w-4xl mx-auto px-4">
        <table className="w-full table-auto border bg-white border-gray-300 mt-4 rounded-xl shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Nombre</th>
              <th className="text-left px-4 py-2">Descripción</th>
              <th className="text-left px-4 py-2">Inicio</th>
              <th className="text-left px-4 py-2">Fin</th>
              <th className="text-left px-4 py-2">Actividades</th>
              <th className="text-center px-4 py-2">Completada</th>
              <th className="text-center px-4 py-2">En Ejecución</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrarTareas().map((t) => (
              <tr key={t.id} className="border-t border-gray-200">
                <td className="px-4 py-2">{t.id}</td>
                <td className="px-4 py-2">{t.nombre}</td>
                <td className="px-4 py-2">{t.descripcion}</td>
                <td className="px-4 py-2">{t.fechaInicio.replace("T", " ")}</td>
                <td className="px-4 py-2">{t.fechaFin.replace("T", " ")}</td>
                <td className="px-4 py-2">
                  <ul className="list-disc pl-4">
                    {t.actividades.map((a, i) => (
                      <li key={i}>{a.nombre} ({a.tiempo} min)</li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2 text-center">
                  <input type="checkbox" checked={t.completada} onChange={() => marcarCompletada(t)} />
                </td>
                <td className="px-4 py-2 text-center">
                  <input type="checkbox" checked={t.enEjecucion} onChange={() => marcarEnEjecucion(t)} disabled={t.completada} />
                </td>
                <td className="p-2 flex justify-center gap-3">
                  <button onClick={() => abrirModal(t)} className="text-blue-600 hover:text-blue-800"><FiEdit /></button>
                  <button onClick={() => confirmarEliminacion(t.id)} className="text-red-600 hover:text-red-800"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {mostrarModal && (
        <ModalTarea onClose={cerrarModal} tarea={tareaEditando ?? undefined} />
      )}
      <ToastContainer />
    </div>
  );
};