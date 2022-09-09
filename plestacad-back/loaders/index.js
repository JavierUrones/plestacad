const mongooseLoader = require("./loaderMongoose");
const expressLoader = require("./loaderExpress");

async function initialize(app) {
  const mongoConnection = await mongooseLoader.initializeMongoose();
  console.log('MongoDB Initialized');

  await expressLoader.initializeExpress(app);
  console.log('Express Initialized');

}
module.exports.initialize = async (app, server) =>  {

  const mongoConnection = await mongooseLoader.initializeMongoose();
  console.log('MongoDB Initialized');

  await expressLoader.initializeExpress(app);
  console.log('Express Initialized');

};

