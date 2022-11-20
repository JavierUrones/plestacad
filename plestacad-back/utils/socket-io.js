/** Módulo encargado de la gestión de los sockets.
 * @module utils/socket-io
 */
/**
 * Módulo io para la gestión de los sockets
 */
let io;

/** Establece el servidor de sockets e inicializa la conexión */
exports.socketConnection = (server) => {
  /** Inicializa el módulo io */
  io = require('socket.io')(server, {
    cors: {
      origins: '*:*',
    }
  });

  /** Contiene los usuarios que se encuentran en línea en el sistema. */
  var usersOnline = new Map();


  /** Establece el comportamiento cuando un usuario se conecta al sistema. */
  io.on('connection', (socket) => {
    console.info(`Client connected [id=${socket.id}]`);
    socket.join(socket.request._query.id);
    socket.on('login', (userId) => {
      usersOnline.set(socket.id, userId)
      io.emit('users-online', Array.from(usersOnline));

    });


    /** Establece el comportamiento cuando un usuario se desconecta del sistema. */
    socket.on('disconnect', () => {
      console.info(`Client disconnected [id=${socket.id}]`);
      usersOnline.delete(socket.id);
      io.emit('users-online', Array.from(usersOnline));

    });

    /** Establece el comportamiento cuado un usuario inicializa una videollamada. */
    socket.on('videocall-request', (message) => {
      io.emit('videocall-request', message)

    })

    /** Establece el comportamiento cuando un usuario finaliza una videollamada. */
    socket.on("end-videocall", (message) => {
      io.emit('end-videocall', message)

    })


  });




};

/** Envia el socket cuando se produce una nueva solicitud de incorporación a trabajo académico. */
exports.sendNewWorkRequestNotification = (message) => io.emit('workRequest', message);

/** Envia el socket cuando se produce una notificación. */
exports.sendNewNotification = (message) => io.emit('notification', message)

