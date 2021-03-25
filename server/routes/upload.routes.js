const {Router} = require('express')
const User = require('../model/user')
const Folder = require('../model/folder')
const File = require('../model/file')
const multer  = require("multer")
const router = Router()
 
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) =>{
      cb(null, "./uploads");
  },
  filename: (req, file, cb) =>{
      let fileExt = file.originalname.split('.').pop()
      cb(null, `${Date.now()}_${Math.floor(Math.random() * Math.floor(666))}.${fileExt}`);
  }
});

router.post("/", multer({storage:storageConfig}).array("files"), (req, res, next) => {
    let filedata = req.files; 
    if(!filedata){
        res.status(404).json({
          success: false,
          message: 'Ошибка при загрузке файла',
          err: filedata
      });
    }else{
      addFiles(filedata)
      res.status(201).json({
        success: true,
        message: 'Файл загружен',
        filedata
    });
    }
});

async function addFiles(files) {
  for (const file of files) {
    await File.create({
      name: file.filename,
      path: file.path,
      size: file.size,
      mimeType: file.mimetype,
      originalName: file.originalname
    })
  }
}
module.exports = router