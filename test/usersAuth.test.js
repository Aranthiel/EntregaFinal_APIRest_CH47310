import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';

describe('Pruebas con autenticación para usuarios', () => {
    let createdUserId;
    let authToken;

    describe('POST /api/users', () => {
        it('Debería agregar un nuevo usuario correctamente y capturar su ID', async () => {
            const newUser = {
                first_name: 'John',
                last_name: 'Doe',
                email: 'newuser@example.com',
                password: 'newuserpassword',
            };
            const response = await request(app)
                .post('/api/users')
                .send(newUser);
            createdUserId = response.body.usuarioAgregado.id;
            expect(response.status).to.equal(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Usuario agregado con éxito:');
        });
    });

    describe('Obtener token de autenticación', () => {
        before(async () => {
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'newuser@example.com',
                    password: 'newuserpassword',
                });
            authToken = loginResponse.body.token;
        });
    });

    describe('PUT /api/users/:userId', () => {
        it('Debería actualizar un usuario si se encuentra por su ID y el token es valido', async () => {
            const updatedUserInfo = {
                first_name: 'Updated John',
                last_name: 'Updated Doe',
                email: 'updated@example.com',
                password: 'updatedpassword',
            };
            const response = await request(app)
                .put(`/api/users/${createdUserId}`)
                .set('Authorization', authToken)
                .send(updatedUserInfo);
            expect(response.status).to.equal(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Usuario actualizado con éxito:');
        });

        it('Debería dar error al actualizar un usuario si se encuentra por su ID y el token es invalido', async () => {
            const updatedUserInfo = {
                first_name: 'Updated John',
                last_name: 'Updated Doe',
                email: 'updated@example.com',
                password: 'updatedpassword',
            };
            const response = await request(app)
                .put(`/api/users/${createdUserId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updatedUserInfo);
                expect(response.status).to.equal(403);
                expect(response.body.success).to.be.false; 
                expect(response.body.message).to.equal('Token inválido'); 
        });

        it('No debería permitir modificar el ID del usuario aunque el token es valido', async () => {
            const updatedUserInfo = {
                id: 'newId123', // Intentar modificar el ID
                first_name: 'Updated John',
                last_name: 'Updated Doe',
                email: 'updated@example.com',
                password: 'updatedpassword',
            };
            const response = await request(app)
                .put(`/api/users/${createdUserId}`)
                .set('Authorization', authToken)
                .send(updatedUserInfo);
            expect(response.status).to.equal(400); // El servidor debería devolver un error 400 Bad Request
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('No se puede modificar el ID del usuario');
        });
    });

    describe('DELETE /api/users/:userId', () => {
        it('Debería eliminar un usuario si se encuentra por su ID y el token es valido', async () => {
            const response = await request(app)
                .delete(`/api/users/${createdUserId}`)
                .set('Authorization', authToken);
            expect(response.status).to.equal(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Usuario eliminado con éxito:');
        });
    });
});
