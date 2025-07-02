const express = require('express');
const router = express.Router();

// Lista de usuarios
const usuarios = [
  {
    email: 'admin@iti.edu.ec',
    password: '123456',
    nombre: 'Usuario Administrador'
  },
  {
    email: 'samuel.pallares@iti.edu.ec',
    password: '1234ITI',
    nombre: 'Samuel Pallares'
  },
  {
    email: 'antogarzon02@gmail.com',
    password: 'maluzir02',
    nombre: 'Antonella Garzón'
  }
];

router.post('/', (req, res) => {
  const { email, password } = req.body;

  const usuario = usuarios.find(
    u => u.email === email && u.password === password
  );

  if (usuario) {
    return res.status(200).json({
      ok: true,
      usuario: {
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  }

  return res.status(401).json({
    ok: false,
    mensaje: 'Credenciales incorrectas'
  });
});

module.exports = router;
