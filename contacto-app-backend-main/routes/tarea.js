const express = require('express');
const router = express.Router();

let tareas = [
  {
    id: 1,
    nombre: 'Tarea de prueba 1',
    descripcion: 'Descripción de la tarea 1',
    fechaInicio: '2024-07-03T09:00',
    fechaFin: '2024-07-03T11:00',
    completada: false,
  },
];

// Obtener todas las tareas
router.get('/', (req, res) => {
  res.json(tareas);
});

// Crear una nueva tarea
router.post('/', (req, res) => {
  const { nombre, descripcion, fechaInicio, fechaFin } = req.body;
  const nueva = {
    id: tareas.length + 1,
    nombre,
    descripcion,
    fechaInicio,
    fechaFin,
    completada: false,
  };
  tareas.push(nueva);
  res.status(201).json(nueva);
});

// Actualizar tarea por ID
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, descripcion, fechaInicio, fechaFin, completada } = req.body;
  const index = tareas.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Tarea no encontrada" });
  tareas[index] = {
    ...tareas[index],
    nombre,
    descripcion,
    fechaInicio,
    fechaFin,
    completada,
  };
  res.json(tareas[index]);
});

// Eliminar tarea por ID
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = tareas.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Tarea no encontrada" });
  const tareaEliminada = tareas.splice(index, 1);
  res.json(tareaEliminada[0]);
});

module.exports = router;