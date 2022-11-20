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
describe(' Pruebas unitarias trabajos académicos ', () => {
  it('debería registrar un usuario', async () => {
    const res = await request(app)
      .post('/api/signup').send({ "name": "user4Test", "surname": "user4Test", "email": "plestacad@hotmail.com", "password": "aaaaaaaaa" });
    expect(res.statusCode).toEqual(200);
    userConnected = await User.findOne({ 'email': "plestacad@hotmail.com" });
    expect(userConnected).not.toBeUndefined();
    const res2 = await request(app)
      .get('/api/verify/' + userConnected.verifyToken);
    expect(res2.statusCode).toEqual(302); //cuando se verifica un usuario redirige al login.
  })

  it('debería iniciar sesión', async () => {
    const res = await request(app)
      .post('/api/login').send({ "email": "plestacad@hotmail.com", "password": "aaaaaaaaa" })
    access_token = res._body.token;
    expect(res.statusCode).toEqual(200);
    expect(res._body.token).not.toBeUndefined();
  })

  it('Crear trabajo académico con datos obligatorios válidos: título, descripción, curso, categoría sin invitar a ningún profesor ni estudiante.', async () => {
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
      const res = await request(app)
        .post('/api/works').send(newWork).set({ "access-token": access_token })
      expect(res.statusCode).toEqual(200);
  })

  it('Crear trabajo académico con datos obligatorios inválidos sin invitar a ningún profesor ni estudiante.', async () => {
    const newWork = {
      title: "",
      authorId: userConnected._id.toString(),
      teachersInvited: [],
      studentsInvited: [],
      teachers: [userConnected._id.toString()],
      category: "",
      description: "",
      course: 2022
    }
    const res = await request(app)
      .post('/api/works').send(newWork).set({ "access-token": access_token })
    expect(res.statusCode).toEqual(400);
  })

  it('Crear trabajo académico con datos obligatorios válidos: título, descripción, curso, categoría invitando profesores y estudiantes.', async () => {
    let userInvited = await User.findOne({ "email": "user4Test2@test.es" });
    const newWork = {
      title: "Test",
      authorId: userConnected._id.toString(),
      teachersInvited: ["user4Test2@test.es"],
      studentsInvited: [],
      teachers: [userConnected._id.toString()],
      category: "tfg",
      description: "test description",
      course: 2022
    }
    const res = await request(app)
      .post('/api/works').send(newWork).set({ "access-token": access_token })
    let workRequest = await WorkRequest.find({ 'userIdReceiver': userInvited._id });
    expect(workRequest).not.toBeUndefined();
    expect(res.statusCode).toEqual(200);
  })

  it('Usuario propietario de un trabajo académico modifica los datos del trabajo por unos válidos.', async () => {
    let work = await Work.findOne({ 'authorId': userConnected._id.toString() });
    let body = {
      'workId': work._id,
      'category': 'tfm',
      'course': 2025,
      'description': 'nueva descripcion',
      'title': 'Nuevo Titulo'
    }
    const res = await request(app)
      .put('/api/works').send(body).set({ "access-token": access_token })
    expect(res.statusCode).toEqual(200);
    work = await Work.findOne({ 'authorId': userConnected._id.toString() });
    expect(work.title).toEqual('Nuevo Titulo');
    expect(work.description).toEqual('nueva descripcion');
    expect(work.course).toEqual(2025);
    expect(work.category).toEqual('tfm');
  })

  it('Usuario propietario de un trabajo académico modifica los datos del trabajo por unos inválidos.', async () => {
    let work = await Work.findOne({ 'authorId': userConnected._id.toString() });
    let body = {
      'workId': work._id,
      'category': '',
      'course': '',
      'description': '',
      'title': ''
    }
    const res = await request(app)
      .put('/api/works').send(body).set({ "access-token": access_token })
    expect(res.statusCode).toEqual(400);
    work = await Work.findOne({ 'authorId': userConnected._id.toString() });
    // se comprueba que los datos no han cambiado
    expect(work.title).toEqual('Nuevo Titulo');
    expect(work.description).toEqual('nueva descripcion');
    expect(work.course).toEqual(2025);
    expect(work.category).toEqual('tfm');
  })

  it('Usuario no propietario de un trabajo académico modifica los datos del trabajo por unos válidos.', async () => {
    var resLogin = await request(app)
      .post('/api/login').send({ "email": "user4Test2@test.es", "password": "aaaaaaaaa" })
    var access_token_no_propietario = resLogin._body.token;
    let work = await Work.findOne({ 'authorId': userConnected._id.toString() });
    let body = {
      'workId': work._id,
      'category': 'tfm',
      'course': 2025,
      'description': 'nueva descripcion',
      'title': 'Nuevo Titulo'
    }
    const res = await request(app)
      .put('/api/works').send(body).set({ "access-token": access_token_no_propietario }) //se pasa el token de usuario no propietario.
    expect(res.statusCode).toEqual(403);
  })

  it('Usuario propietario de un trabajo académico modifica los datos de un trabajo invitando a nuevo estudiante.', async () => {
    let work = await Work.findOne({ 'authorId': userConnected._id.toString() });
    let body = {
      'userIdResponsible': userConnected._id.toString(),
      'teachers': [],
      'students': ['user4Test3@test.es'],
      'workId': work._id
    }
    var workRequestsPre = await WorkRequest.find({})
    const res = await request(app)
      .post('/api/workRequests').send(body).set({ "access-token": access_token })
    expect(res.statusCode).toEqual(200);
    var workRequestsPost = await WorkRequest.find({})
    expect(workRequestsPost.length).toBeGreaterThan(workRequestsPre.length);
  })

  it('Usuario propietario de un trabajo académico modifica los datos de un trabajo invitando a nuevo profesor.', async () => {
    let work = await Work.findOne({ 'authorId': userConnected._id.toString() });
    let body = {
      'userIdResponsible': userConnected._id.toString(),
      'teachers': ['user4Test4@test.es'],
      'students': [],
      'workId': work._id
    }
    var workRequestsPre = await WorkRequest.find({})
    const res = await request(app)
      .post('/api/workRequests').send(body).set({ "access-token": access_token })
    expect(res.statusCode).toEqual(200);
    var workRequestsPost = await WorkRequest.find({})
    expect(workRequestsPost.length).toBeGreaterThan(workRequestsPre.length);
  })

  it('El usuario acepta una solicitud de trabajo académico con rol estudiante', async () => {
    var resLogin = await request(app)
      .post('/api/login').send({ "email": "user4Test3@test.es", "password": "aaaaaaaaa" })
    var access_token_role_estudiante = resLogin._body.token;
    let userLogged = await User.findOne({ "email": "user4Test3@test.es" });

    let workRequest = await WorkRequest.findOne({ 'userIdReceiver': userLogged._id.toString(), 'role': 'student' });
    let body = {
      "userIdReceiver": userLogged._id.toString(),
      "role": workRequest.role,
      "workId": workRequest.workId,
      "id": workRequest._id
    }
    var workRequestsPre = await WorkRequest.find({})
    const res = await request(app)
      .post('/api/worksRequests/accept').send(body).set({ "access-token": access_token_role_estudiante })
    expect(res.statusCode).toEqual(200);
    var workRequestsPost = await WorkRequest.find({})
    expect(workRequestsPost.length).toBeLessThan(workRequestsPre.length); //hay una solicitud menos
    let work = await Work.findById(workRequest.workId);
    expect(work.students[work.students.length - 1].toString()).toEqual(userLogged._id.toString()); // se comprueba que está contenido en la lista de estudiantes tras aceptar la solicitud
  })

  it('El usuario acepta una solicitud de trabajo académico con rol profesor', async () => {
    var resLogin = await request(app)
      .post('/api/login').send({ "email": "user4Test4@test.es", "password": "aaaaaaaaa" })
    var access_token_role_teacher = resLogin._body.token;
    let userLogged = await User.findOne({ "email": "user4Test4@test.es" });

    let workRequest = await WorkRequest.findOne({ 'userIdReceiver': userLogged._id.toString(), 'role': 'teacher' });
    let body = {
      "userIdReceiver": userLogged._id.toString(),
      "role": workRequest.role,
      "workId": workRequest.workId,
      "id": workRequest._id
    }
    var workRequestsPre = await WorkRequest.find({})
    const res = await request(app)
      .post('/api/worksRequests/accept').send(body).set({ "access-token": access_token_role_teacher })
    expect(res.statusCode).toEqual(200);
    var workRequestsPost = await WorkRequest.find({})
    expect(workRequestsPost.length).toBeLessThan(workRequestsPre.length); //hay una solicitud menos
    let work = await Work.findById(workRequest.workId);
    expect(work.teachers[work.teachers.length - 1].toString()).toEqual(userLogged._id.toString()); // se comprueba que está contenido en la lista de profesores en último lugar tras aceptar la solicitud
  })

  it('Usuario no propietario con rol profesor modifica un trabajo académico eliminando a un usuario de la lista de estudiantes.', async () => {
    var resLogin = await request(app)
      .post('/api/login').send({ "email": "user4Test4@test.es", "password": "aaaaaaaaa" })
    var access_token_role_teacher = resLogin._body.token;
    let userToRemove = await User.findOne({ "email": "user4Test3@test.es" });
    let work = await Work.findOne({ 'authorId': userConnected._id.toString() });

    let body = {
      "userId": userToRemove._id.toString(),
      "workId": work._id.toString(),
      "type": "student"
    }
    const res = await request(app)
      .put('/api/works/deleteUser').send(body).set({ "access-token": access_token_role_teacher })
    expect(res.statusCode).toEqual(403);
  })

  it('Usuario no propietario con rol estudiante modifica un trabajo académico eliminando a un usuario de la lista de estudiantes.', async () => {
    var resLogin = await request(app)
      .post('/api/login').send({ "email": "user4Test3@test.es", "password": "aaaaaaaaa" })
    var access_token_role_student = resLogin._body.token;
    let userToRemove = await User.findOne({ "email": "user4Test4@test.es" });
    let work = await Work.findOne({ 'authorId': userConnected._id.toString() });

    let body = {
      "userId": userToRemove._id.toString(),
      "workId": work._id.toString(),
      "type": "student"
    }
    const res = await request(app)
      .put('/api/works/deleteUser').send(body).set({ "access-token": access_token_role_student })
    expect(res.statusCode).toEqual(403);
  })


  it('Usuario no propietario de un trabajo académico lo archiva.', async () => {
    var resLogin = await request(app)
      .post('/api/login').send({ "email": "user4Test2@test.es", "password": "aaaaaaaaa" })
    var access_token_no_propietario = resLogin._body.token;
    let work = await Work.findOne({ 'authorId': userConnected._id.toString() }); //trabajo del cual no es propietario.
    var body = {
      'workId': work._id,
      'classified': true,
      'category': work.category,
      'course': work.course,
      'description': work.description,
      'title': work.title
    }
    const res = await request(app)
      .put('/api/works').send(body).set({ "access-token": access_token_no_propietario }) // se usa el token del no propietario.
    expect(res.statusCode).toEqual(403);
    work = await Work.findOne({ 'authorId': userConnected._id.toString() });
    expect(work.classified).toEqual(false); //no cambia el estado del trabajo.

  })

  it('Usuario propietario de un trabajo académico lo archiva.', async () => {
    let work = await Work.findOne({ 'authorId': userConnected._id.toString() });
    var body = {
      'workId': work._id,
      'classified': true,
      'category': work.category,
      'course': work.course,
      'description': work.description,
      'title': work.title
    }
    const res = await request(app)
      .put('/api/works').send(body).set({ "access-token": access_token })
    expect(res.statusCode).toEqual(200);
    work = await Work.findOne({ 'authorId': userConnected._id.toString() });
    expect(work.classified).toEqual(true);

  })

  it('Usuario no propietario de un trabajo académico lo desarchiva.', async () => {
    var resLogin = await request(app)
      .post('/api/login').send({ "email": "user4Test2@test.es", "password": "aaaaaaaaa" })
    var access_token_no_propietario = resLogin._body.token;
    let work = await Work.findOne({ 'authorId': userConnected._id.toString() }); //trabajo del cual no es propietario.
    var body = {
      'workId': work._id,
      'classified': false,
      'category': work.category,
      'course': work.course,
      'description': work.description,
      'title': work.title
    }
    const res = await request(app)
      .put('/api/works').send(body).set({ "access-token": access_token_no_propietario }) // se usa el token del no propietario.
    expect(res.statusCode).toEqual(403);
    work = await Work.findOne({ 'authorId': userConnected._id.toString() });
    expect(work.classified).toEqual(true); //no cambia el estado del trabajo.

  })



  it('Usuario propietario de un trabajo académico lo desarchiva.', async () => {
    let work = await Work.findOne({ 'authorId': userConnected._id.toString() });
    var body = {
      'workId': work._id,
      'classified': false,
      'category': work.category,
      'course': work.course,
      'description': work.description,
      'title': work.title
    }
    const res = await request(app)
      .put('/api/works').send(body).set({ "access-token": access_token })
    expect(res.statusCode).toEqual(200);
    work = await Work.findOne({ 'authorId': userConnected._id.toString() });
    expect(work.classified).toEqual(false);

  })


  it('Usuario visualiza su lista de trabajos académicos.', async () => {
    const res = await request(app)
      .post('/api/worksByUser').send({ "id": userConnected._id.toString() }).set({ "access-token": access_token })
    expect(res.text).not.toBeUndefined();
    expect(res.statusCode).toEqual(200);
  })

  it('Filtrar por Trabajos Fin de Grado', async () => {
    const res = await request(app)
      .post('/api/worksByUserIdAndCategory').send({ "id": userConnected._id.toString(), "category": "tfg" }).set({ "access-token": access_token })
    expect(res.text).not.toBeUndefined();
    expect(res.statusCode).toEqual(200);
  })

  it('Filtrar por Trabajos Fin de Master', async () => {
    const res = await request(app)
      .post('/api/worksByUserIdAndCategory').send({ "id": userConnected._id.toString(), "category": "tfm" }).set({ "access-token": access_token })
    expect(res.statusCode).toEqual(200);
  })

  it('Filtrar por Tesis Doctorales', async () => {
    const res = await request(app)
      .post('/api/worksByUserIdAndCategory').send({ "id": userConnected._id.toString(), "category": "tesis" }).set({ "access-token": access_token })
    expect(res.statusCode).toEqual(200);
  })

  it('Filtrar todos los trabajos académicos', async () => {
    const res = await request(app)
      .post('/api/worksByUser').send({ "id": userConnected._id.toString() }).set({ "access-token": access_token })
    expect(res.text).not.toBeUndefined();
    expect(res.statusCode).toEqual(200);
  })


  
  it('Usuario no propietario de un trabajo académico lo elimina.', async () => {
    var resLogin = await request(app)
      .post('/api/login').send({ "email": "user4Test2@test.es", "password": "aaaaaaaaa" })
    var access_token_no_propietario = resLogin._body.token;

    let work = await Work.findOne({ 'authorId': userConnected._id.toString() });
    const res = await request(app)
      .delete('/api/works/'+work._id).set({ "access-token": access_token_no_propietario })
    expect(res.statusCode).toEqual(403);
  })

  it('Usuario propietario de un trabajo académico lo elimina.', async () => {
    let workBeforeDelete = await Work.findOne({ 'authorId': userConnected._id.toString() });
    const res = await request(app)
      .delete('/api/works/'+workBeforeDelete._id).set({ "access-token": access_token })
    expect(res.statusCode).toEqual(200);
    let workAfterDelete = await Work.findById(workBeforeDelete._id);
    expect(workBeforeDelete).not.toBeNull(); //el trabajo antes de borrar existía.
    expect(workAfterDelete).toBeNull(); //después de borrar el trabajo, es null.

  })








})
