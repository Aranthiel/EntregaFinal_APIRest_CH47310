import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';


describe('POST /api/auth/registro', () => {
    it('Debería registrar un nuevo usuario correctamente', async () => {
        const randomNumber = Math.floor(Math.random() * 10000);
        console.log(randomNumber)
        const response = await request(app)
            .post('/api/auth/registro')
            .send({
                first_name: `Usuario${randomNumber}`,
                last_name: `Apellido${randomNumber}`,
                email: `usuario.apellido@example${randomNumber}.com`,
                password: 'pass123',
            });
        expect(response.status).to.equal(201);
        expect(response.body.success).to.be.true;
        expect(response.body.message).to.equal('Usuario registrado con éxito');
    }, 30000);

    it('Debería dar un error si el correo electrónico ya está registrado', async () => {
        const response = await request(app)
            .post('/api/auth/registro')
            .send({
                first_name: 'Jane',
                last_name: 'Doe',
                email: 'j.doe@example.com',
                password: 'password123',
            });
        expect(response.status).to.equal(400);
        expect(response.body.success).to.be.false;
        expect(response.body.message).to.equal('El correo electrónico ya está registrado');
    });

    it('Debería dar un error si no se proporcionan todos los campos necesarios', async () => {
        const response = await request(app)
            .post('/api/auth/registro')
            .send({
                first_name: 'Jane',
                last_name: 'Doe',
                // Falta el campo 'email'
                password: 'password123',
            });
        expect(response.status).to.equal(500); 
    });
});

describe('POST /api/auth/login', () => {
    it('Debería iniciar sesión con credenciales válidas', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'j.doe@example.com',
                password: 'password123',
            });
        expect(response.status).to.equal(200);
        expect(response.body.success).to.be.true;
        expect(response.body.token).to.be.a('string');
        expect(response.body.userId).to.be.a('string');
    });

    it('Debería dar un error si el correo electrónico no existe', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'noexiste@example.com', 
                password: 'password123',
            });
        expect(response.status).to.equal(401);
        expect(response.body.success).to.be.false;
        expect(response.body.message).to.equal('Credenciales inválidas');
    });

    it('Debería dar un error si la contraseña es incorrecta', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'j.doe@example.com',
                password: 'contraseñaincorrecta', 
            });
        expect(response.status).to.equal(401);
        expect(response.body.success).to.be.false;
        expect(response.body.message).to.equal('Credenciales inválidas');
    });
});


