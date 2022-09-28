const router = require("express").Router();
const fs = require("fs");
const formidable = require("formidable");
const directoryFiles = "/userdata/";
const path = require("path");
const fastFolderSizeSync = require('fast-folder-size/sync')
const { response } = require("express");
const auth = require("../middleware/authMiddleware");


const FileService = require("../../services/fileService");

const fileService = new FileService();

const rootProjectPath = require("path").resolve("./");
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
      if (filesDirectory == rootProjectPath + directoryFiles + id + "/") {
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
      if (filesDirectory == rootProjectPath + directoryFiles + id + "/") {
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
      listPathsFile = getFilesFromDirectory(
        id,
        filesDirectory + file + "/",
        listPathsFile
      );
    }
  });
  return listPathsFile;
};


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


router.get("/files/:id", auth, async (req, res) => {
  try {
    //id = id del work.
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
    console.log("ERROR", error.message)
    return res.status(500).json({ error: error.message });
  }
});

router.post("/files/add", auth, async (req, res) => {
  try {
    var form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          message: "Error during file parse",
        });
      }
      const uploadDirectory = fields.path + "/";
      var userIdResponsible = fields.userIdResponsible;


      const file = files.upload;

      const fileName = encodeURIComponent(
        file.originalFilename.replace(/\s/g, "-")
      );
      try {
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

router.post("/files/delete/:id", auth, async (req, res) => {
  var id = req.params.id;
  var path = req.body.path;
  var userIdResponsible = req.body.userIdResponsible;
  try {
    var response = fileService.deleteFile(path, id, userIdResponsible);
    if(response == "error-file"){
      return res
      .status(400)
      .json({
        error: "Error deleting file " + response,
      });
    } else{
      return res.status(200).json({
        status: "File deleted succesfully",
        data: response,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});




router.post("/files/createDir", auth, async (req, res) => {
  try {
    var path = req.body.path;
    var userIdResponsible = req.body.userIdResponsible;
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
    var response = await fileService.createDirectory(path, userIdResponsible, false);

    console.log(response)
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

router.post("/files/deleteDir/:id", auth, async (req, res) => {
  var id = req.params.id;
  var path = req.body.path;
  var userIdResponsible = req.body.userIdResponsible;
  try {

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





router.post("/files/download/:id", auth, async (req, res) => {
  res.download(req.body.path, (err) => {
    if (err)
      console.log(err)
  })
});

module.exports = router;
