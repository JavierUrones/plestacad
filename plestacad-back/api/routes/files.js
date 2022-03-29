const router = require("express").Router();
const fs = require("fs");
const formidable = require("formidable");
const directoryFiles = "/userdata/";
const path = require("path");
const fastFolderSizeSync = require('fast-folder-size/sync')
const { response } = require("express");


const FileService = require("../../services/FileService");

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


router.get("/files/:id", async (req, res) => {
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

router.post("/files/add", async (req, res) => {
  try {
    var form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          message: "Error during file parse",
        });
      }
      const uploadDirectory = fields.path + "/";
      const file = files.upload;

      const fileName = encodeURIComponent(
        file.originalFilename.replace(/\s/g, "-")
      );
      try {
        //Se cambia el directorio del archivo.
        fs.renameSync(file.filepath, uploadDirectory + fileName);
      } catch (error) {
        return res.status(400).json({
          message: "Error during directory parse",
        });
      }
      try {
        return res.status(200).json({
          message: "File uploaded succesfully",
        });
      } catch (error) {
        res.json({
          error,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/files/delete/:id", async (req, res) => {
  var id = req.params.id;
  var path = req.body.path;
  try {
    fs.unlink(path, function (err) {
      if (err) {
        console.log(err)
        return res
          .status(500)
          .json({
            error: "Something was wrong trying to delete the file" + err,
          });
      }
      return res.status(200).json({
        status: "File deleted succesfully",
      });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});




router.post("/files/createDir", async (req, res) => {
  try{
    var path = req.body.path;
    var response = await fileService.createDirectory(path);
    console.log(response)
    if(response=="Ok"){
      return res.status(200).json({
        status: "Directory " + path + " created succesfully",
      });
    } else{
      return res
      .status(400)
      .json({
        error: "Directory already exists",
      });
    }
  }catch(error){
    return res.status(500).json({ error: error.message });
  }

})

router.post("/files/deleteDir/:id", async (req, res) => {
  var id = req.params.id;
  var path = req.body.path;
  try {
    fs.rmdir(path, function (err) {
      if (err) {
        console.log(err)
        return res
          .status(400)
          .json({
            error: "Something was wrong trying to delete the directory" + err,
          });
      }
      return res.status(200).json({
        status: "Directory deleted succesfully",
      });
    })

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

});





router.post("/files/download/:id", async (req, res) => {
  res.download(req.body.path, (err) => {
    if (err)
      console.log(err)
  })
});

module.exports = router;
