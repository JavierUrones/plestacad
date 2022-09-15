
let io;

exports.socketConnection = (server) => {
  io = require('socket.io')(server, {   cors: {
    origins: '*:*',
  }});

  var usersOnline = new Map();
  var usersOnlineBusy = new Map();


  io.on('connection', (socket) => {
    console.info(`Client connected [id=${socket.id}]`);

    //console.info(req.session.email)
    socket.join(socket.request._query.id);

    socket.on('login', (userId)=>{

      //usersOnline[socket.id] = userId;
      usersOnline.set(socket.id, userId)
      io.emit('users-online', Array.from(usersOnline));
      //io.emit('users-busy', Array.from(usersOnlineBusy));

    });



    socket.on('disconnect', () => {
      console.info(`Client disconnected [id=${socket.id}]`);
      usersOnline.delete(socket.id);
      usersOnlineBusy.delete(socket.id)
      io.emit('users-online', Array.from(usersOnline));

    });

    socket.on('videocall-request' , (message) =>{
      console.log("llega peticion al servidor", message);
      console.log("llega peticion al servidor", usersOnline.get(socket.id));
      usersOnlineBusy.set(socket.id, usersOnline.get(socket.id))
      //io.emit('users-busy', Array.from(usersOnlineBusy));

      io.emit('videocall-request', message)
  
    })

    socket.on("end-videocall", (message) =>{
      //terminar llamada entre los dos usuarios.
      console.log("end-videocall", usersOnline)
      //usersOnlineBusy.delete(socket.id)
      io.emit('end-videocall', message)

    })



    socket.on('join', (data) => {
      console.log("join to room, llega", data)
      //const roomName = data.roomName;

      //socket.join(roomName);
      io.emit('new-user', data)
    });
  });




};

exports.sendNewWorkRequestNotification = (message) => io.emit('workRequest', message);

exports.sendNewNotification = (message) => io.emit('notification', message)

//exports.sendVideocallRequest = (message) => io.emit('videocall-request', message);

