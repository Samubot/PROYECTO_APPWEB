import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { actualizarTarea, crearTarea } from "./tareas.service";

interface Props {
  onClose: () => void;
  tarea?: {
    id: number;
    contenido: string;
  };
}

interface TareaForm {
  contenido: string;
}

export const ModalTarea = ({ onClose, tarea }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TareaForm>({
    defaultValues: {
      contenido: tarea?.contenido || "",
    },
  });

  const onSubmit = async (data: TareaForm) => {
    try {
      if (tarea) {
        await actualizarTarea(tarea.id, data.contenido);
        toast.success("Tarea actualizada", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        await crearTarea(data.contenido);
        toast.success("Tarea creada", {
          position: "top-right",
          autoClose: 2000,
        });
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
        <h3 className="text-lg font-bold mb-4">Agregar tarea</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <textarea
              rows={4}
              className="w-full border px-3 py-2 rounded-xl"
              placeholder="Escribe la tarea a realizar"
              {...register("contenido", { required: "Escribe una tarea" })}
            ></textarea>
            {errors.contenido && (
              <p className="text-red-500">{errors.contenido.message}</p>
            )}
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