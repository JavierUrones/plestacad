const request = require('supertest');
const app = "http://localhost:5200";
let mongoose = require('mongoose');
let User = require("../models/User");
let userConnected;
beforeEach(async () => {
});

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/test-database");
  })

afterAll(async () => {
    await User.deleteMany();
    await mongoose.connection.close();
  
  })
describe(' Pruebas unitarias de autenticación ', () => {
    it('Registrar usuario con nombre y apellidos válidos y correo electrónico no utilizado.', async () => {
      const res = await request(app)
        .post('/api/signup').send({ "name": "user4Test", "surname": "user4Test", "email": "plestacad@hotmail.com", "password": "aaaaaaaaa" });
      expect(res.statusCode).toEqual(200);
      userConnected = await User.findOne({ 'email': "plestacad@hotmail.com" });
      expect(userConnected).not.toBeUndefined();
      const res2 = await request(app)
        .get('/api/verify/' + userConnected.verifyToken);
      expect(res2.statusCode).toEqual(302); //cuando se verifica un usuario redirige al login.
    })

    it('Registrar usuario con nombre y apellidos válidos y correo electrónico ya utilizado.', async () => {
        const res = await request(app)
          .post('/api/signup').send({ "name": "user4Test", "surname": "user4Test", "email": "plestacad@hotmail.com", "password": "aaaaaaaaa" });
        expect(res.statusCode).toEqual(400);
      })

      it('Registrar usuario con nombre y apellidos no válidos y correo electrónico no utilizado.', async () => {
        const res = await request(app)
          .post('/api/signup').send({ "name": "", "surname": "", "email": "plestacad@hotmail.com", "password": "aaaaaaaaa" });
        expect(res.statusCode).toEqual(400);
      })


      it('Registrar usuario con nombre, apellidos y correo electrónico válido pero contraseña menor a 8 caracteres.', async () => {
        const res = await request(app)
          .post('/api/signup').send({ "name": "test", "surname": "test", "email": "plestacad3@hotmail.com", "password": "a" });
        expect(res.statusCode).toEqual(400);
      })

    it('Iniciar sesión con correo electrónico registrado y contraseña correctos.', async () => {
      const res = await request(app)
        .post('/api/login').send({ "email": "plestacad@hotmail.com", "password": "aaaaaaaaa" })
      access_token = res._body.token;
      expect(res.statusCode).toEqual(200);
      expect(res._body.token).not.toBeUndefined();
    })

    it('Iniciar sesión con correo electrónico registrado y contraseña incorrecta.', async () => {
        const res = await request(app)
          .post('/api/login').send({ "email": "plestacad@hotmail.com", "password": "bbbbbbbbb" })
        expect(res.statusCode).toEqual(400);
        expect(res._body.token).toBeUndefined();
      })

    it('Iniciar sesión con correo electrónico no registrado.', async () => {
        const res = await request(app)
          .post('/api/login').send({ "email": "plestacad4@hotmail.com", "password": "aaaaaaaaa" })
        expect(res.statusCode).toEqual(400);
        expect(res._body.token).toBeUndefined();
      })

}
);