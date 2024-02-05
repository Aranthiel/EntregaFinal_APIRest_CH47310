// src/routes/apiAuth.routes.js
import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';

const apiUsersAuth = Router();

// Endpoint para registrar nuevos usuarios
apiUsersAuth.post('/registro', registerUser);

// Endpoint para iniciar sesión
apiUsersAuth.post('/login', loginUser);

export default apiUsersAuth;