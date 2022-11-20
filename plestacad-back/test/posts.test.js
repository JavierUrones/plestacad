const request = require('supertest');
const app = "http://localhost:5200";
let mongoose = require('mongoose');
let User = require("../models/User");
let Work = require("../models/Work");
let WorkRequest = require("../models/WorkRequest");
let Notification = require("../models/Notification");
let TaskClassificator = require("../models/TaskClassificator")
let Post = require("../models/Post");
let PostInteraction = require("../models/PostInteraction");

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
        .post('/api/signup').send({ "name": "user4Test5", "surname": "user4Test5", "email": "user4Test5@test.es", "password": "aaaaaaaaa" });
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
    await Post.deleteMany();
    await PostInteraction.deleteMany();
    await mongoose.connection.close();
})


describe(' Pruebas unitarias del foro ', () => {

    it('Usuario no perteneciente a trabajo académico crea tema con título y contenido válidos.', async () => {
        const resLoginNoPerteneciente = await request(app).post('/api/login').send({ "email": "user4Test5@test.es", "password": "aaaaaaaaa" })
        let access_token_no_perteneciente = resLoginNoPerteneciente._body.token; //se inicia sesión con un usuario no perteneciente.
        let userNoPerteneciente = await User.findOne({ "email": "user4Test4@test.es" });
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let body = {
            "title": "Test Title",
            "message": "test message",
            "authorId": userNoPerteneciente._id.toString(),
            "workId": workCreated[0]._id.toString(),
            "creationDate": new Date(),
            "lastMessageDate": new Date(),
            "isFavorite": false,
            "interactions": []
        }
        const res = await request(app)
        .post("/api/posts/" + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token_no_perteneciente });
        expect(res.statusCode).toEqual(403);

    });

    it('Usuario perteneciente a trabajo académico crea tema con título y contenido válidos.', async () => {
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
        const res = await request(app)
        .post("/api/posts/" + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);

    });

    it('Usuario perteneciente a trabajo académico crea tema con título y contenido inválidos.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let body = {
            "title": "",
            "message": "",
            "authorId": userConnected._id.toString(),
            "workId": workCreated[0]._id.toString(),
            "creationDate": new Date(),
            "lastMessageDate": new Date(),
            "isFavorite": false,
            "interactions": []
        }
        const res = await request(app)
        .post("/api/posts/" + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(400);

    });

    it('Usuario perteneciente a trabajo académico visualiza la lista de temas del trabajo académico.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        const res = await request(app)
        .get("/api/posts/"+workCreated[0]._id.toString()+"/" + "asc"+ "/" + 1 + "/" + 1).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);

    });

    it('Usuario no perteneciente a trabajo académico visualiza la lista de temas del trabajo académico.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        const resLoginNoPerteneciente = await request(app).post('/api/login').send({ "email": "user4Test5@test.es", "password": "aaaaaaaaa" })
        let access_token_no_perteneciente = resLoginNoPerteneciente._body.token; //se inicia sesión con un usuario no perteneciente.
        const res = await request(app)
        .get("/api/posts/"+workCreated[0]._id.toString()+"/" + "asc"+ "/" + 1 + "/" + 1).set({ "access-token": access_token_no_perteneciente });
        expect(res.statusCode).toEqual(403);

    });

    it('Usuario perteneciente a trabajo académico filtra la lista de temas por “Más recientes primero”.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        const res = await request(app)
        .get("/api/posts/"+workCreated[0]._id.toString()+"/" + "asc"+ "/" + 1 + "/" + 1).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);

    });

    it('Usuario perteneciente a trabajo académico filtra la lista de temas por “Menos recientes primero”.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        const res = await request(app)
        .get("/api/posts/"+workCreated[0]._id.toString()+"/" + "desc"+ "/" + 1 + "/" + 1).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);

    });

    
    it('Usuario perteneciente a trabajo académico filtra la lista de temas por “Menos recientes primero”.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        const res = await request(app)
        .get("/api/posts/"+workCreated[0]._id.toString()+"/" + "favorites"+ "/" + 1 + "/" + 1).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);

    });

    it('Usuario no perteneciente a trabajo académico filtra la lista de temas por “Más recientes primero”.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        const resLoginNoPerteneciente = await request(app).post('/api/login').send({ "email": "user4Test5@test.es", "password": "aaaaaaaaa" })
        let access_token_no_perteneciente = resLoginNoPerteneciente._body.token; //se inicia sesión con un usuario no perteneciente.
        const res = await request(app)
        .get("/api/posts/"+workCreated[0]._id.toString()+"/" + "asc"+ "/" + 1 + "/" + 1).set({ "access-token": access_token_no_perteneciente });
        expect(res.statusCode).toEqual(403);

    });

    it('Usuario no perteneciente a trabajo académico elimina un tema.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        const resLoginNoPerteneciente = await request(app).post('/api/login').send({ "email": "user4Test5@test.es", "password": "aaaaaaaaa" })
        let access_token_no_perteneciente = resLoginNoPerteneciente._body.token; //se inicia sesión con un usuario no perteneciente.
        let postToDelete = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userConnected._id.toString()})

        const res = await request(app)
        .delete("/api/posts/"+postToDelete[0]._id.toString()).set({ "access-token": access_token_no_perteneciente });
        expect(res.statusCode).toEqual(403);

    });

    it('Usuario perteneciente a trabajo académico elimina un tema siendo el creador del tema.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let postToDelete = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userConnected._id.toString()})
        expect(postToDelete).not.ToBeNull;

        const res = await request(app)
        .delete("/api/posts/"+postToDelete[0]._id.toString()).set({ "access-token": access_token});

        expect(res.statusCode).toEqual(200);
        let postDeleted = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userConnected._id.toString()})
        expect(postDeleted).toBeNull;


    });

    it('Usuario perteneciente a trabajo académico con rol profesor siendo no propietario del trabajo elimina un tema.', async () => {
        const resLoginTeacher = await request(app).post('/api/login').send({ "email": "user4Test3@test.es", "password": "aaaaaaaaa" })
        let access_token_teacher = resLoginTeacher._body.token; //se inicia sesión con un usuario no perteneciente.
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
        const resCreationPost = await request(app)
        .post("/api/posts/" + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token });

        let postToDelete = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userConnected._id.toString()})
        expect(postToDelete).not.ToBeNull;

        const resDeletePost = await request(app)
        .delete("/api/posts/"+postToDelete[0]._id.toString()).set({ "access-token": access_token_teacher}); //el profesor es el que borra el post

        expect(resDeletePost.statusCode).toEqual(200);
        let postDeleted = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userConnected._id.toString()})
        expect(postDeleted).toBeNull;

    });

    
    it('Usuario perteneciente a trabajo académico con rol estudiante elimina tema no siendo el creador del tema.', async () => {
        const resLoginStudent = await request(app).post('/api/login').send({ "email": "user4Test4@test.es", "password": "aaaaaaaaa" })
        let access_token_student = resLoginStudent._body.token; //se inicia sesión con un usuario no perteneciente.
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
        const resCreationPost = await request(app)
        .post("/api/posts/" + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token });

        let postToDelete = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userConnected._id.toString()})
        expect(postToDelete).not.ToBeNull;

        const resDeletePost = await request(app)
        .delete("/api/posts/"+postToDelete[0]._id.toString()).set({ "access-token": access_token_student}); //el estudiante es el que borra el post

        expect(resDeletePost.statusCode).toEqual(403);

    });

    it('Usuario perteneciente a trabajo académico con rol estudiante elimina tema siendo el creador del tema.', async () => {
        const resLoginStudent = await request(app).post('/api/login').send({ "email": "user4Test4@test.es", "password": "aaaaaaaaa" })
        let access_token_student = resLoginStudent._body.token; //se inicia sesión con un usuario no perteneciente.
        let userStudent = await User.findOne({ "email": "user4Test4@test.es" });

        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })

        let body = {
            "title": "Test Title",
            "message": "test message",
            "authorId": userStudent._id.toString(),
            "workId": workCreated[0]._id.toString(),
            "creationDate": new Date(),
            "lastMessageDate": new Date(),
            "isFavorite": false,
            "interactions": []
        }
        const resCreationPost = await request(app)
        .post("/api/posts/" + workCreated[0]._id.toString()).send(body).set({ "access-token": access_token_student });

        let postToDelete = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userStudent._id.toString()})
        expect(postToDelete).not.ToBeNull;

        const resDeletePost = await request(app)
        .delete("/api/posts/"+postToDelete[0]._id.toString()).set({ "access-token": access_token_student}); //el estudiante es el que borra el post

        expect(resDeletePost.statusCode).toEqual(200);
        let postDeleted = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userStudent._id.toString()})
        expect(postDeleted).toBeNull;

    });



    it('Usuario no perteneciente a trabajo académico marca un tema como favorito.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        const resLoginNoPerteneciente = await request(app).post('/api/login').send({ "email": "user4Test5@test.es", "password": "aaaaaaaaa" })
        let access_token_no_perteneciente = resLoginNoPerteneciente._body.token; //se inicia sesión con un usuario no perteneciente.
        let postToBeFavorite = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userConnected._id.toString()})
        let body = {
            "id": postToBeFavorite[0]._id.toString(),
            "isFavorite": true
        }
        const res = await request(app)
        .put("/api/posts/markFavorite").send(body).set({ "access-token": access_token_no_perteneciente });
        expect(res.statusCode).toEqual(403);

    });

    it('Usuario perteneciente a trabajo académico marca un tema no favorito como favorito.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let postToBeFavorite = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userConnected._id.toString()})
        let body = {
            "id": postToBeFavorite[0]._id.toString(),
            "isFavorite": true
        }
        const res = await request(app)
        .put("/api/posts/markFavorite").send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);
        let postFavorited = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userConnected._id.toString()})
        expect(postToBeFavorite[0].isFavorite).toEqual(false);
        expect(postFavorited[0].isFavorite).toEqual(true);


    });

    it('Usuario perteneciente a trabajo académico marca un tema no favorito como favorito.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let postFavorite = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userConnected._id.toString()})
        let body = {
            "id": postFavorite[0]._id.toString(),
            "isFavorite": false
        }
        const res = await request(app)
        .put("/api/posts/markFavorite").send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);
        let postNotFavorite = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userConnected._id.toString()})
        expect(postFavorite[0].isFavorite).toEqual(true);
        expect(postNotFavorite[0].isFavorite).toEqual(false);


    });

    it('Usuario no perteneciente a trabajo académico crea respuesta a un tema con contenido válido.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        const resLoginNoPerteneciente = await request(app).post('/api/login').send({ "email": "user4Test5@test.es", "password": "aaaaaaaaa" })
        let access_token_no_perteneciente = resLoginNoPerteneciente._body.token; //se inicia sesión con un usuario no perteneciente.
        let userNoPerteneciente = await User.findOne({ "email": "user4Test5@test.es" });
        let postToBeCommented = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userConnected._id.toString()})
        
        let body = {
            "interaction" : {
                "message": "test interaction",
                "date": new Date(),
                "authorId": userNoPerteneciente._id.toString(),
                "authorFullName": "user4Test2"
            }
       
        }
        const res = await request(app)
        .put("/api/posts/newInteraction/"+postToBeCommented[0]._id.toString()).send(body).set({ "access-token": access_token_no_perteneciente });
        expect(res.statusCode).toEqual(403);

    });


    it('Usuario perteneciente a trabajo académico crea respuesta a un tema con contenido válido.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let postToBeCommented = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userConnected._id.toString()})
        
        let body = {
            "interaction" : {
                "message": "test interaction",
                "date": new Date(),
                "authorId": userConnected._id.toString(),
                "authorFullName": "user4Test2"
            }
       
        }
        const res = await request(app)
        .put("/api/posts/newInteraction/"+postToBeCommented[0]._id.toString()).send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);

    });


    it('Usuario perteneciente a trabajo académico crea respuesta a un tema con contenido inválido.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let postToBeCommented = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userConnected._id.toString()})
        
        let body = {
            "interaction" : {
                "message": "",
                "date": new Date(),
                "authorId": userConnected._id.toString(),
                "authorFullName": "user4Test2"
            }
       
        }
        const res = await request(app)
        .put("/api/posts/newInteraction/"+postToBeCommented[0]._id.toString()).send(body).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(400);

    });


    it('Usuario no perteneciente a trabajo académico elimina respuesta creada por el propio usuario a un tema.', async () => {
        const resLoginNoPerteneciente = await request(app).post('/api/login').send({ "email": "user4Test5@test.es", "password": "aaaaaaaaa" })
        let access_token_no_perteneciente = resLoginNoPerteneciente._body.token; //se inicia sesión con un usuario no perteneciente.
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let post = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userConnected._id.toString()})
        let interaction = await PostInteraction.findById(post[0].interactions[0].toString())
        const res = await request(app)
        .delete("/api/posts/interaction/" + interaction._id.toString() + "/" + post[0]._id.toString()).set({ "access-token": access_token_no_perteneciente });
        expect(res.statusCode).toEqual(403);

    });

    it('Usuario perteneciente a trabajo académico elimina respuesta creada por el propio usuario a un tema.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let post = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userConnected._id.toString()})
        let interaction = await PostInteraction.findById(post[0].interactions[0].toString())
        const res = await request(app)
        .delete("/api/posts/interaction/" + interaction._id.toString() + "/" + post[0]._id.toString()).set({ "access-token": access_token });
        expect(res.statusCode).toEqual(200);

    });

    it('Usuario perteneciente a trabajo académico con rol profesor elimina respuesta creada por otro usuario a un tema.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let post = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userConnected._id.toString()})
        let body = {
            "interaction" : {
                "message": "Test interaction",
                "date": new Date(),
                "authorId": userConnected._id.toString(),
                "authorFullName": "user4Test2"
            }
        }
        const resCreateInteraction = await request(app)
        .put("/api/posts/newInteraction/"+post[0]._id.toString()).send(body).set({ "access-token": access_token });

        post = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userConnected._id.toString()}) // se recarga el post con la nueva interacción creada.

        let interaction = await PostInteraction.findById(post[0].interactions[0].toString())
        const resLoginTeacher = await request(app).post('/api/login').send({ "email": "user4Test3@test.es", "password": "aaaaaaaaa" })
        let access_token_teacher = resLoginTeacher._body.token; //se inicia sesión con un usuario no perteneciente.
        const res = await request(app)
        .delete("/api/posts/interaction/" + interaction._id.toString() + "/" + post[0]._id.toString()).set({ "access-token": access_token_teacher });
        expect(res.statusCode).toEqual(200);
        let interactionDeleted = await PostInteraction.findById(post[0].interactions[0].toString())
        expect(interaction).not.toBeNull;
        expect(interactionDeleted).toBeNull;

    });


    it('Usuario perteneciente a trabajo académico con rol estudiante elimina respuesta creada por otro él mismo a un tema.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        const resLoginStudent = await request(app).post('/api/login').send({ "email": "user4Test4@test.es", "password": "aaaaaaaaa" })
        let access_token_student = resLoginStudent._body.token; 
        let userStudent = await User.findOne({ "email": "user4Test4@test.es" });

        let post = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userConnected._id.toString()})
        let body = {
            "interaction" : {
                "message": "Test interaction",
                "date": new Date(),
                "authorId": userStudent._id.toString(),
                "authorFullName": "user4Test2"
            }
        }
        const resCreateInteraction = await request(app)
        .put("/api/posts/newInteraction/"+post[0]._id.toString()).send(body).set({ "access-token": access_token_student  });

        post = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userConnected._id.toString()}) // se recarga el post con la nueva interacción creada.

        let interaction = await PostInteraction.findById(post[0].interactions[0].toString())

        const res = await request(app)
        .delete("/api/posts/interaction/" + interaction._id.toString() + "/" + post[0]._id.toString()).set({ "access-token": access_token_student });
        expect(res.statusCode).toEqual(200);
        let interactionDeleted = await PostInteraction.findById(post[0].interactions[0].toString())
        expect(interaction).not.toBeNull;
        expect(interactionDeleted).toBeNull;

    });


    it('Usuario perteneciente a trabajo académico con rol estudiante elimina respuesta creada por otro usuario a un tema.', async () => {
        let workCreated = await Work.find({ "authorId": userConnected._id.toString() })
        let post = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userConnected._id.toString()})
        let body = {
            "interaction" : {
                "message": "Test interaction",
                "date": new Date(),
                "authorId": userConnected._id.toString(),
                "authorFullName": "user4Test2"
            }
        }
        const resCreateInteraction = await request(app)
        .put("/api/posts/newInteraction/"+post[0]._id.toString()).send(body).set({ "access-token": access_token });

        post = await Post.find({ "workId": workCreated[0]._id.toString(), "authorId": userConnected._id.toString()}) // se recarga el post con la nueva interacción creada.

        let interaction = await PostInteraction.findById(post[0].interactions[0].toString())
        const resLoginStudent = await request(app).post('/api/login').send({ "email": "user4Test4@test.es", "password": "aaaaaaaaa" })
        let access_token_student = resLoginStudent._body.token; //se inicia sesión con un usuario no perteneciente.
        const res = await request(app)
        .delete("/api/posts/interaction/" + interaction._id.toString() + "/" + post[0]._id.toString()).set({ "access-token": access_token_student });
        expect(res.statusCode).toEqual(403);
    });
});
