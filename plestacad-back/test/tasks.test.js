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


describe(' Pruebas unitarias tareas ', () => {

    it('Usuario no perteneciente a trabajo académico crea un apartado de clasificación de tareas con datos válidos.', async () => {
        const resLoginNoPerteneciente = await request(app).post('/api/login').send({ "email": "user4Test5@test.es", "password": "aaaaaaaaa" })
        let access_token_no_perteneciente = resLoginNoPerteneciente._body.token;
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let body = {
            "title": "Test title",
            "order": 1,
            "workId": workCreated[0]._id.toString()
        }
        const res = await request(app)
            .post("/api/taskclassificator/" + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token_no_perteneciente });
        expect(res.statusCode).toEqual(403);
    });

    it('Usuario perteneciente a trabajo académico crea un apartado de clasificación de tareas con datos válidos.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let body = {
            "title": "Test title",
            "order": 1,
            "workId": workCreated[0]._id.toString()
        }
        let taskClassificatorBeforeCreate = await TaskClassificator.find({ "title": "Test title" });
        const res = await request(app)
            .post("/api/taskclassificator/" + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);
        let taskClassificatorAfterCreate = await TaskClassificator.find({ "title": "Test title" });
        expect(taskClassificatorBeforeCreate[0]).toBeUndefined();
        expect(taskClassificatorAfterCreate[0]).not.toBeUndefined();
    });

    it('Usuario perteneciente a trabajo académico crea un apartado de clasificación de tareas con datos inválidos: título no especificado.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let body = {
            "title": "",
            "order": 1,
            "workId": workCreated[0]._id.toString()
        }
        let taskClassificatorBeforeCreate = await TaskClassificator.find({ "title": "Test title" });
        const res = await request(app)
            .post("/api/taskclassificator/" + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(400);
    });


    it('Usuario no perteneciente a trabajo académico modifica un apartado de clasificación de tareas con datos válidos.', async () => {
        const resLoginNoPerteneciente = await request(app).post('/api/login').send({ "email": "user4Test5@test.es", "password": "aaaaaaaaa" })
        let access_token_no_perteneciente = resLoginNoPerteneciente._body.token;
        let taskClassificatorBeforeEdit = await TaskClassificator.find({ "title": "Test title" });
        expect(taskClassificatorBeforeEdit[0]).not.toBeUndefined();
        let body = {
            "title": "Test title edited",
            "_id": taskClassificatorBeforeEdit[0]._id.toString(),
        }
        const res = await request(app)
            .put("/api/taskclassificator").send(body).set({ "access-token": access_token_no_perteneciente });
        expect(res.statusCode).toEqual(403);
        let taskClassificatorAfterEdit = await TaskClassificator.find({ "title": "Test title" });

        expect(taskClassificatorBeforeEdit[0].title).toEqual("Test title"); //el titulo no cambia
        expect(taskClassificatorAfterEdit[0].title).toEqual("Test title");
    });

    it('Usuario perteneciente a trabajo académico modifica un apartado de clasificación de tareas con datos válidos.', async () => {
        let taskClassificatorBeforeEdit = await TaskClassificator.find({ "title": "Test title" });
        expect(taskClassificatorBeforeEdit[0]).not.toBeUndefined();
        let body = {
            "title": "Test title edited",
            "_id": taskClassificatorBeforeEdit[0]._id.toString(),
        }
        const res = await request(app)
            .put("/api/taskclassificator").send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);
        let taskClassificatorAfterEdit = await TaskClassificator.find({ "title": "Test title edited" });
        expect(taskClassificatorBeforeEdit[0].title).toEqual("Test title");
        expect(taskClassificatorAfterEdit[0].title).toEqual("Test title edited");  //el titulo si cambia
    });


    it('Usuario perteneciente a trabajo académico modifica un apartado de clasificación de tareas con datos inválidos: título no especificado.', async () => {
        let taskClassificatorBeforeEdit = await TaskClassificator.find({ "title": "Test title edited" });
        expect(taskClassificatorBeforeEdit[0]).not.toBeUndefined();
        let body = {
            "title": "",
            "_id": taskClassificatorBeforeEdit[0]._id.toString(),
        }
        const res = await request(app)
            .put("/api/taskclassificator").send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(400);
        let taskClassificatorAfterEdit = await TaskClassificator.find({ "title": "Test title edited" });
        expect(taskClassificatorAfterEdit[0]).not.toBeUndefined(); //sigue existiendo el clasificador con el título anterior, no se ha modificado.
    });

    it('Usuario no perteneciente a trabajo académico crea nueva tarea en dicho trabajo con datos válidos.', async () => {
        const resLoginNoPerteneciente = await request(app).post('/api/login').send({ "email": "user4Test5@test.es", "password": "aaaaaaaaa" })
        let access_token_no_perteneciente = resLoginNoPerteneciente._body.token;
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let taskClassificator = await TaskClassificator.find({ "title": "Test title edited" });

        let body = {
            "title": "Title task",
            "description": "Description task",
            "taskClassificatorId": taskClassificator[0]._id.toString(),
            "workId": workCreated[0]._id.toString()
        }
        const res = await request(app)
            .post("/api/task/" + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token_no_perteneciente });
        expect(res.statusCode).toEqual(403);
    });


    it('Usuario perteneciente a trabajo académico crea nueva tarea en dicho trabajo con datos válidos: fecha de fin e inicio sin especificar.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let taskClassificator = await TaskClassificator.find({ "title": "Test title edited" });
        let body = {
            "title": "Title task",
            "description": "Description task",
            "taskClassificatorId": taskClassificator[0]._id.toString(),
            "workId": workCreated[0]._id.toString(),
            "start": "",
            "end": ""
        }
        let taskBeforeCreate = await Task.find({ "title": "Title task" })
        const res = await request(app)
            .post("/api/task/" + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);
        let taskAfterCreate = await Task.find({ "title": "Title task" })
        expect(taskBeforeCreate[0]).toBeUndefined();
        expect(taskAfterCreate[0]).not.toBeUndefined();
    });

    it('Usuario perteneciente a trabajo académico crea nueva tarea en dicho trabajo con datos válidos: fecha de fin e inicio especificadas.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let taskClassificator = await TaskClassificator.find({ "title": "Test title edited" });
        let body = {
            "title": "Title task with event",
            "description": "Description task",
            "taskClassificatorId": taskClassificator[0]._id.toString(),
            "workId": workCreated[0]._id.toString(),
            "start": new Date("2022-07-11"),
            "end": new Date("2022-07-12"),
        }
        let taskBeforeCreate = await Task.find({ "title": "Title task with event" })

        const res = await request(app)
            .post("/api/task/" + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);
        let taskAfterCreate = await Task.find({ "title": "Title task with event" });
        let calendarEventFromTask = await CalendarEvent.find({ "taskOriginId": taskAfterCreate[0]._id.toString() })
        expect(taskBeforeCreate[0]).toBeUndefined();
        expect(taskAfterCreate[0]).not.toBeUndefined();
        expect(calendarEventFromTask[0]).not.toBeUndefined();
        expect(calendarEventFromTask[0].title).toEqual(taskAfterCreate[0].title); //el titulo del evento coincide con el titulo de la tarea que lleva asociada.
    });


    it('Usuario perteneciente a trabajo académico crea nueva tarea en dicho trabajo con datos inválidos: título sin especificar.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let taskClassificator = await TaskClassificator.find({ "title": "Test title edited" });
        let body = {
            "title": "",
            "description": "test",
            "taskClassificatorId": taskClassificator[0]._id.toString(),
            "workId": workCreated[0]._id.toString(),
            "start": new Date("2022-07-11"),
            "end": new Date("2022-07-12"),
        }
        const res = await request(app)
            .post("/api/task/" + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(400);
    });

    it('Usuario no perteneciente a trabajo académico visualiza la lista de tareas de dicho trabajo.', async () => {
        const resLoginNoPerteneciente = await request(app).post('/api/login').send({ "email": "user4Test5@test.es", "password": "aaaaaaaaa" })
        let access_token_no_perteneciente = resLoginNoPerteneciente._body.token;
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        const res = await request(app)
            .get("/api/tasks/work/" + workCreated[0]._id.toString()).set({ "access-token": access_token_no_perteneciente });
        expect(res.statusCode).toEqual(403);
    });

    it('Usuario perteneciente a trabajo académico visualiza la lista de tareas de dicho trabajo.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        const res = await request(app)
            .get("/api/tasks/work/" + workCreated[0]._id.toString()).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);
        expect(JSON.parse(res.text).data.length).toBeGreaterThan(0); // la lista de tareas devueltas es mayor que 0.
    });

    it('Usuario no perteneciente a trabajo académico elimina tarea de dicho trabajo.', async () => {
        const resLoginNoPerteneciente = await request(app).post('/api/login').send({ "email": "user4Test5@test.es", "password": "aaaaaaaaa" })
        let access_token_no_perteneciente = resLoginNoPerteneciente._body.token;
        let userNoPerteneciente = await User.findOne({ "email": "user4Test5@test.es" });
        let task = await Task.find({ "title": "Title task with event" });
        const res = await request(app)
            .delete("/api/task/" + task[0]._id.toString() + "/" + userNoPerteneciente._id.toString()).set({ "access-token": access_token_no_perteneciente });
        expect(res.statusCode).toEqual(403);
    });


    it('Usuario perteneciente a trabajo académico elimina tarea de dicho trabajo.', async () => {
        let taskBeforeDeleted = await Task.find({ "title": "Title task with event" });
        let eventBeforeDeleted = await CalendarEvent.find({ "taskOriginId": taskBeforeDeleted[0]._id.toString() });

        const res = await request(app)
            .delete("/api/task/" + taskBeforeDeleted[0]._id.toString() + "/" + userConnected._id.toString()).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);
        let taskAfterDeleted = await Task.find({ "title": "Title task with event" });
        let eventAfterDeleted = await CalendarEvent.find({ "taskOriginId": taskBeforeDeleted[0]._id.toString() });

        expect(taskBeforeDeleted[0]).not.toBeUndefined();
        expect(taskAfterDeleted[0]).toBeUndefined();
        expect(eventBeforeDeleted[0]).not.toBeUndefined();
        expect(eventAfterDeleted[0]).toBeUndefined();
    });


    it('Usuario no perteneciente a trabajo académico modifica una tarea en dicho trabajo con datos válidos.', async () => {
        const resLoginNoPerteneciente = await request(app).post('/api/login').send({ "email": "user4Test5@test.es", "password": "aaaaaaaaa" })
        let access_token_no_perteneciente = resLoginNoPerteneciente._body.token;
        let task = await Task.find({ "title": "Title task" });

        let body = {
            "_id": task[0]._id.toString(),
            "title": "Title task edited",
            "description": "Description task edited"
        }
        const res = await request(app)
            .put("/api/task").send(body).set({ "access-token": access_token_no_perteneciente });
        expect(res.statusCode).toEqual(403);
    });

    it('Usuario no perteneciente a trabajo académico modifica una tarea en dicho trabajo con datos válidos.', async () => {
        let task = await Task.find({ "title": "Title task" });

        let body = {
            "_id": task[0]._id.toString(),
            "title": "Title task edited",
            "description": "Description task edited",
            "start": "",
            "end": "",
            "taskClassificatorId": task[0].taskClassificatorId,
            "userAssignedId": task[0].userAssignedId
        }
        const res = await request(app)
            .put("/api/task").send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);
        let taskEdited = await Task.find({ "title": "Title task edited" });
        expect(taskEdited[0]).not.toBeUndefined();
    });

    it('Usuario perteneciente a trabajo académico modifica tarea con fecha de fin e inicio sin especificar con datos de fecha de inicio y fecha de fin especificados.', async () => {
        let task = await Task.find({ "title": "Title task edited" });
        let calendarEventBefore = await CalendarEvent.find({ "taskOriginId": task[0]._id.toString()})
        let body = {
            "_id": task[0]._id.toString(),
            "title": "Title task edited",
            "description": "Description task edited",
            "start": new Date("2022-07-11"),
            "end": new Date("2022-07-12"),
            "taskClassificatorId": task[0].taskClassificatorId,
            "userAssignedId": task[0].userAssignedId
        }
        const res = await request(app)
            .put("/api/task").send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);
        let calendarEventAfter= await CalendarEvent.find({ "taskOriginId": task[0]._id.toString()})

        let taskEdited = await Task.find({ "title": "Title task edited" });
        expect(taskEdited[0]).not.toBeUndefined();
        expect(calendarEventBefore[0]).toBeUndefined(); 
        expect(calendarEventAfter[0]).not.toBeUndefined(); //se crea el evento de calendario asociado.

    });

    it('Usuario perteneciente a trabajo académico modifica tarea con fecha de fin e inicio especificadas con datos de fecha de inicio y fecha de fin sin especificar.', async () => {
        let task = await Task.find({ "title": "Title task edited" });
        let calendarEventBefore = await CalendarEvent.find({ "taskOriginId": task[0]._id.toString()})
        let body = {
            "_id": task[0]._id.toString(),
            "title": "Title task edited",
            "description": "Description task edited",
            "start": "",
            "end": "",
            "taskClassificatorId": task[0].taskClassificatorId,
            "userAssignedId": task[0].userAssignedId
        }
        const res = await request(app)
            .put("/api/task").send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);
        let calendarEventAfter= await CalendarEvent.find({ "taskOriginId": task[0]._id.toString()})

        let taskEdited = await Task.find({ "title": "Title task edited" });
        expect(taskEdited[0]).not.toBeUndefined();
        expect(calendarEventBefore[0]).not.toBeUndefined(); 
        expect(calendarEventAfter[0]).toBeUndefined(); //se borra el evento de calendario asociado.

    });

    it('Usuario perteneciente a trabajo académico modifica tarea de dicho trabajo con datos inválidos: título y descripción no especificados.', async () => {
        let task = await Task.find({ "title": "Title task edited" });
        let body = {
            "_id": task[0]._id.toString(),
            "title": "",
            "description": "",
            "start": "",
            "end": "",
            "taskClassificatorId": task[0].taskClassificatorId,
            "userAssignedId": task[0].userAssignedId
        }
        const res = await request(app)
            .put("/api/task").send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(400);
    });

    it('Usuario perteneciente a trabajo académico modifica tarea de dicho trabajo con datos inválidos: fecha de fin anterior a fecha de inicio.', async () => {
        let task = await Task.find({ "title": "Title task edited" });
        let body = {
            "_id": task[0]._id.toString(),
            "title": "Title task edited",
            "description": "Description task edited",
            "start": new Date("2022-07-11"),
            "end": new Date("2022-06-11"),
            "taskClassificatorId": task[0].taskClassificatorId,
            "userAssignedId": task[0].userAssignedId
        }
        const res = await request(app)
            .put("/api/task").send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(400);
    });



    it('Usuario no perteneciente a trabajo académico clasifica una tarea de dicho trabajo.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        //se crea un nuevo apartado para modificar la clasificación de la tarea.
        let bodyTaskClassificator = {
            "title": "Test new to classify task",
            "order": 1,
            "workId": workCreated[0]._id.toString()
        }
        await request(app).post("/api/taskclassificator/" + workCreated[0]._id.toString()).send(bodyTaskClassificator).set({ "access-token": access_token });
        let taskClassificator = await TaskClassificator.find({ "title": "Test new to classify task"})

        const resLoginNoPerteneciente = await request(app).post('/api/login').send({ "email": "user4Test5@test.es", "password": "aaaaaaaaa" })
        let userNoPerteneciente = await User.findOne({ "email": "user4Test5@test.es" });
        let access_token_no_perteneciente = resLoginNoPerteneciente._body.token;
        let task = await Task.find({ "title": "Title task edited" });

        let body = {
            "id" : task[0]._id.toString(),
            "userIdResponsible" : userNoPerteneciente._id.toString(),
            "taskClassificatorId" : taskClassificator[0]._id.toString()
        }
        const res = await request(app)
            .put("/api/task/classificator").send(body).set({ "access-token": access_token_no_perteneciente });
        expect(res.statusCode).toEqual(403);

    });

   it('Usuario no perteneciente a trabajo académico clasifica una tarea de dicho trabajo.', async () => {
        let taskClassificator = await TaskClassificator.find({ "title": "Test new to classify task"})
        let task = await Task.find({ "title": "Title task edited" });

        let body = {
            "id" : task[0]._id.toString(),
            "userIdResponsible" : userConnected._id.toString(),
            "taskClassificatorId" : taskClassificator[0]._id.toString()
        }
        const res = await request(app)
            .put("/api/task/classificator").send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);
        let taskEdited = await Task.find({ "title": "Title task edited" });
        expect(task[0].taskClassificatorId).not.toEqual(taskClassificator[0]._id);
        expect(taskEdited[0].taskClassificatorId).toEqual(taskClassificator[0]._id); //se comprueba que ha cambiado el apartado de clasificación de la tarea.
    });











});

