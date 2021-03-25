const { Router } = require('express')
const router = Router()
const Departament = require('../model/departament')

// метод добавления департамента
router.post('/', async (req, res, next) =>{
    const {name} = req.body
    const departament = await Departament.findOne({where: {name}})
    if(departament){
        return res.json({message: 'Такой департамент уже существует'})
    }
    Departament.create({
      name, 
  }).then(users=>{
      return res.status(201).json({ 
          success: true,
          message: 'Департамент добавлен',
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
  Departament.findAll().then(departaments=>{
      return res.status(201).json({ 
          success: true,
          message: 'Все департаменты',
          departaments
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