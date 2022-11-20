/** Router express que define las rutas relacionadas con la gestión de los archivos..
 * @module routes/files
 * @requires express
 */
/**
 * Router express.
 * @type {object}
 * @const
 */
const router = require("express").Router();
/**
 * Modulo fs (file system)
 * @type {object}
 * @const
 */
const fs = require("fs");
/**
 * Módulo formidable.
 * @type {object}
 * @const
 */
const formidable = require("formidable");
/**
 * Directorio por defecto de almacenamiento de los archivos.
 * @type {string}
 * @const
 */
const directoryFiles = "/userdata/";
/**
 * Módulo path.
 * @type {object}
 * @const
 */
const path = require("path");
/**
 * Módulo fast-folder-size/sync.
 * @type {object}
 * @const
 */
const fastFolderSizeSync = require('fast-folder-size/sync')
/**
 * Middleware para comprobar la autenticación de usuarios.
 * @type {object}
 * @const
 */
const auth = require("../middleware/authMiddleware");

/**
 * File service
 * @type {object}
 * @const
 */
const fileService = require("../../services/fileService");
/**
 * Work service
 * @type {object}
 * @const
 */
const workService = require("../../services/workService");

/**
 * Token utils
 * @type {object}
 * @const
 */
const { getUserIdFromTokenRequest, checkUserInWork, checkIsAdmin} = require('../../utils/token');

/**
 * Directorio raíz del proyecto.
 * @type {object}
 * @const
 */
const rootProjectPath = require("path").resolve("./");

/**
 * Obtiene recursivamente todos los archivos del directorio especificado.
 * @param {string} id - id del trabajo académico.
 * @param {string} filesDirectory - directorio a recorrer.
 * @param {string[]} listPathsFile - lista con los paths de los elementos hijos del directorio.
 * @returns {string[]} - Retorna la lista de los paths de los elementos hijos del directorio.
 */
getFilesFromDirectory = function (id, filesDirectory, listPathsFile) {
  files = fs.readdirSync(filesDirectory);
  listPathsFile = listPathsFile || [];

  files.forEach(function (file) {
    var stats = fs.statSync(filesDirectory + file);
    if (stats.isFile()) {
      var data = { "data": {} };
      data.data.filename = file;
      data.data.size = stats["size"];
      data.data.modification = stats["mtime"];
      data.data.path = filesDirectory + file;
      if (filesDirectory == rootProjectPath + directoryFiles + id + "/") { //si el archivo está en la raíz
        data.data.parent = "root";
        data.data.deepLevel = 1

      } else {
        parent = filesDirectory.replace(
          rootProjectPath + directoryFiles + id + "/",
          ""
        );

        arr = parent.split("/");

        parent = arr[arr.length - 2];

        data.data.deepLevel = arr.length
        data.data.parent = parent;
      }
      let ext = path.extname(file);
      data.data.isDirectory = false;

      listPathsFile.push(data);
    }
    if (stats.isDirectory()) {
      var data = { "data": {}, "children": [] };
      data.data.filename = file;
      data.data.modification = stats["mtime"];
      data.data.size = 0;
      data.data.path = filesDirectory + file;
      if (filesDirectory == rootProjectPath + directoryFiles + id + "/") { //si es el directorio raíz
        data.data.parent = "root";
        data.data.deepLevel = 1

      } else {
        parent = filesDirectory.replace(
          rootProjectPath + directoryFiles + id + "/",
          ""
        );

        arr = parent.split("/");

        parent = arr[arr.length - 2];
        data.data.deepLevel = arr.length
        data.data.parent = parent;
      }
      data.data.isDirectory = true;

      listPathsFile.push(data);
      listPathsFile = getFilesFromDirectory( //se recorren los directorios hijos.
        id,
        filesDirectory + file + "/",
        listPathsFile
      );
    }
  });
  return listPathsFile;
};

/**
 * Crea un array de respuesta para el cliente con los elementos del directorio indicados añandiendo campos necesarios.
 * @param {string} responseArray - elementos que se van a devolver como respuesta.
 * @param {string[]} listPathsFile - lista con los paths de los elementos hijos del directorio.
 * @returns {string[]} Retorna la lista de los elementos del directorio con los datos extra añadidos.
 */
createResArray = function (responseArray, listPathsFile) {
  deepLevelList = []
  for (var i = 0; i < listPathsFile.length; i++) {
    deepLevelList.push(listPathsFile[i].data.deepLevel)
  }
  maxDeepLevel = Math.max(...deepLevelList)
  currentLevel = maxDeepLevel

  var lastLevelFiles = []
  while (currentLevel >= 1) {
    var filesCurrentLevel = listPathsFile.filter(function (el) { return el.data.deepLevel == currentLevel });
    filesCurrentLevel.forEach((element, i) => {

      if (currentLevel == 1 && element.data.isDirectory) {
        lastLevelFiles.forEach((file, j) => {
          if (element.data.isDirectory && file.data.parent == element.data.filename) {
            element.children.push(file);

          }
        });
        responseArray.push(element)
      }
      if (currentLevel == 1 && !element.data.isDirectory) {
        responseArray.push(element)
      }
      if (element.data.isDirectory && currentLevel > 1 && currentLevel < maxDeepLevel) {
        lastLevelFiles.forEach((file, j) => {
          if (file.data.parent == element.data.filename) {

            element.children.push(file);
          }
        });
      }
    });
    currentLevel = currentLevel - 1;
    lastLevelFiles = filesCurrentLevel;
  }
  return responseArray;
}

/**
 * @name get/files/:id
 * @function
 * @memberof module:routes/files
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.get("/files/:id", auth, async (req, res) => {
  try {
    //id = id del work.
    let work = await workService.getWorkById(req.params.id);
    var reqUserId = getUserIdFromTokenRequest(req);
    if (!await checkUserInWork(work._id.toString(), reqUserId) && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Acceso denegado");
    }

    id = req.params.id;
    filesDirectory = rootProjectPath + directoryFiles + id + "/";
    var listPathsFile = [];

    listPathsFile = getFilesFromDirectory(id, filesDirectory);
    listPathsFile.sort(function (a, b) {
      return parseFloat(b.data.deepLevel) - parseFloat(a.data.deepLevel);
    });

    listPathsFile.forEach((element) => {
      if (element.data.isDirectory) {
        const bytes = fastFolderSizeSync(element.data.path);
        element.data.size = bytes;
      }
    });
    responseArray = [];
    responseArray = createResArray(responseArray, listPathsFile);

    return res.status(200).json({
      status: "success",
      data: responseArray,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @name post/files/add
 * @function
 * @memberof module:routes/files
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.post("/files/add", auth, async (req, res) => {
  try {
    var form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          message: "Error during file parse",
        });
      }
      var uploadDirectory = fields.path + "/";
      var userIdResponsible = fields.userIdResponsible;
      var workId = fields.workId;
      let work = await workService.getWorkById(workId);
      var reqUserId = getUserIdFromTokenRequest(req);
      if (!await checkUserInWork(work._id.toString(), reqUserId) && !await checkIsAdmin(reqUserId)) {
        return res.status(403).send("Acceso denegado");
      }
      var file = files.upload;

      var fileName = encodeURIComponent(
        file.originalFilename.replace(/\s/g, "-")
      );
      try {
        if (file.size > 20000000) //se limita tamaño de archivo a 20MB.
          return res.status(400).send("File size too large.");

        fileService.createFile(file.filepath, uploadDirectory + fileName, userIdResponsible)
        return res.status(200).json({
          message: "File uploaded succesfully",
        });
      } catch (error) {
        return res.status(400).json({
          message: "Error during directory parse",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @name post/files/delete/:id
 * @function
 * @memberof module:routes/files
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.post("/files/delete/:id", auth, async (req, res) => {
  var id = req.params.id;
  var path = req.body.path;
  var userIdResponsible = req.body.userIdResponsible;
  try {
    let work = await workService.getWorkById(id.toString());
    var reqUserId = getUserIdFromTokenRequest(req);
    if (!await checkUserInWork(work._id.toString(), reqUserId) && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Acceso denegado");
    }

    var response = fileService.deleteFile(path, id, userIdResponsible);
    if (response == "error-file") {
      return res
        .status(400)
        .json({
          error: "Error deleting file " + response,
        });
    } else {
      return res.status(200).json({
        status: "File deleted succesfully",
        data: response,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @name post/files/createDir
 * @function
 * @memberof module:routes/files
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.post("/files/createDir", auth, async (req, res) => {
  try {
    var path = req.body.path;
    var userIdResponsible = req.body.userIdResponsible;
    var workId = req.body.workId;

    var reqUserId = getUserIdFromTokenRequest(req);

    let userInWork = await checkUserInWork(workId, reqUserId);
    if (!userInWork && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Acceso denegado");
    }

    if (path.trim().length == 0) {
      return res.status(400).json({
        status: 400,
        message: "Invalid directory name."
      })
    }
    if (path.split("/").length > 8) {
      return res.status(400).json({
        status: 400,
        message: "Exceeded limit number of subdirectories."
      })
    }
    var response = await fileService.createDirectory(path, userIdResponsible, false, workId);

    if (response == "Ok") {
      return res.status(200).json({
        status: 200,
        message: "Directory " + path + " created succesfully",
      });
    } else {
      return res
        .status(400)
        .json({
          error: "Directory already exists",
        });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

})

/**
 * @name post/files/deleteDir/:id
 * @function
 * @memberof module:routes/files
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.post("/files/deleteDir/:id", auth, async (req, res) => {
  var id = req.params.id;
  var path = req.body.path;
  var userIdResponsible = req.body.userIdResponsible;
  var workId = req.body.workId;
  try {
    let reqUserId = getUserIdFromTokenRequest(req);
    let userInWork = await checkUserInWork(workId, reqUserId);

    if (!userInWork && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Acceso denegado");
    }
    var response = fileService.deleteDirectory(path, id, userIdResponsible, false);
    if (response == "directory-not-empty") {
      return res
        .status(400)
        .json({
          error: "Directory not empty: " + response,
        });
    } else {
      return res.status(200).json({
        status: "Directory deleted succesfully",
        data: response,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

});

/**
 * @name post/files/download/:id
 * @function
 * @memberof module:routes/files
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.post("/files/download/:id", auth, async (req, res) => {
  try {
    let reqUserId = getUserIdFromTokenRequest(req);
    let userInWork = await checkUserInWork(req.params.id.toString(), reqUserId);
    if (!userInWork && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Acceso denegado");
    }
    res.download(req.body.path);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

});

module.exports = router;
