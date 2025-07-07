export interface Actividad {
  nombre: string;
  tiempo: number; // minutos
}

export interface Tarea {
  id: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  completada: boolean;
  enEjecucion?: boolean;
  actividades: Actividad[];
}