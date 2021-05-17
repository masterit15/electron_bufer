const {Router} = require('express')
const multer  = require('multer')
const router = Router()
const fs = require('fs')
const User = require('../model/user')
const Folder = require('../model/folder')
const File = require('../model/file')
const sequelize = require('sequelize')
const Op = sequelize.Op
const uploadDir = './uploads'
const AdmZip = require('adm-zip')
const logger = require('../loger')
const auth = require('../middleware/auth.middleware')

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
router.post('/', auth, multer({storage:storageConfig}).array('files'), (req, res, next) => {
    let filedata = req.files; 
    const {folderId, ownerId, ownerName} = req.query
    if(!filedata){
        logger.fileSharing.error(`Произошла ошибка при загрузке файлов от пользователя: ${ownerName}, id: ${ownerId} | folderId: ${folderId} | err: ${filedata}`)
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
router.get('/', auth, async (req, res, next) => {
  const { folderId } = req.query
  try {
    const files = await File.findAll({where: {folderId}, raw:true})
    res.status(201).json({
      success: true,
      message: 'Все файлы раздела',
      files
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Ошибка, что то пошло не так!',
      error
    });
  }
})
router.put('/', auth, async(req, res, next) => {
  const thisUser = req.user
  const { id, originalName } = req.body
  const oldFile = await File.findOne({where: { id }, raw: true})
  logger.fileSharing.info(`Пользователь ${thisUser.userName} переименовал файл ${oldFile.originalName} в ${originalName}`)
  let changeFile = await File.update(
    { originalName },
    { where: { id }, raw: true }
  )
  if(changeFile){
    res.status(201).json({
      success: true,
      message: 'Файл успешно изменен',
    });
  }else{
    res.status(404).json({
      success: false,
      message: 'Ошибка, что то пошло не так!',
      err
    });
  }
})

router.delete('/', auth, async (req, res, next) => {
  const thisUser = req.user
  const { id } = req.query
  try {
    const files = await File.findAll({where: {id}, raw:true})
    const idArr = id.map(Number)
    let delres = await File.destroy({where: { id: idArr }})
    if(delres > 0){
      res.status(200).json({
        success: true,
      });
    }
    for(const file of files){
      fs.unlinkSync(file.path);
      logger.fileSharing.info(`Пользователь ${thisUser.userName}, удалил файл ${file.originalName} | путь: ${file.path}`)
    }
    
  } catch (error) {
    logger.fileSharing.error(`Пользователь ${thisUser.userName}, не смог удалить файл(ы) | error: ${error}`)
    res.status(404).json({
      success: false,
      message: 'Ошибка, что то пошло не так!',
      error
  });
  }
})
router.get('/zip', auth, async (req, res)=>{
  const { filesArrId } = req.query
  try {
    const filesArr = await File.findAll({ where: { id: filesArrId.map(Number) }, raw: true })
    const zip = new AdmZip();
    for(const f of filesArr){
      zip.addLocalFile(f.path);
    }
    const willSendthis = zip.toBuffer();

    const zipFile = `./uploads/${Date.now()}_files.zip`
    zip.writeZip(zipFile);
    
    res.json({
      success: true,
      file: zipFile
    })
  } catch (error) {
    res.json({error})
  }
	
})

router.delete('/zip', async (req, res)=>{
  const { zipFileName } = req.query
  try {
    const zipFile = `./uploads/${zipFileName}`
    fs.unlinkSync(zipFile);
    res.json({
      success: true,
    })
  } catch (error) {
    res.json({error})
  }
    
})

function convertEmoji(str) {
  let rex = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug;
  return str.replace(rex, match => `[e-${match.codePointAt(0).toString(16)}]`);
}
// функция добавления загруженных файлов в базу
async function addFiles(ownerName,ownerId, folderId, files) {
  
  for (const file of files) {
    logger.fileSharing.info(`Добавление файла от пользователя: ${ownerName}, id: ${ownerId} | folderId: ${folderId} | путь к файлу: ${file.path}`)
    await File.create({
      name: file.filename,
      path: file.path,
      size: file.size,
      ownerId,
      ownerName, 
      mimeType: file.mimetype,
      originalName: convertEmoji(file.originalname),
      folderId,
      userId: ownerId
    })
  }
}
module.exports = router