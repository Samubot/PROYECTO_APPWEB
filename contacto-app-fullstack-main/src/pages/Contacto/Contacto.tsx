import "react-toastify/dist/ReactToastify.css";
import type { ContactoForm } from "./contacto.types";
import { useEffect, useState } from "react";
import { ModalContacto } from "./ModalContacto";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { obtenerContactos, eliminarContacto } from "./contacto.service";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

export const Contacto = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [contactos, setContactos] = useState<ContactoForm[]>([]);
  const [contactoEditando, setContactoEditando] = useState<ContactoForm | undefined>();

  const cargarContactos = async () => {
    try {
      const data = await obtenerContactos();
      setContactos(data);
    } catch (error) {
      console.error("Error al obtener los contactos:", error);
    }
  };

  useEffect(() => {
    cargarContactos();
  }, []);

  const abrirModal = (contacto?: ContactoForm) => {
    setContactoEditando(contacto);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setContactoEditando(undefined);
    cargarContactos(); // refresca la lista después de cerrar el modal
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
      try {
        await eliminarContacto(id);
        toast.success("Contacto eliminado", { position: "top-right", autoClose: 1000 });
        cargarContactos();
      } catch (error) {
        toast.error("Error al eliminar contacto");
      }
    }
  };

  const formatoFecha = (fechaInput: string | Date) => {
    const fecha = typeof fechaInput === "string" ? new Date(fechaInput) : fechaInput;
    const dia = String(fecha.getUTCDate()).padStart(2, "0");
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0");
    const anio = fecha.getUTCFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Contactos</h2>
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
              <th className="text-left px-4 py-2">Nombre</th>
              <th className="text-left px-4 py-2">Correo</th>
              <th className="text-left px-4 py-2">Mensaje</th>
              <th className="text-left px-4 py-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {contactos.map((m) => (
              <tr key={m.id} className="border-t border-gray-200">
                <td className="px-4 py-2">{m.id}</td>
                <td className="px-4 py-2">{m.nombre}</td>
                <td className="px-4 py-2">{m.correo}</td>
                <td className="px-4 py-2">{m.mensaje}</td>
                <td className="px-4 py-2">{formatoFecha(m.fecha)}</td>
                <td className="p-2 flex justify-center gap-3">
                  <button
                    onClick={() => abrirModal(m)}
                    className="text-blue-600 hover:text-blue-800"
                    aria-label="Editar contacto"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => confirmarEliminacion(m.id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Eliminar contacto"
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
        <ModalContacto onClose={cerrarModal} contacto={contactoEditando} />
      )}
      <ToastContainer />
    </div>
  );
};