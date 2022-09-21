
let io;

exports.socketConnection = (server) => {
  io = require('socket.io')(server, {   cors: {
    origins: '*:*',
  }});

  var usersOnline = new Map();


  io.on('connection', (socket) => {
    console.info(`Client connected [id=${socket.id}]`);
    socket.join(socket.request._query.id);
    socket.on('login', (userId)=>{
      usersOnline.set(socket.id, userId)
      io.emit('users-online', Array.from(usersOnline));

    });



    socket.on('disconnect', () => {
      console.info(`Client disconnected [id=${socket.id}]`);
      usersOnline.delete(socket.id);
      io.emit('users-online', Array.from(usersOnline));

    });

    socket.on('videocall-request' , (message) =>{
      console.log("message videocall request", message)
      io.emit('videocall-request', message)
  
    })

    socket.on("end-videocall", (message) =>{
      io.emit('end-videocall', message)

    })


  });




};

exports.sendNewWorkRequestNotification = (message) => io.emit('workRequest', message);

exports.sendNewNotification = (message) => io.emit('notification', message)

