import axios from 'axios';
import type { Tarea } from './tareas.types.ts';

const API_URL = import.meta.env.VITE_API_URL;

export const obtenerTareas = async (): Promise<Tarea[]> => {
  const res = await axios.get(`${API_URL}/tarea`);
  return res.data;
};

export const crearTarea = async (tarea: Omit<Tarea, 'id' | 'completada'>): Promise<Tarea> => {
  const res = await axios.post(`${API_URL}/tarea`, tarea);
  return res.data;
};

export const actualizarTarea = async (id: number, tarea: Partial<Tarea>) => {
  const res = await axios.put(`${API_URL}/tarea/${id}`, tarea);
  return res.data;
};

export const eliminarTarea = async (id: number) => {
  const res = await axios.delete(`${API_URL}/tarea/${id}`);
  return res.data;
};