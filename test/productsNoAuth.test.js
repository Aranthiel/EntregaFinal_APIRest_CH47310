import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';

describe('GET /api/products', () => {
    it('Debería obtener TODOS LOS PRODUCTOS', async () => {
        const response = await request(app)
            .get('/api/products');
        expect(response.status).to.equal(200);
        expect(response.body.success).to.be.true;
        expect(response.body.message).to.equal('Productos encontrados:');
        expect(response.body.products).to.be.an('array'); 
        expect(response.body.products.length).to.be.greaterThan(0);
    });
});

describe('GET /api/products/:productId', () => {
    it('Debería devolver un producto si se encuentra por su ID', async () => {
        const productId = '65bff812923ef26fe65e909c'; 
        const response = await request(app)
            .get(`/api/products/${productId}`);
        expect(response.status).to.equal(200);
        expect(response.body.success).to.be.true;
        expect(response.body.message).to.equal('Producto encontrado:');
    });

    it('Debería devolver un mensaje de error si no se encuentra el producto por su ID al tratar de buscarlo', async () => {
        const productId = 'idininexistente';
        const response = await request(app)
            .get(`/api/products/${productId}`);
        expect(response.status).to.equal(404);
        expect(response.body.success).to.be.false;
        expect(response.body.message).to.equal('No se encontro el Id de producto solicitado');
    });
});
