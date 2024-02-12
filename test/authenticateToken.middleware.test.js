import { expect } from 'chai';
import request from 'supertest';
import jwt from 'jsonwebtoken'; 
import app from '../src/app.js'; 
import config from '../src/configs/config.js'; 

describe('Pruebas del middleware authenticateToken', () => {
    it('Debería devolver un error 401 si no se proporciona un token', async () => {
        const response = await request(app)
        .put('/api/users/65c7e435290cd2af568e1221')
        .send({
            first_name: "Jonathan",
            last_name: "Joestar"
        }); 
        expect(response.status).to.equal(401);
        expect(response.body.success).to.be.false;
        expect(response.body.message).to.equal('Token no proporcionado');
    });

    it('Debería devolver un error 403 si se proporciona un token inválido', async () => {
        const response = await request(app)
            .put('/api/users/65c7e435290cd2af568e1221')
            .set('Authorization', `tokeninvalido`)
            .send({
                first_name: "Jonathan",
                last_name: "Joestar"
            }); ;
        expect(response.status).to.equal(403);
        expect(response.body.success).to.be.false;
        expect(response.body.message).to.equal('Token inválido');
    });

    it('Debería permitir el acceso si se proporciona un token válido', async () => {        
        // Simular un token válido firmando un payload con la misma clave secreta utilizada en la aplicación
        const payload = {
            userId: '65c7e435290cd2af568e1221',            
        };
        const token = jwt.sign(payload, config.jwt_secret);
    
        // Enviar la solicitud con el token simulado en la cabecera de autorización
        const response = await request(app)
            .put('/api/users/65c7e435290cd2af568e1221') 
            .set('Authorization', token)
            .send({
                first_name: "Jonathan",
                last_name: "Joestar"
            });         
        // Verificar que la respuesta sea exitosa
        expect(response.status).to.equal(200);
        expect(response.body.success).to.be.true;
    });
});
