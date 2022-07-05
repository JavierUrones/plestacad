module.exports = {
  key: "mysecretkey",
  user_mongodb_compass: "javier",
  password_mongodb_compass: "1806"
};

const configCORS = {
  application: {
    cors: {
      server: [
        {
          origin: "*",
          credentials: true,
          methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
          allowedHeaders: ['Content-Type', 'Authorization'],
          
        },
      ],
    },
  },
};

module.exports.configCORS = configCORS;
