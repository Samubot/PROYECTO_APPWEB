import { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { ModalTarea } from "./ModalTareas";
import type { Tarea } from "./tareas.types";
import { eliminarTarea, obtenerTareas } from "./tareas.service";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

export const Tareas = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<Tarea | undefined>();

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
      //text: "No podrá revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      //width: "500px",
    });

    if (result.isConfirmed) {
      await eliminarTarea(id);
      toast.success("Tarea eliminada", {
        position: "top-right",
        autoClose: 1000,
      });
      cargarTareas();
    }
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Tareas
        </h2>
        <button
          onClick={() => abrirModal()}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
        >
          <FiPlus className="text-lg" />
          <span className="text-sm sm:text-base">Agregar</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border bg-white border-gray-300 mt-4 rounded-xl shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Nombre de la tarea</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tareas.map((t) => (
              <tr key={t.id} className="border-t border-gray-200">
                <td className="px-4 py-2">{t.id}</td>
                <td className="px-4 py-2">{t.contenido}</td>
                <td className="p-2 flex justify-center gap-3">
                  <button
                    onClick={() => abrirModal(t)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => confirmarEliminacion(t.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mostrarModal && (
        <ModalTarea
          onClose={cerrarModal}
          tarea={tareaEditando ?? undefined}
        />
      )}

      <ToastContainer />
    </div>
  );
};