// src/controllers/auth.controller.js
import { userModel } from '../models/users.models.js';
import {usersPersistence} from '../configs/persistenceManager.js';
import { compareData, hashData } from '../utils.js';
import jwt from 'jsonwebtoken';
//variables de entorno
import config from '../configs/config.js'

export const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        // Verifica si el correo electrónico ya está registrado
        const existingUser = await usersPersistence.findByEmail( email );
        

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado' });
        }

        // Hashea la contraseña antes de almacenarla en la base de datos
        const hashedPassword = await hashData(password);

        // Crea un nuevo usuario
        const newUser = new userModel({
            first_name,
            last_name,
            email,
            password: hashedPassword,
        });

        // Guarda el usuario en la base de datos
        const savedUser = await newUser.save();

        res.status(201).json({ success: true, message: 'Usuario registrado con éxito', user: savedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Busca al usuario por correo electrónico
        const user = await usersPersistence.findByEmail( email );
        
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        // Compara la contraseña proporcionada con la almacenada en la base de datos
        const passwordMatch = await compareData(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        // Genera un token JWT
        const token = jwt.sign({ userId: user._id, email: user.email }, config.jwt_secret, {
            expiresIn: '1h',
        });
        //console.log("token controller", token)

        // Devuelve el token y otros detalles del usuario si es necesario
        res.status(200).json({ success: true, token, userId: user._id });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
