mongoose = require("mongoose")
async function initializeMongoose() {

}

module.exports.initializeMongoose = async () => {
  const conn = await mongoose.connect("mongodb://localhost/Api-Plestacad");
  return conn.connection;
};
