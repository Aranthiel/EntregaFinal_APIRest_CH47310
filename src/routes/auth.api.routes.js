// src/routes/apiAuth.routes.js
import { Router } from 'express';
import { registerUser, loginUser, logoutUser, loginPassportL } from '../controllers/auth.controller.js';
// passport
import passport from 'passport';

const apiUsersAuth = Router();

// Endpoint para registrar nuevos usuarios
apiUsersAuth.post('/registro', registerUser);

// Endpoint para iniciar sesión
apiUsersAuth.post('/login', loginUser);

// Endpoint para cerrar sesión
apiUsersAuth.post('/logout', logoutUser);

// Endpoint para registrar nuevos usuarioscon passportLocal
apiUsersAuth.post('/plsignup', passport.authenticate('signup'),(req, res)=>{
    
    res.send('probando signup con passport local')
});

// Endpoint para registrar nuevos usuarioscon passportLocal
apiUsersAuth.post('/pllogin',loginPassportL)

export default apiUsersAuth;