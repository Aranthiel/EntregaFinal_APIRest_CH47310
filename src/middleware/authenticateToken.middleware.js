import jwt from 'jsonwebtoken';
//variables de entorno
import config from '../configs/config.js'

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token no proporcionado' });
    }

    jwt.verify(token, config.jwt_secret, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Token inválido' });
        }

        req.user = user;
        next();
    });
};

export default authenticateToken;
