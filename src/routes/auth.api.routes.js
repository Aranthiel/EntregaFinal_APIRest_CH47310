// src/routes/apiAuth.routes.js
import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/auth.controller.js';

const apiUsersAuth = Router();

// Endpoint para registrar nuevos usuarios
apiUsersAuth.post('/registro', registerUser);

// Endpoint para iniciar sesión
apiUsersAuth.post('/login', loginUser);

// Endpoint para cerrar sesión
apiUsersAuth.post('/logout', logoutUser);


export default apiUsersAuth;