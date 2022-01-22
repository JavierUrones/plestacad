module.exports = {
    key: "mysecretkey"
}


const configCORS = {
    application: {
      cors: {
        server: [
          {
            origin: "*",
            credentials: true,
          },
        ],
      },
    },
  };

  module.exports.configCORS = configCORS;