
const fs = require("fs");


class FileService {

    
  async createDirectory(path) {

    console.log("PATH EXISTE? ", path)
    if (!fs.existsSync(path)){

        fs.mkdirSync(path);
        return "Ok";
    } else{
        return "Error";
    }
  }

}


module.exports = FileService;