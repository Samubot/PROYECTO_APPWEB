const express = require('express');
const router = express.Router();

let tareas = [
  { id: 1, contenido: 'Tarea de prueba 1' },
  { id: 2, contenido: 'Tarea de prueba 2' },
];

// Obtener todas las tareas
router.get('/', (req, res) => {
  res.json(tareas);
});

// Crear una nueva tarea
router.post('/', (req, res) => {
  const { contenido } = req.body;

  const nueva = {
    id: tareas.length + 1,
    contenido,
  };

  tareas.push(nueva);
  res.status(201).json(nueva);
});

// Actualizar tarea por ID
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { contenido } = req.body;

  const index = tareas.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Tarea no encontrada" });

  tareas[index].contenido = contenido;
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