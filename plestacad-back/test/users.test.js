//contactos y perfil
const request = require('supertest');
  const app = "http://localhost:5200";
  let mongoose = require('mongoose');
  let User = require("../models/User");
  let Work = require("../models/Work");
  let WorkRequest = require("../models/WorkRequest");
  let Notification = require("../models/Notification");
  let TaskClassificator = require("../models/TaskClassificator")
  let userConnected;
  let access_token;
  beforeEach(async () => {
  });

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/test-database");

  const res2 = await request(app)
    .post('/api/signup').send({ "name": "user4Test2", "surname": "user4Test2", "email": "user4Test2@test.es", "password": "aaaaaaaaa" });
  await User.findOneAndUpdate({ "email": "user4Test2@test.es" }, { "verified": true })
  const res3 = await request(app)
    .post('/api/signup').send({ "name": "user4Test3", "surname": "user4Test3", "email": "user4Test3@test.es", "password": "aaaaaaaaa" });
  await User.findOneAndUpdate({ "email": "user4Test3@test.es" }, { "verified": true })
  const res4 = await request(app)
    .post('/api/signup').send({ "name": "user4Test4", "surname": "user4Test4", "email": "user4Test4@test.es", "password": "aaaaaaaaa" });
  await User.findOneAndUpdate({ "email": "user4Test4@test.es" }, { "verified": true })
  const resLogin = await request(app).post('/api/login').send({ "email": "user4Test2@test.es", "password": "aaaaaaaaa" })
  access_token = resLogin._body.token; //se inicia sesión con un usuario.
  userConnected = await User.findOne({ "email": "user4Test2@test.es" });

})
afterAll(async () => {
  await User.deleteMany();
  await Work.deleteMany();
  await WorkRequest.deleteMany();
  await Notification.deleteMany();
  await TaskClassificator.deleteMany();
  await mongoose.connection.close();

})
describe(' Pruebas unitarias usuarios ', () => {

    it('Editar perfil de un usuario desde otro usuario.', async () => {
        let resLogin2 = await request(app).post('/api/login').send({ "email": "user4Test3@test.es", "password": "aaaaaaaaa" })
        let access_token_distinto_usuario = resLogin2._body.token; 

        let body = {
            "id": userConnected._id.toString(),
            "name": "nameUpdated",
            "surname": "surnameUpdated"
        }
        let res = await request(app)
        .put("/api/users/updateData").send(body).set({ "access-token": access_token_distinto_usuario });
        expect(res.statusCode).toEqual(403);
    });

    it('Editar nombre y apellidos inválidos.', async () => {
        let body = {
            "id": userConnected._id.toString(),
            "name": "",
            "surname": ""
        }
        let res = await request(app)
        .put("/api/users/updateData").send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(400);
    });

    
    it('Editar nombre y apellidos válidos.', async () => {
        let body = {
            "id": userConnected._id.toString(),
            "name": "nameUpdated",
            "surname": "surnameUpdated"
        }
        let res = await request(app)
        .put("/api/users/updateData").send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);
        let userUpdated = await User.findOne({ "_id": userConnected._id.toString()})
        expect(userUpdated.name).toEqual("nameUpdated");
        expect(userUpdated.surname).toEqual("surnameUpdated");
    });

    it('Editar contraseña por una válida.', async () => {
        let body = {
            "id": userConnected._id.toString(),
            "currentPassword": "aaaaaaaaa",
            "password": "bbbbbbbbb"
        }
        let res = await request(app)
        .put("/api/users/updatePassword").send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);
      });

      it('Editar contraseña por una no válida: menos de 8 caracteres.', async () => {
        let body = {
            "id": userConnected._id.toString(),
            "currentPassword": "bbbbbbbbb",
            "password": "a"
        }
        let res = await request(app)
        .put("/api/users/updatePassword").send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(400);
      });

      it('Editar foto de perfil por una foto válida.', async () => {
        let body = {
            "id": userConnected._id.toString(),
            "currentPassword": "bbbbbbbbb",
            "password": "a"
        }
        const res = await request(app).post('/api/users/profile-photo').field('userId', userConnected._id.toString())
        .attach('upload', './test/resources/file4test.exe').set({ "connection": 'keep-alive', "access-token": access_token });

        expect(res.statusCode).toEqual(200);
      });


});