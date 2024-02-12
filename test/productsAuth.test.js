import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';

describe('Pruebas con autenticación', () => {
    let authToken;
    let createdProductId;

    before(async () => {
        // Realizamos una solicitud de inicio de sesión para obtener el token
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'j.doe@example.com',
                password: 'password123',
            });
        authToken = loginResponse.body.token;
    });

    describe('POST /api/products', () => {
        it('Debería agregar un nuevo producto correctamente', async () => {
            const randomNumber = Math.floor(Math.random() * 10000);
            const response = await request(app)
                .post('/api/products')
                .set('Authorization', authToken) 
                .send({
                    title: "title",   
                    code: `codigo${randomNumber}`, 
                    price: 1235694,   
                    status: false, 
                    stock: 3,   
                    category: "category", 
                });
            createdProductId = response.body.productId;
            expect(response.status).to.equal(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('new product added successfully');
        });

        it('Debería dar un error si el código del producto está repetido', async () => {
            const response = await request(app)
                .post('/api/products')
                .send({
                    title: "title",   
                    code: "codigoRepetido", // Este código ya existe
                    price: 1235694,   
                    category: "category", 
                });
            expect(response.status).to.equal(400);
            expect(response.body.success).to.be.false;
            // Agregar más expectativas según sea necesario para verificar el mensaje de error
        });

        it('Debería dar un error si no se incluyen todos los campos obligatorios', async () => {
            const response = await request(app)
                .post('/api/products')
                .send({
                    // Falta el campo 'title'
                    code: "codigo",   
                    price: 1235694,   
                    category: "category", 
                });
            expect(response.status).to.equal(400);
            expect(response.body.success).to.be.false;
            // Agregar más expectativas según sea necesario para verificar el mensaje de error
        });

        it('Debería agregar un producto correctamente aunque no se incluyan todos los campos opcionales', async () => {
            const response = await request(app)
                .post('/api/products')
                .send({
                    title: "title",   
                    code: "codigo",   
                    price: 1235694,   
                    category: "category", 
                    // Falta el campo 'status' y 'stock'
                });
            expect(response.status).to.equal(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('new product added successfully');
        });

        it('Debería dar un error si el token es invalido al tratar de agregar un producto', async () => {
            const randomNumber = Math.floor(Math.random() * 10000);
            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${authToken}`) 
                .send({
                    title: "title",   
                    code: `codigo${randomNumber}`, 
                    price: 1235694,   
                    status: false, 
                    stock: 3,   
                    category: "category", 
                });
            expect(response.status).to.equal(403);
            expect(response.body.success).to.be.false; 
            expect(response.body.message).to.equal('Token inválido'); 
        });
    });

    describe('PUT /api/products/:productId', () => {
        it('Debería actualizar un producto si se encuentra por su ID', async () => {
            const productId = createdProductId; 
            const response = await request(app)
                .put(`/api/products/${productId}`)
                .set('Authorization', authToken) 
                .send({
                    title: "updated title",
                    price: 15,   
                    status: true, 
                    stock: 25
                });
            expect(response.status).to.equal(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Producto actualizado:');
        });

        it('Debería devolver un mensaje de error si no se encuentra el producto por su ID al tratar de actualizarlo', async () => {
            const productId = 'idininexistente';
            const response = await request(app)
                .put(`/api/products/${productId}`);
            expect(response.status).to.equal(404);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('No se encontro el Id de producto solicitado');
        });
    });

    describe('DELETE /api/products/:productId', () => {
        it('Debería eliminar un producto si se encuentra por su ID', async () => {
            const productId = createdProductId; 
            const response = await request(app)
                .delete(`/api/products/${productId}`)
                .set('Authorization', authToken) 
            expect(response.status).to.equal(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Producto eliminado con exito:');
        });

        it('Debería devolver un mensaje de error si no se encuentra el producto por su ID al tratar de eliminarlo', async () => {
            const productId = 'idininexistente';
            const response = await request(app)
                .delete(`/api/products/${productId}`)        
                .set('Authorization', authToken);
            expect(response.status).to.equal(404);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('No se encontro el Id de producto solicitado');
        });
    });
});
