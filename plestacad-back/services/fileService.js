/** Servicio encargado de gestionar los archivos de un trabajo académico.
 * @module services/fileService
 */

/**
 * Módulo fs (file system).
 * @type {object}
 * @const
 */
const fs = require("fs");
/**
 * Servicio de notificaciones.
 * @type {object}
 * @const
 */
const notificationService = require("../services/notificationService");

/**
 * Módulo rimraf
 * @type {object}
 * @const
 */
const rimraf = require("rimraf");


/**
 * Crea un nuevo directorio.
 * @param {string} path - path del directorio a crear.
 * @param {string} userIdResponsible - id del usuario responsable de borrar el evento.
 * @param {boolean} initialDirectory - flag que indica si se debe generar una notificación o no.
 * @returns {string} "Ok" - Si el directorio se crea correctamente.
 * @returns {string} "Error" - Si el directorio no se crea.
 */
  async function createDirectory(path, userIdResponsible, initialDirectory) {

    try {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
        var nameDirectory = path.split("/")[path.split("/").length - 1];
        var workId = path.split("/")[2];
        if (!initialDirectory)
          notificationService.createNewNotification(workId, "new-directory", userIdResponsible, nameDirectory);
        return "Ok";
      } else {
        return "Error";
      }
    } catch (error) {
      throw error;
    }

  }

  /**
 * Crea un nuevo archivo en el directorio indicado.
 * @param {string} path - path del archivo a crear.
 * @param {string} uploadDirectory - path del directorio dónde se almacenará el archivo.
 * @param {string} userIdResponsible - id del usuario responsable de borrar el evento.
 */
  function createFile(path, uploadDirectory, userIdResponsible) {
    try {

      fs.renameSync(path, uploadDirectory);
      var nameFile = uploadDirectory.split("/")[uploadDirectory.split("/").length - 1];
      var workId = uploadDirectory.split("/")[2];
      notificationService.createNewNotification(workId, "new-file", userIdResponsible, nameFile);

    }
    catch (error) {
      throw error;
    }
  }

/**
 * Borra un nuevo directorio.
 * @param {string} path - path del directorio a borrar.
 * @param {string} workId - id del trabajo académico..
 * @param {string} userIdResponsible - id del usuario responsable de borrar el evento.
 * @param {boolean} initialDirectory - flag que indica si se debe generar una notificación o no.
 * @returns {string} "directory-deleted" - Si el directorio se borra correctamente.
 * @returns {string} "directory-not-empty" - Si el directorio no se puede borrar.
 */
  function deleteDirectory(path, workId, userIdResponsible, initialDirectory) {
    try {
      fs.rmdirSync(path)
      var nameDirectory = path.split("/")[path.split("/").length - 1];
      if (!initialDirectory)
        notificationService.createNewNotification(workId, "delete-directory", userIdResponsible, nameDirectory);
      return "directory-deleted"
    } catch(error){
      return "directory-not-empty";
    }
  }

/**
 * Borra un directorio raíz.
 * @param {string} path - path del directorio raíz a borrar.
 */
  function deleteWorkDirectory(path) {
    rimraf.sync(path);
  }

  /**
 * Borra un archivo.
 * @param {string} path - path del directorio a borrar.
 * @param {string} workId - id del trabajo académico..
 * @param {string} userIdResponsible - id del usuario responsable de borrar el evento.
 * @returns {string} "error-file" - Si el archivo se borra correctamente.
 * @returns {string} "file-deleted" - Si el archivo no se puede borrar.
 */
  function deleteFile(path, workId, userIdResponsible) {
    fs.unlink(path, function (err) {
      if (err) {

        return "error-file"
      } else {
        var nameFile = path.split("/")[path.split("/").length - 1];
        notificationService.createNewNotification(workId, "delete-file", userIdResponsible, nameFile);
        return "file-deleted"

      }

    });
  }



module.exports = {createFile, deleteDirectory, createDirectory, deleteFile, deleteWorkDirectory};