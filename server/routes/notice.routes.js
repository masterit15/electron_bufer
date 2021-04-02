const { Router } = require('express')
const router = Router()
const sequelize = require('sequelize')
const Op = sequelize.Op
const Notice = require('../model/notice')

// метод добавления департамента
router.post('/', async (req, res, next) =>{
    const {title, text, userId} = req.body
    Notice.create({
      title,
      text,
      userId
  }).then(notices=>{
      return res.status(201).json({ 
          success: true,
          message: 'Раздел добавлен',
          notices
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
    const {id} = req.query
    Notice.findAll({ where: { userId: id } }).then(notices=>{
        return res.status(201).json({ 
            success: true,
            message: 'Все разделы',
            notices
        })
    }).catch((err)=>{
        return res.status(500).json({
            success: false,
            message: 'Что-то пошло не так, попробуйте еще раз',
            err
        })
    });
})

router.delete('/', (req, res, next)=>{
  const {id} = req.query
  Notice.findOne({ where: { id } }).then(notices=>{
      return res.status(201).json({ 
          success: true,
          message: 'Все разделы',
          notices
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