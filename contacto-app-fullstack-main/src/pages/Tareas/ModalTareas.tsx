import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { actualizarTarea, crearTarea } from "./tareas.service";
import type { Tarea } from "./tareas.types";

interface Props {
  onClose: () => void;
  tarea?: Tarea;
}

interface TareaForm {
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
}

export const ModalTarea = ({ onClose, tarea }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TareaForm>({
    defaultValues: {
      nombre: tarea?.nombre || "",
      descripcion: tarea?.descripcion || "",
      fechaInicio: tarea?.fechaInicio || "",
      fechaFin: tarea?.fechaFin || "",
    },
  });

  const onSubmit = async (data: TareaForm) => {
    try {
      if (tarea) {
        await actualizarTarea(tarea.id, { ...data, completada: tarea.completada });
        toast.success("Tarea actualizada", { position: "top-right", autoClose: 2000 });
      } else {
        await crearTarea(data);
        toast.success("Tarea creada", { position: "top-right", autoClose: 2000 });
      }
      reset();
      onClose();
    } catch (err) {
      toast.error("Error al guardar la tarea");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">{tarea ? "Editar tarea" : "Agregar tarea"}</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              className="w-full border px-3 py-2 rounded-xl mb-2"
              placeholder="Nombre de la tarea"
              {...register("nombre", { required: "Nombre requerido" })}
            />
            {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
            <textarea
              rows={2}
              className="w-full border px-3 py-2 rounded-xl"
              placeholder="Descripción"
              {...register("descripcion", { required: "Descripción requerida" })}
            ></textarea>
            {errors.descripcion && <p className="text-red-500">{errors.descripcion.message}</p>}
          </div>
          <div className="flex gap-2">
            <div>
              <label className="block text-xs">Fecha y hora inicio</label>
              <input
                type="datetime-local"
                className="border px-2 py-1 rounded-xl"
                {...register("fechaInicio", { required: "Fecha de inicio requerida" })}
              />
              {errors.fechaInicio && <p className="text-red-500">{errors.fechaInicio.message}</p>}
            </div>
            <div>
              <label className="block text-xs">Fecha y hora fin</label>
              <input
                type="datetime-local"
                className="border px-2 py-1 rounded-xl"
                {...register("fechaFin", { required: "Fecha de fin requerida" })}
              />
              {errors.fechaFin && <p className="text-red-500">{errors.fechaFin.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};