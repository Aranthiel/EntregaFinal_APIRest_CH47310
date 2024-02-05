import { userModel } from '../models/users.models.js';
import {usersPersistence} from '../configs/persistenceManager.js';

// Middleware para validar datos al agregar usuario
export const validateUserCreation = async (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;

    try {
        // Validación con Mongoose
        const newUser = new userModel({ first_name, last_name, email, password });
        await newUser.validate();
        
        next();
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error de validación en la creación de usuario', error: error.message });
    }
};

// Middleware para verificar que el email no este registrado anteriormente
export const checkDuplicateEmail = async (req, res, next) => {
    const { email } = req.body;

    try {
        const existingUser = await usersPersistence.findByEmail( email );
        
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado' });
        }

        next();
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al verificar el correo electrónico duplicado', error: error.message });
    }
};

