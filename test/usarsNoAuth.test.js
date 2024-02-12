import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';

describe('Pruebas sin autenticación para usuarios', () => {
    describe('GET /api/users', () => {
        it('Debería obtener todos los usuarios', async () => {
            const response = await request(app)
                .get('/api/users');
            expect(response.status).to.equal(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Usuarios encontrados con éxito:');
        });
    });

    describe('GET /api/users/:userId', () => {
        it('Debería obtener un usuario por su ID si existe', async () => {
            const userId = '65c7e435290cd2af568e1221'; // ID de un usuario existente
            const response = await request(app)
                .get(`/api/users/${userId}`);
            expect(response.status).to.equal(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Usuario encontrado con éxito:');
        });

        it('Debería devolver un mensaje de error si no se encuentra el usuario por su ID', async () => {
            const userId = 'idInexistente'; // ID de un usuario inexistente
            const response = await request(app)
                .get(`/api/users/${userId}`);
            expect(response.status).to.equal(404);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('No se encontró el Id de usuario solicitado');
        });
    });

    describe('GET /api/users/email/:userEmail', () => {
        it('Debería obtener un usuario por su email si existe', async () => {
            const userEmail = 'j.doe@example.com'; // Email de un usuario existente
            const response = await request(app)
                .get(`/api/users/email/${userEmail}`);
            expect(response.status).to.equal(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Usuario encontrado con éxito:');
        });

        it('Debería devolver un mensaje de error si no se encuentra el usuario por su email', async () => {
            const userEmail = 'emailInexistente@example.com'; // Email de un usuario inexistente
            const response = await request(app)
                .get(`/api/users/email/${userEmail}`);
            expect(response.status).to.equal(404);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('No se encontró el email de usuario solicitado');
        });
    });
});
