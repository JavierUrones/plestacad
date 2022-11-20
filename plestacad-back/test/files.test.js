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



})
afterAll(async () => {
    await User.deleteMany();
    await Work.deleteMany();
    await WorkRequest.deleteMany();
    await Notification.deleteMany();
    await TaskClassificator.deleteMany();
    await mongoose.connection.close();
})

describe(' Pruebas unitarias archivos ', () => {

    it('Usuario perteneciente a un trabajo académico visualiza la lista de directorios de un trabajo académico sin ningún archivo almacenado.', async () => {
        const resLogin = await request(app).post('/api/login').send({ "email": "user4Test2@test.es", "password": "aaaaaaaaa" })
        access_token = resLogin._body.token; //se inicia sesión con un usuario.
        userConnected = await User.findOne({ "email": "user4Test2@test.es" });
        //se crea un trabajo académico de prueba
        const newWork = {
            title: "Test",
            authorId: userConnected._id.toString(),
            teachersInvited: [],
            studentsInvited: [],
            teachers: [userConnected._id.toString()],
            category: "tfg",
            description: "test description",
            course: 2022
        }
        let resWork = await request(app)
            .post('/api/works').send(newWork).set({ "access-token": access_token })


        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        const res = await request(app)
            .get('/api/files/' + workCreated[0]._id.toString()).set({ "access-token": access_token })
        expect(res.statusCode).toEqual(200);
        expect(JSON.parse(res.text).data[0].data.deepLevel).toEqual(1); // el nivel de profundidad de la carpeta raiz es igual a 1.
    })

    it('Usuario no perteneciente a un trabajo académico visualiza la lista de directorios de un trabajo académico sin ningún archivo almacenado.', async () => {
        const resLoginNoPerteneciente = await request(app).post('/api/login').send({ "email": "user4Test3@test.es", "password": "aaaaaaaaa" })
        let access_token_no_perteneciente = resLoginNoPerteneciente._body.token; //se inicia sesión con un usuario.
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        const res = await request(app)
            .get('/api/files/' + workCreated[0]._id.toString()).set({ "access-token": access_token_no_perteneciente })
        expect(res.statusCode).toEqual(403);
    })

    it('Usuario perteneciente a trabajo académico crea directorio con nivel de profundidad menor que cinco dentro del árbol de directorios.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let body = {
            "userIdResponsible": userConnected._id.toString(),
            "path": "C:\\Users\\javie\\OneDrive\\Escritorio\\TFG\\Codigo\\plestacad\\plestacad-back/userdata/" + workCreated[0]._id.toString() + "/" + workCreated[0].title.toString() + "/testCaseFolder",
            "workId": workCreated[0]._id.toString()
        }
        const res = await request(app)
            .post('/api/files/createDir').send(body).set({ "access-token": access_token })
        expect(res.statusCode).toEqual(200);
    })


    it('Usuario perteneciente a un trabajo académico visualiza la lista de directorios de un trabajo académico con archivos almacenados.', async () => {
        const resLogin = await request(app).post('/api/login').send({ "email": "user4Test2@test.es", "password": "aaaaaaaaa" })
        //se crea un trabajo académico de prueba
        const newWork = {
            title: "Test",
            authorId: userConnected._id.toString(),
            teachersInvited: [],
            studentsInvited: [],
            teachers: [userConnected._id.toString()],
            category: "tfg",
            description: "test description",
            course: 2022
        }
        let resWork = await request(app)
            .post('/api/works').send(newWork).set({ "access-token": access_token })


        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        const res = await request(app)
            .get('/api/files/' + workCreated[0]._id.toString()).set({ "access-token": access_token })
        expect(res.statusCode).toEqual(200);
        expect(JSON.parse(JSON.parse(res.text).data[0].children[0].data.deepLevel)).toBeGreaterThan(1); // el nivel de profundidad de los directorios hijos retornados son amyores que 1.
    })

    it('Usuario no perteneciente a un trabajo académico crea un directorio con nivel de profundidad menor que cinco dentro del árbol de directorios.', async () => {
        const resLogin = await request(app).post('/api/login').send({ "email": "user4Test4@test.es", "password": "aaaaaaaaa" })
        let access_token_no_perteneciente = resLogin._body.token; //se inicia sesión con un usuario.
        let userNoPerteneciente = await User.findOne({ "email": "user4Test4@test.es" });
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let body = {
            "userIdResponsible": userNoPerteneciente._id.toString(),
            "path": "C:\\Users\\javie\\OneDrive\\Escritorio\\TFG\\Codigo\\plestacad\\plestacad-back/userdata/" + workCreated[0]._id.toString() + "/" + workCreated[0].title.toString() + "/testCaseFolder2",
            "workId": workCreated[0]._id.toString()
        }
        const res = await request(app)
            .post('/api/files/createDir').send(body).set({ "access-token": access_token_no_perteneciente })

        expect(res.statusCode).toEqual(403);
    })

    it('Usuario perteneciente a trabajo académico crea directorio con el mismo nombre que otro en el mismo nivel de la jerarquía de directorios.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let body = {
            "userIdResponsible": userConnected._id.toString(),
            "path": "C:\\Users\\javie\\OneDrive\\Escritorio\\TFG\\Codigo\\plestacad\\plestacad-back/userdata/" + workCreated[0]._id.toString() + "/" + workCreated[0].title.toString() + "/testCaseFolder",
            "workId": workCreated[0]._id.toString()
        }
        const res = await request(app)
            .post('/api/files/createDir').send(body).set({ "access-token": access_token })
        expect(res.statusCode).toEqual(400);
    })

    it('Usuario perteneciente a trabajo académico crea directorio con nivel de profundidad mayor o igual a cinco dentro del árbol de directorios.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let body1 = {
            "userIdResponsible": userConnected._id.toString(),
            "path": "C:\\Users\\javie\\OneDrive\\Escritorio\\TFG\\Codigo\\plestacad\\plestacad-back/userdata/" + workCreated[0]._id.toString() + "/" + workCreated[0].title.toString() + "/testDeep",
            "workId": workCreated[0]._id.toString()
        }
        let body2 = {
            "userIdResponsible": userConnected._id.toString(),
            "path": "C:\\Users\\javie\\OneDrive\\Escritorio\\TFG\\Codigo\\plestacad\\plestacad-back/userdata/" + workCreated[0]._id.toString() + "/" + workCreated[0].title.toString() + "/testDeep/testDeep2",
            "workId": workCreated[0]._id.toString()
        }
        let body3 = {
            "userIdResponsible": userConnected._id.toString(),
            "path": "C:\\Users\\javie\\OneDrive\\Escritorio\\TFG\\Codigo\\plestacad\\plestacad-back/userdata/" + workCreated[0]._id.toString() + "/" + workCreated[0].title.toString() + "/testDeep/testDeep2/testDeep3",
            "workId": workCreated[0]._id.toString()
        }
        let body4 = {
            "userIdResponsible": userConnected._id.toString(),
            "path": "C:\\Users\\javie\\OneDrive\\Escritorio\\TFG\\Codigo\\plestacad\\plestacad-back/userdata/" + workCreated[0]._id.toString() + "/" + workCreated[0].title.toString() + "/testDeep/testDeep2/testDeep3/testDeep4",
            "workId": workCreated[0]._id.toString()
        }
        let body5 = {
            "userIdResponsible": userConnected._id.toString(),
            "path": "C:\\Users\\javie\\OneDrive\\Escritorio\\TFG\\Codigo\\plestacad\\plestacad-back/userdata/" + workCreated[0]._id.toString() + "/" + workCreated[0].title.toString() + "/testDeep/testDeep2/testDeep3/testDeep4/testDeep5",
            "workId": workCreated[0]._id.toString()
        }
        const res1 = await request(app).post('/api/files/createDir').send(body1).set({ "access-token": access_token })
        const res2 = await request(app).post('/api/files/createDir').send(body2).set({ "access-token": access_token })
        const res3 = await request(app).post('/api/files/createDir').send(body3).set({ "access-token": access_token })
        const res4 = await request(app).post('/api/files/createDir').send(body4).set({ "access-token": access_token })
        const res5 = await request(app).post('/api/files/createDir').send(body5).set({ "access-token": access_token })

        expect(res1.statusCode).toEqual(200);
        expect(res2.statusCode).toEqual(200);
        expect(res3.statusCode).toEqual(200);
        expect(res4.statusCode).toEqual(200);
        expect(res5.statusCode).toEqual(400);

    })

    it('Usuario no perteneciente a trabajo académico elimina un directorio vacío.', async () => {
        const resLogin = await request(app).post('/api/login').send({ "email": "user4Test4@test.es", "password": "aaaaaaaaa" })
        let access_token_no_perteneciente = resLogin._body.token; //se inicia sesión con un usuario.
        let userNoPerteneciente = await User.findOne({ "email": "user4Test4@test.es" });
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let body = {
            "userIdResponsible": userNoPerteneciente._id.toString(),
            "path": "C:\\Users\\javie\\OneDrive\\Escritorio\\TFG\\Codigo\\plestacad\\plestacad-back/userdata/" + workCreated[0]._id.toString() + "/" + workCreated[0].title.toString() + "/testCaseFolder",
            "workId": workCreated[0]._id.toString()
        }
        const res = await request(app).post('/api/files/deleteDir/' + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token_no_perteneciente })
        expect(res.statusCode).toEqual(403);
    })

    it('Usuario perteneciente a trabajo académico elimina un directorio vacío.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let body = {
            "userIdResponsible": userConnected._id.toString(),
            "path": "C:\\Users\\javie\\OneDrive\\Escritorio\\TFG\\Codigo\\plestacad\\plestacad-back/userdata/" + workCreated[0]._id.toString() + "/" + workCreated[0].title.toString() + "/testCaseFolder",
            "workId": workCreated[0]._id.toString()
        }
        const res = await request(app).post('/api/files/deleteDir/' + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token })
        expect(res.statusCode).toEqual(200);
    })


    it('Usuario no perteneciente a trabajo académico sube un archivo con tamaño menor o igual a 20MB.', async () => {
        const resLogin = await request(app).post('/api/login').send({ "email": "user4Test4@test.es", "password": "aaaaaaaaa" })
        let access_token_no_perteneciente = resLogin._body.token; //se inicia sesión con un usuario.
        let userNoPerteneciente = await User.findOne({ "email": "user4Test4@test.es" });
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        const res = await request(app).post('/api/files/add').field('userIdResponsible', userNoPerteneciente._id.toString())
            .field("path", "C:\\Users\\javie\\OneDrive\\Escritorio\\TFG\\Codigo\\plestacad\\plestacad-back/userdata/" + workCreated[0]._id.toString() + "/" + workCreated[0].title.toString() + "/testDeep")
            .field("workId", workCreated[0]._id.toString())
            .attach('image', './test/resources/image4test.png').set({ "connection": 'keep-alive', "access-token": access_token_no_perteneciente });

        expect(res.statusCode).toEqual(403);
    })

    it('Usuario perteneciente a trabajo académico sube un archivo con tamaño menor o igual a 20MB.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        const res = await request(app).post('/api/files/add').field('userIdResponsible', userConnected._id.toString())
            .field("path", "C:\\Users\\javie\\OneDrive\\Escritorio\\TFG\\Codigo\\plestacad\\plestacad-back/userdata/" + workCreated[0]._id.toString() + "/" + workCreated[0].title.toString() + "/testDeep")
            .field("workId", workCreated[0]._id.toString())
            .attach('upload', './test/resources/image4test.png').set({ "connection": 'keep-alive', "access-token": access_token });

        expect(res.statusCode).toEqual(200);
    })

    it('Usuario perteneciente a trabajo académico sube un archivo con tamaño superior a 20MB.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        const res = await request(app).post('/api/files/add').field('userIdResponsible', userConnected._id.toString())
            .field("path", "C:\\Users\\javie\\OneDrive\\Escritorio\\TFG\\Codigo\\plestacad\\plestacad-back/userdata/" + workCreated[0]._id.toString() + "/" + workCreated[0].title.toString() + "/testDeep")
            .field("workId", workCreated[0]._id.toString())
            .attach('upload', './test/resources/file4test.exe').set({ "connection": 'keep-alive', "access-token": access_token });

        expect(res.statusCode).toEqual(400);
    })


    
    it('Usuario perteneciente a trabajo académico elimina directorio con elementos dentro de él.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let body = {
            "userIdResponsible": userConnected._id.toString(),
            "path": "C:\\Users\\javie\\OneDrive\\Escritorio\\TFG\\Codigo\\plestacad\\plestacad-back/userdata/" + workCreated[0]._id.toString() + "/" + workCreated[0].title.toString() + "/testDeep",
            "workId": workCreated[0]._id.toString()
        }
        const res = await request(app).post('/api/files/deleteDir/' + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token })
        expect(res.statusCode).toEqual(400); //no se permite borrar un directorio con elementos dentro.
    })

    it('Usuario no perteneciente a trabajo académico descarga un archivo de dicho trabajo.', async () => {
        const resLogin = await request(app).post('/api/login').send({ "email": "user4Test4@test.es", "password": "aaaaaaaaa" })
        let access_token_no_perteneciente = resLogin._body.token; //se inicia sesión con un usuario.
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let body = {
            "path": "C:\\Users\\javie\\OneDrive\\Escritorio\\TFG\\Codigo\\plestacad\\plestacad-back/userdata/" + workCreated[0]._id.toString() + "/" + workCreated[0].title.toString() + "/testDeep/image4test.png"
        }
        const res = await request(app).post('/api/files/download/' + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token_no_perteneciente })
        expect(res.statusCode).toEqual(403);
    })


    it('Usuario perteneciente a trabajo académico descarga un archivo de dicho trabajo.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let body = {
            "path": "C:\\Users\\javie\\OneDrive\\Escritorio\\TFG\\Codigo\\plestacad\\plestacad-back/userdata/" + workCreated[0]._id.toString() + "/" + workCreated[0].title.toString() + "/testDeep/image4test.png"
        }
        const res = await request(app).post('/api/files/download/' + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token })
        expect(res.statusCode).toEqual(200);
        expect(res.type).toEqual("image/png")
    })


    it('Usuario no perteneciente a trabajo académico elimina archivo de dicho trabajo.', async () => {
        const resLogin = await request(app).post('/api/login').send({ "email": "user4Test4@test.es", "password": "aaaaaaaaa" })
        let access_token_no_perteneciente = resLogin._body.token; //se inicia sesión con un usuario.
        let userNoPerteneciente = await User.findOne({ "email": "user4Test4@test.es" });
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let body = {
            "userIdResponsible": userNoPerteneciente._id.toString(),
            "path": "C:\\Users\\javie\\OneDrive\\Escritorio\\TFG\\Codigo\\plestacad\\plestacad-back/userdata/" + workCreated[0]._id.toString() + "/" + workCreated[0].title.toString() + "/testDeep/image4test.png"
        }
        const res = await request(app).post('/api/files/delete/' + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token_no_perteneciente })
        expect(res.statusCode).toEqual(403);
    })

    it('Usuario perteneciente a trabajo académico elimina archivo de dicho trabajo.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let body = {
            "userIdResponsible": userConnected._id.toString(),
            "path": "C:\\Users\\javie\\OneDrive\\Escritorio\\TFG\\Codigo\\plestacad\\plestacad-back/userdata/" + workCreated[0]._id.toString() + "/" + workCreated[0].title.toString() + "/testDeep/image4test.png"
        }
        const res = await request(app).post('/api/files/delete/' + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token })
        expect(res.statusCode).toEqual(200);
    })



});
