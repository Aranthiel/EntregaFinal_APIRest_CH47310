// src/routes/apiAuth.routes.js
import { Router } from 'express';
import { registerUser, loginUser, logoutUser, loginPassportL } from '../controllers/auth.controller.js';
import jwt from 'jsonwebtoken';
//variables de entorno
import config from '../configs/config.js'
// passport
import passport from 'passport';

const apiUsersAuth = Router();

//>>>>>>>>>>>>>>>>>>>>> RUTAS PARA PASSPORT GITHUB  <<<<<<<<<<<<<<<<<<<<<<<<<//

// passport-github
//IMPORTANTE  siempre tiene que estar ANTES que las estrategias locales para que funcione ok
apiUsersAuth.get("/githubauth", passport.authenticate('github', {scope: ['user:email']}));
apiUsersAuth.get("/githubcallback", 
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        console.log("Datos de autenticación con GitHub:", req.user);
        try {
            const user = req.user;
            // Almacenar la información de la sesión
            //req.session.user = { userId: user._id, email: user.email, first_name: `${user.first_name} ${user.last_name}`, cart: user.cart };

        // Genera un token JWT
            const token = jwt.sign({ userId: user._id, email: user.email }, config.jwt_secret, {
                expiresIn: '1h',
        });
        
        // Devuelve el token y otros detalles del usuario si es necesario
        res.status(200).json({ 
            success: true, 
            token: token, 
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                from_github: true,
                cart: user.cart,
                _id: user._id,
            } 
        })
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    });// no cambiar, 
//ya se asocio a github http://localhost:8080/api/auth/githubcallback


//>>>>>>>>>>>>>>>>>>>>>>>> RUTAS PARA AUTH LOCAL <<<<<<<<<<<<<<<<<<<<<<<<<<<<//

// Endpoint para registrar nuevos usuarios
apiUsersAuth.post('/registro', registerUser);

// Endpoint para iniciar sesión
apiUsersAuth.post('/login', loginUser);

// Endpoint para cerrar sesión
apiUsersAuth.post('/logout', logoutUser);

//>>>>>>>>>>>>>>>>>>>>> RUTAS PARA PASSPORT LOCAL <<<<<<<<<<<<<<<<<<<<<<<<<//

// Endpoint para registrar nuevos usuarioscon passportLocal
apiUsersAuth.post('/plsignup', passport.authenticate('signup'),(req, res)=>{
    
    res.send('probando signup con passport local')
});

// Endpoint para registrar nuevos usuarioscon passportLocal
apiUsersAuth.post('/pllogin',loginPassportL)

export default apiUsersAuth;