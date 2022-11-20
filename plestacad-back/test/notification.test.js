const request = require('supertest');
const app = "http://localhost:5200";
let mongoose = require('mongoose');
let User = require("../models/User");
let Work = require("../models/Work");
let WorkRequest = require("../models/WorkRequest");
let Notification = require("../models/Notification");
let TaskClassificator = require("../models/TaskClassificator");
let Task = require("../models/Task");
let CalendarEvent = require("../models/CalendarEvent");

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
    const res5 = await request(app)
        .post('/api/signup').send({ "name": "user4Test4", "surname": "user4Test5", "email": "user4Test5@test.es", "password": "aaaaaaaaa" });
    await User.findOneAndUpdate({ "email": "user4Test5@test.es" }, { "verified": true })
    const resLogin = await request(app).post('/api/login').send({ "email": "user4Test2@test.es", "password": "aaaaaaaaa" })
    access_token = resLogin._body.token; //se inicia sesión con un usuario.
    userConnected = await User.findOne({ "email": "user4Test2@test.es" }); //propietario del trabajo académico.
    let userTeacher = await User.findOne({ "email": "user4Test3@test.es" });
    let userStudent = await User.findOne({ "email": "user4Test4@test.es" });
    // se crea trabajo académico
    const newWork = {
        title: "Test",
        authorId: userConnected._id.toString(),
        teachersInvited: [],
        studentsInvited: [],
        teachers: [userConnected._id.toString(), userTeacher._id.toString()],
        students: [userStudent._id.toString()],
        category: "tfg",
        description: "test description",
        course: 2022
    }
    await request(app).post('/api/works').send(newWork).set({ "access-token": access_token })
})
afterAll(async () => {
    await User.deleteMany();
    await Work.deleteMany();
    await WorkRequest.deleteMany();
    await Notification.deleteMany();
    await TaskClassificator.deleteMany();
    await Task.deleteMany();
    await CalendarEvent.deleteMany();

    await mongoose.connection.close();

})


describe(' Pruebas unitarias notificaciones ', () => {


    
    it('Usuario elimina una notificación cuya lista de receptores es mayor a uno y está contenido en ella.', async () => {

        // Se crea un post en el trabajo académico para crear una notificación.
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let body = {
            "title": "Test Title",
            "message": "test message",
            "authorId": userConnected._id.toString(),
            "workId": workCreated[0]._id.toString(),
            "creationDate": new Date(),
            "lastMessageDate": new Date(),
            "isFavorite": false,
            "interactions": []
        }
        await request(app).post("/api/posts/" + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token });

        let notificationBefore = await Notification.find({ "workId": workCreated[0]._id.toString()});
        let bodyNotification = {
            "notificationId":  notificationBefore[0]._id.toString(),
            "userIdReceiver": userConnected._id.toString() 
        }
        let res = await request(app).post("/api/notification/markAsRead").send(bodyNotification).set({ "access-token": access_token });
        let notificationAfter = await Notification.find({ "workId": workCreated[0]._id.toString()});
        expect(res.statusCode).toEqual(200);
        expect(notificationBefore[0].usersIdReceivers.length).toEqual(3);
        expect(notificationAfter[0].usersIdReceivers.length).toEqual(2);

    });

    it('Usuario visualiza su lista de notificaciones.', async () => {
        const resLogin1 = await request(app).post('/api/login').send({ "email": "user4Test3@test.es", "password": "aaaaaaaaa" })
        let access_token_teacher = resLogin1._body.token; //se inicia sesión con uno de los otros dos usuarios que reciben la notificación.
        let userTeacher = await User.findOne({ "email": "user4Test3@test.es" });
        let res = await request(app).get("/api/notification/receiver/" + userTeacher._id.toString()).set({ "access-token": access_token_teacher });
        expect(res.statusCode).toEqual(200);
        expect(JSON.parse(res.text).data.length).toBeGreaterThan(0); //la lista de notificaciones recibidas es mayor que cero.
    });


    it('Usuario elimina una notificación en cuya lista de receptores no está contenido el usuario.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        const resLogin = await request(app).post('/api/login').send({ "email": "user4Test5@test.es", "password": "aaaaaaaaa" })
        let access_token_no_receptor = resLogin._body.token; //se inicia sesión con usuario que no está en el trabajo académico y no recibe la notificación.
        let userNoReceptor = await User.findOne({ "email": "user4Test5@test.es" });
        let notification= await Notification.find({ "workId": workCreated[0]._id.toString()});
        let bodyNotification = {
            "notificationId":  notification[0]._id.toString(),
            "userIdReceiver": userNoReceptor._id.toString() 
        }
        let res = await request(app).post("/api/notification/markAsRead").send(bodyNotification).set({ "access-token": access_token_no_receptor });
        expect(res.statusCode).toEqual(403);
    });



    it('Usuario elimina una notificación cuya lista de receptores solo contiene al usuario en cuestión.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })

        const resLogin1 = await request(app).post('/api/login').send({ "email": "user4Test3@test.es", "password": "aaaaaaaaa" })
        let access_token_teacher = resLogin1._body.token; //se inicia sesión con uno de los otros dos usuarios que reciben la notificación.
        let userTeacher = await User.findOne({ "email": "user4Test3@test.es" });

        let notificationBefore = await Notification.find({ "workId": workCreated[0]._id.toString()});
        let bodyNotification = {
            "notificationId":  notificationBefore[0]._id.toString(),
            "userIdReceiver": userTeacher._id.toString() 
        }
        let res = await request(app).post("/api/notification/markAsRead").send(bodyNotification).set({ "access-token": access_token_teacher });
        let notificationAfter = await Notification.find({ "workId": workCreated[0]._id.toString()});
        expect(res.statusCode).toEqual(200);
        expect(notificationBefore[0].usersIdReceivers.length).toEqual(2);
        expect(notificationAfter[0].usersIdReceivers.length).toEqual(1); //solo queda un usuario en la notificación, se procede a loguearse con el último usuario receptor y eliminarla.

        const resLogin2 = await request(app).post('/api/login').send({ "email": "user4Test4@test.es", "password": "aaaaaaaaa" })
        let access_token_student= resLogin2._body.token; //se inicia sesión con uno de los otros dos usuarios que reciben la notificación.
        let userStudent = await User.findOne({ "email": "user4Test4@test.es" });

        let notificationBefore2 = await Notification.find({ "workId": workCreated[0]._id.toString()});
        let bodyNotification2 = {
            "notificationId":  notificationBefore2[0]._id.toString(),
            "userIdReceiver": userStudent._id.toString() 
        }
        let res2 = await request(app).post("/api/notification/markAsRead").send(bodyNotification2).set({ "access-token": access_token_student });
        let notificationAfter2 = await Notification.find({ "workId": workCreated[0]._id.toString()});
        expect(res2.statusCode).toEqual(200);
        expect(notificationBefore2[0].usersIdReceivers.length).toEqual(1);
        expect(notificationAfter2[0]).toBeUndefined(); //la notificación se elimina al eliminar al último usuario de esta.

        
    });



});