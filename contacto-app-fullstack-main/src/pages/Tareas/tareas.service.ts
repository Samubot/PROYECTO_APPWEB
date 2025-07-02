import axios from 'axios';
import type { Tarea } from './tareas.types.ts';

const API_URL = import.meta.env.VITE_API_URL;

export const obtenerTareas = async (): Promise<Tarea[]> => {
  const res = await axios.get(`${API_URL}/tarea`);
  return res.data;
};

export const crearTarea = async (contenido: string): Promise<Tarea> => {
  const res = await axios.post(`${API_URL}/tarea`, { contenido });
  return res.data;
};

export const actualizarTarea = async (id: number, contenido: string) => {
  const res = await axios.put(`${API_URL}/tarea/${id}`, { contenido });
  return res.data;
};

export const eliminarTarea = async (id: number) => {
  const res = await axios.delete(`${API_URL}/tarea/${id}`);
  return res.data;
};