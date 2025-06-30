import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { actualizarContacto, crearContacto } from "./contacto.service";
import type { ContactoRequest, ContactoForm } from "./contacto.types";

interface Props {
  onClose: () => void;
  contacto?: ContactoForm;
}

export const ModalContacto = ({ onClose, contacto }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactoRequest>({
    defaultValues: {
      nombre: contacto?.nombre || "",
      correo: contacto?.correo || "",
      mensaje: contacto?.mensaje || "",
    },
  });

  const onSubmit = async (data: ContactoRequest) => {
    try {
      if (contacto) {
        await actualizarContacto(contacto.id, data);
        toast.success("Contacto actualizado", { position: "top-right", autoClose: 2000 });
      } else {
        await crearContacto(data);
        toast.success("Contacto creado", { position: "top-right", autoClose: 2000 });
      }
      reset();
      onClose();
    } catch (err) {
      toast.error("Error al guardar el contacto");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">
          {contacto ? "Editar contacto" : "Agregar contacto"}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Nombre:</label>
            <input
              className="w-full px-3 py-2 border rounded-xl"
              {...register("nombre", { required: "El nombre es obligatorio" })}
            />
            {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1">Correo electrónico:</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-xl"
              {...register("correo", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Correo no válido",
                },
              })}
            />
            {errors.correo && <p className="text-red-500">{errors.correo.message}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1">Mensaje:</label>
            <textarea
              className="w-full px-3 py-2 border rounded-xl"
              rows={4}
              {...register("mensaje", { required: "El mensaje es obligatorio" })}
            />
            {errors.mensaje && <p className="text-red-500">{errors.mensaje.message}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};