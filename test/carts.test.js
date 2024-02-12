import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';

describe('Pruebas sin autenticación para usuarios', () => {
    let createdCartId
    describe('GET /api/carts', () => {
        it('Deberia', async() => {
            const response =await request(app)
            .get('/api/carts');
            expect(response.status).to.equal(200);
            expect(response.body.succes).to.be.true;
            expect(response.body.message).to.equal('Carritos encontrados con éxito:');
                })
    });
    describe('POST /api/carts/addproduct/:userId', () => {
        it('Deberia actualizar el carrito del usuario que conicida con el ID ', async() => {
            const cartInfo = {
                products: 
                    [
                        {
                            productId:"65bff812923ef26fe65e909c",
                            quantity: 12
                        },
                        {
                            productId: "65bffbe3af73f700d6bd7871",
                            quantity: 16
                        },
                        {
                            productId: "65bffb19af73f700d6bd786b",
                            quantity: 5
                        }
                    ]
                };
            const userId = '65c7e435290cd2af568e1221'; // ID de un usuario existente
            const response =await request(app)
            .post(`/api/carts/addproduct/${userId}`)
            .send(cartInfo);
            expect(response.status).to.equal(200);
            expect(response.body.succes).to.be.true;
            expect(response.body.message).to.equal('Productos agregados al carrito con éxito');
        })

        it('Deberia crear un carrito temporal para un usuario no logueado ', async() => {
            const cartInfo = {
                products: 
                    [
                        {
                            productId:"65bff812923ef26fe65e909c",
                            quantity: 4
                        },
                        {
                            productId: "65bffbe3af73f700d6bd7871",
                            quantity: 3
                        },
                        {
                            productId: "65bffb19af73f700d6bd786b",
                            quantity: 2
                        }
                    ]
                };
            const response =await request(app)
            .post(`/api/carts/addproduct/nouser`)
            .send(cartInfo);
            expect(response.status).to.equal(200);
            expect(response.body.succes).to.be.true;
            expect(response.body.message).to.equal('Carrito creado con éxito');

            // Guardar el ID del carrito creado
            createdCartId = response.body.cart._id;
        })
    });
    describe('GET /api/carts/:cartId', () => {
        it('Deberia mostrar un carrito si lo encuentra por su id', async() => {
            const response =await request(app)
            .get(`/api/carts/${createdCartId}`);
            expect(response.status).to.equal(200);
            expect(response.body.succes).to.be.true;
            expect(response.body.message).to.equal('Carrito encontrado con éxito:');
        });

        it('No deberìa  mostrar un carrito si no lo encuentra por su id', async() => {
            const response =await request(app)
            .get(`/api/carts/idinexistente`);
            expect(response.status).to.equal(404);
            expect(response.body.succes).to.be.false;
            expect(response.body.message).to.equal('No se encontró el Id de carrito solicitado');
        });
    });
    describe('PUT /api/carts/:cartId', () => {
        it('Deberia actualizar un carrito si se encuentra por su ID ', async() => {
            const updatedCartInfo = {
                products: 
                    [
                        {
                            productId:"65bff812923ef26fe65e909c",
                            quantity: 12
                        },
                        {
                            productId: "65bffbe3af73f700d6bd7871",
                            quantity: 16
                        },
                        {
                            productId: "65bffb19af73f700d6bd786b",
                            quantity: 5
                        }
                    ]
                };
            const response =await request(app)
            .put(`/api/carts/${createdCartId}`)
            .send(updatedCartInfo);
            expect(response.status).to.equal(200);
            expect(response.body.succes).to.be.true;
            expect(response.body.message).to.equal('Carrito actualizado con éxito:');
        });
        
        it('No deberia actualizar un carrito si no se encuentra por su ID ', async() => {
            const updatedCartInfo = {
                products: 
                    [
                        {
                            productId:"65bff812923ef26fe65e909c",
                            quantity: 22
                        },
                        {
                            productId: "65bffbe3af73f700d6bd7871",
                            quantity: 36
                        },
                        {
                            productId: "65bffb19af73f700d6bd786b",
                            quantity: 4
                        }
                    ]
                };
            const response =await request(app)
            .put(`/api/carts/idinexistente`)
            .send(updatedCartInfo);
            expect(response.status).to.equal(500);
            expect(response.body.succes).to.be.false;
        });
});
    describe('DELETE /api/carts/:cartId', () => {
        it('Deberia eliminar un carrito si se encuentra por su id', async() => {
            const response =await request(app)
            .delete(`/api/carts/${createdCartId}`);
            expect(response.status).to.equal(200);
            expect(response.body.succes).to.be.true;
            expect(response.body.message).to.equal('Carrito eliminado con éxito:');
                })
    });

});