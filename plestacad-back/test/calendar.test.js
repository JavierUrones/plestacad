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

describe(' Pruebas unitarias calendario ', () => {

    it('Usuario no perteneciente a trabajo académico crea un evento con datos válidos en dicho trabajo académico.', async () => {
        const resLoginNoPerteneciente = await request(app).post('/api/login').send({ "email": "user4Test5@test.es", "password": "aaaaaaaaa" })
        let access_token_no_perteneciente = resLoginNoPerteneciente._body.token;
        let userNoPerteneciente = await User.findOne({ "email": "user4Test5@test.es" });
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let body = {
            "title": "Test Title",
            "description": "description event",
            "start": new Date(),
            "end": new Date(),
            "tags": [],
            "workId": workCreated[0]._id.toString()
        }
        const res = await request(app)
            .post("/api/calendar/" + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token_no_perteneciente });
        expect(res.statusCode).toEqual(403);
    });

    it('Usuario perteneciente a trabajo académico crea un evento con datos válidos en dicho trabajo académico.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let body = {
            "title": "Test Title",
            "description": "description event",
            "start": new Date('2022-08-11'),
            "end": new Date('2022-08-12'),
            "tags": [],
            "workId": workCreated[0]._id.toString()
        }
        expect(await CalendarEvent.find({"workId": workCreated[0]._id.toString()})).toBeNull;
        const res = await request(app)
            .post("/api/calendar/" + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);
        expect(await CalendarEvent.find({"workId": workCreated[0]._id.toString()})).not.toBeNull;
    });

    it('Usuario perteneciente a trabajo académico crea un evento con datos inválidos: fecha de inicio posterior a fecha de fin.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let body = {
            "title": "Test Title",
            "description": "description event",
            "start": new Date('2022-08-11'),
            "end": new Date('2022-07-11'),
            "tags": [],
            "workId": workCreated[0]._id.toString()
        }
        expect(await CalendarEvent.find({"workId": workCreated[0]._id.toString()})).toBeNull;
        const res = await request(app)
            .post("/api/calendar/" + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(400);
    });

    it('Usuario perteneciente a trabajo académico crea un evento con datos inválidos: título.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let body = {
            "title": "",
            "description": "test",
            "start": new Date('2022-08-11'),
            "end": new Date('2022-07-11'),
            "tags": [],
            "workId": workCreated[0]._id.toString()
        }
        expect(await CalendarEvent.find({"workId": workCreated[0]._id.toString()})).toBeNull;
        const res = await request(app)
            .post("/api/calendar/" + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(400);
    });

    it('Usuario no perteneciente a trabajo académico visualiza los eventos del calendario de dicho trabajo académico.', async () => {
        const resLoginNoPerteneciente = await request(app).post('/api/login').send({ "email": "user4Test5@test.es", "password": "aaaaaaaaa" })
        let access_token_no_perteneciente = resLoginNoPerteneciente._body.token;
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        const res = await request(app)
            .get("/api/calendar/" + workCreated[0]._id.toString()).set({ "access-token": access_token_no_perteneciente });
        expect(res.statusCode).toEqual(403);
    });

    it('Usuario perteneciente a trabajo académico visualiza los eventos del calendario de dicho trabajo académico.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        const res = await request(app)
            .get("/api/calendar/" + workCreated[0]._id.toString()).set({ "access-token": access_token});
        expect(res.statusCode).toEqual(200);
    });


    it('Usuario no perteneciente a trabajo académico elimina un evento del calendario.', async () => {
        const resLoginNoPerteneciente = await request(app).post('/api/login').send({ "email": "user4Test5@test.es", "password": "aaaaaaaaa" })
        let access_token_no_perteneciente = resLoginNoPerteneciente._body.token;
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let userNoPerteneciente = await User.findOne({ "email": "user4Test5@test.es" });

        let calendarEventToDelete = await CalendarEvent.find({ "workId": workCreated[0]._id.toString() })

        const res = await request(app)
            .delete("/api/calendar/" + calendarEventToDelete[0]._id.toString() + "/" +userNoPerteneciente._id.toString() ).set({ "access-token": access_token_no_perteneciente });
        expect(res.statusCode).toEqual(403);
    });


    it('Usuario perteneciente a trabajo académico elimina un evento del calendario.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let calendarEventToDelete = await CalendarEvent.find({ "workId": workCreated[0]._id.toString() })
        const res = await request(app)
            .delete("/api/calendar/" + calendarEventToDelete[0]._id.toString() + "/" +userConnected._id.toString() ).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);
        let calendarEventDeleted = await CalendarEvent.find({ "workId": workCreated[0]._id.toString() })
        expect(calendarEventToDelete).not.toBeNull;
        expect(calendarEventDeleted).toBeNull;

    });








    

});