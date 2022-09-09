
let io;

exports.socketConnection = (server) => {
  io = require('socket.io')(server, {   cors: {
    origin: '*',
  }});

  io.on('connection', (socket) => {
    console.info(`Client connected [id=${socket.id}]`);

    //console.info(req.session.email)
    socket.join(socket.request._query.id);



    socket.on('disconnect', () => {
      console.info(`Client disconnected [id=${socket.id}]`);
    });

    socket.on('videocall-request' , (message) =>{
      console.log("llega peticion al servidor", message);
      io.emit('videocall-request', message)
  
    })
  });




};

exports.sendNewWorkRequestNotification = (message) => io.emit('workRequest', message);

exports.sendNewNotification = (message) => io.emit('notification', message)

exports.sendVideocallRequest = (message) => io.emit('videocall-request', message);