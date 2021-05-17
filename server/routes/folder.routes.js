const { Router } = require('express')
const router = Router()
const sequelize = require('sequelize')
const Op = sequelize.Op
const Folder = require('../model/folder')

// метод добавления раздела
router.post('/', async (req, res, next) =>{
    const {name} = req.body
    const folder = await Folder.findOne({where: {name}})
    if(folder){
        return res.json({message: 'Такой раздел уже существует'})
    }
    Folder.create({
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

// метод получения раздела
router.get('/', (req, res, next) =>{
    const { departamentId } = req.query
    Folder.findAll({ where: { departamentId } }).then(folders=>{
        return res.status(201).json({ 
            success: true,
            folders
        })
    }).catch((err)=>{
        return res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
            err
        })
    });
})
module.exports = router