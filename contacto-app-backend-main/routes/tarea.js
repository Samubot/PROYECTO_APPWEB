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
    enEjecucion: false,
    actividades: [
      { nombre: "Actividad 1", tiempo: 30 },
      { nombre: "Actividad 2", tiempo: 45 }
    ]
  },
];

// Obtener todas las tareas
router.get('/', (req, res) => {
  res.json(tareas);
});

// Crear una nueva tarea
router.post('/', (req, res) => {
  const { nombre, descripcion, fechaInicio, fechaFin, actividades } = req.body;
  const nueva = {
    id: tareas.length + 1,
    nombre,
    descripcion,
    fechaInicio,
    fechaFin,
    completada: false,
    enEjecucion: false,
    actividades: actividades || []
  };
  tareas.push(nueva);
  res.status(201).json(nueva);
});

// Actualizar tarea por ID
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, descripcion, fechaInicio, fechaFin, completada, enEjecucion, actividades } = req.body;
  const index = tareas.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Tarea no encontrada" });
  tareas[index] = {
    ...tareas[index],
    nombre,
    descripcion,
    fechaInicio,
    fechaFin,
    completada,
    enEjecucion,
    actividades: actividades || tareas[index].actividades
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