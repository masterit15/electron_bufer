const {Router} = require('express')
const multer  = require('multer')
const router = Router()
const fs = require('fs')
const User = require('../model/user')
const Folder = require('../model/folder')
const File = require('../model/file')
const sequelize = require('sequelize')
const Op = sequelize.Op
const uploadDir = './uploads';

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) =>{
      cb(null, uploadDir);
  },
  filename: (req, file, cb) =>{
      let fileExt = file.originalname.split('.').pop()
      cb(null, `${Date.now()}_${Math.floor(Math.random() * Math.floor(666))}.${fileExt}`);
  }
});

fs.stat(uploadDir, function(err) {
  if (!err) {
      //console.log(`Директория есть: ${uploadDir}`);
  }
  else if (err.code === 'ENOENT') {
      fs.mkdirSync(uploadDir);
  }
});

// функция загрузки файлов
router.post('/', multer({storage:storageConfig}).array('files'), (req, res, next) => {
    let filedata = req.files; 
    const {folderId, ownerId, ownerName} = req.query
    if(!filedata){
        res.status(404).json({
          success: false,
          message: 'Ошибка при загрузке файла',
          err: filedata
      });
    }else{
      addFiles(ownerName, ownerId, folderId, filedata)
      res.status(201).json({
        success: true,
        message: 'Файл загружен',
        filedata
    });
    }
});
router.get('/', async (req, res, next) => {
  const { folderId } = req.query
  try {
    const files = await File.findAll({where: {folderId}, raw:true})
    console.log(files)
    res.status(201).json({
      success: true,
      message: 'Все файлы раздела',
      files
    });
  } catch (error) {
    console.log(error)
    res.status(404).json({
      success: false,
      message: 'Ошибка, что то пошло не так!',
      error
    });
  }
})
router.put('/', (req, res, next) => {
  const { folderId } = req.query
  File.findAll({where: {folderId}, raw:true}).then(files =>{
    res.status(201).json({
      success: true,
      message: 'Все файлы раздела',
      files
    });
  })
  .catch(err => {
    res.status(404).json({
        success: false,
        message: 'Ошибка, что то пошло не так!',
        err
    });
  })
})

router.delete('/', async (req, res, next) => {
  const { folderId, id } = req.query
  try {
    const files = await File.findAll({where: {folderId, id}, raw:true})
    for(const file of files){
      fs.unlinkSync(file.path);
    }
    await File.destroy({where: { id }})
    res.status(201).json({
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Ошибка, что то пошло не так!',
      error
  });
  }
})
// функция добавления загруженных файлов в базу
async function addFiles(ownerName,ownerId, folderId, files) {
  for (const file of files) {
    await File.create({
      name: file.filename,
      path: file.path,
      size: file.size,
      ownerId,
      ownerName, 
      mimeType: file.mimetype,
      originalName: file.originalname,
      folderId
    })
  }
}
module.exports = router