
const fs = require("fs");

const NotificationService = require("../services/notificationService");
const notificationService = new NotificationService();
class FileService {


  async createDirectory(path, userIdResponsible, initialDirectory) {

    if (!fs.existsSync(path)) {

      fs.mkdirSync(path);
      var nameDirectory = path.split("/")[path.split("/").length-1];
      var workId = path.split("/")[2];
      if(!initialDirectory)
        notificationService.createNewNotification(workId, "new-directory", userIdResponsible, nameDirectory);
      return "Ok";
    } else {
      return "Error";
    }
  }

  createFile(path, uploadDirectory, userIdResponsible) {
    try {

      fs.renameSync(path, uploadDirectory);
      var nameFile = uploadDirectory.split("/")[uploadDirectory.split("/").length-1];
      var workId = uploadDirectory.split("/")[2];
      notificationService.createNewNotification(workId, "new-file", userIdResponsible, nameFile);

    }
    catch (error) {
      throw error;
    }
  }


  deleteDirectory(path, workId, userIdResponsible) {
    fs.rmdir(path, function (err) {
      if (err) {
        return "directory-not-empty"
      } else{
        var nameDirectory = path.split("/")[path.split("/").length-1];
        notificationService.createNewNotification(workId, "delete-directory", userIdResponsible, nameDirectory);

        return "directory-deleted"
      }
    })
  }

  deleteFile(path, workId, userIdResponsible){
    fs.unlink(path, function (err) {
      if (err) {

        return "error-file"
      } else{
        var nameFile = path.split("/")[path.split("/").length-1];
        notificationService.createNewNotification(workId, "delete-file", userIdResponsible, nameFile);
        return "file-deleted"

      }

    });
  }

}


module.exports = FileService;