const { Router } = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')
const User = require('../model/user')
const Token = require('../model/token')
const Departament = require('../model/departament')
const Folder = require('../model/folder')
const config = require('config')
const jwt = require('jsonwebtoken')
// метод добавления пользователя
router.post('/', async (req, res, next) =>{
    const { login, permission, username, avatar, departament } = req.body
    const departamentId = await getDepartamentId(departament)
    const candidate = await User.findOne({where: {login}})
    if(candidate){
        return res.json({message: 'Такой пользователь уже существует'})
    }
    console.log(departamentId)
    User.create({
      login, 
      username,
      avatar, 
      permission, 
      departamentId
  }).then(user=>{
    user.token = generateAccessToken(user)
    Folder.create({
        name: user.dataValues.username,
        userId: user.dataValues.id,
        departamentId: user.dataValues.departamentId
    })
    return res.status(201).json({ 
        success: true,
        message: 'Пользователь создан',
        user
    })
  }).catch((err)=>{
      console.log('errrrr',err)
    return res.status(500).json({
        success: false,
        message: 'Что-то пошло не так, попробуйте еще раз',
        err
    })
  });
})

// метод получения пользователей
router.get('/', (req, res, next) =>{
    User.findAll().then(users=>{
        return res.status(201).json({ 
            success: true,
            message: 'Все пользователи',
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
// метод получения пользователей
router.delete('/', (req, res, next) =>{
    const { token } = req.body
    User.findAll().then(users=>{
        return res.status(201).json({ 
            success: true,
            message: 'Все пользователи',
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
function getDepartamentId(name){
    return new Promise((resolve, reject)=>{
        Departament.findOne({where: {name}})
        .then(res=>{
            if(res == null){
                Departament.create({name}).then(res=>{
                    resolve(res.dataValues.id)
                })
            }else{
                resolve(res.dataValues.id)
            }
        })
        .catch(err=>{
            reject(err)
        })
    })
}
function generateAccessToken(user) {
    let token =  jwt.sign({ userId: user.id, permission: user.permission, departamentId: user.departamentId }, config.get('jwtSecret'))
    Token.create({
        token
    })
    return token
}
module.exports = router