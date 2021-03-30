const { Router } = require('express')
const router = Router()
const sequelize = require('sequelize')
const Op = sequelize.Op
const Files = require('../model/folder')

// метод добавления департамента
router.post('/', async (req, res, next) =>{
    const {name} = req.body
    const folder = await Files.findOne({where: {name}})
    if(folder){
        return res.json({message: 'Такой департамент уже существует'})
    }
    Files.create({
      name, 
  }).then(users=>{
      return res.status(201).json({ 
          success: true,
          message: 'Раздел добавлен',
          users
      })
  }).catch((err)=>{
      return res.status(500).json({
          success: false,
          message: 'Что-то пошло не так, попробуйте еще раз',
          err
      })
  });
})

// метод получения департамента
router.get('/', (req, res, next) =>{
    const {folderId} = req.query
    console.log(folderId)
    Files.findAll({ where: { folderId } }).then(files=>{
        return res.status(201).json({ 
            success: true,
            message: 'Все разделы',
            files
        })
    }).catch((err)=>{
        return res.status(500).json({
            success: false,
            message: 'Что-то пошло не так, попробуйте еще раз',
            err
        })
    });
})
module.exports = router