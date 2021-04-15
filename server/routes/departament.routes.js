const { Router } = require('express')
const router = Router()
const Departament = require('../model/departament')
const sequelize = require('sequelize')
const Op = sequelize.Op
// метод добавления департамента
router.post('/', async (req, res, next) =>{
    const {name} = req.body
    const departament = await Departament.findOne({where: {name}})
    if(departament){
        return res.json({message: 'Такой департамент уже существует'})
    }
    Departament.create({
      name, 
  }).then(departament=>{
      return res.status(201).json({ 
          success: true,
          message: 'Департамент добавлен',
          departament
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
    const { name } = req.query 
    if(name && name.length > 0){
        Departament.findAll({ where: { name: { [Op.like]: '%' + name + '%' } } }).then(departaments=>{
            console.log(departaments);
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
    }else{
        Departament.findAll().then(departaments=>{
            console.log(departaments);
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
    }
})
module.exports = router