mongoose = require("mongoose")
config = require("../config/index");

async function initializeMongoose() {

}

module.exports.initializeMongoose = async () => {
  //const conn = await mongoose.connect("mongodb://mongo/Api-Plestacad");
  //const conn = await mongoose.connect("mongodb://localhost:27017/Api-Plestacad");
  var username = config.user_mongodb_compass;
  var pass = config.password_mongodb_compass;
  const conn = await mongoose.connect("mongodb+srv://" +  username +":" + pass +"@plestacad-cluster.6f4o3of.mongodb.net/?retryWrites=true&w=majority");

 
  return conn.connection;
};
