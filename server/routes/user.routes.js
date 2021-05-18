const { Router } = require('express')
const router = Router()
const multer  = require('multer')
const fs = require('fs')
const auth = require('../middleware/auth.middleware')
const User = require('../model/user')
const Token = require('../model/token')
const Departament = require('../model/departament')
const Folder = require('../model/folder')
const config = require('config')
const jwt = require('jsonwebtoken')
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './static');
    },
    filename: (req, file, cb) =>{
        let fileExt = file.originalname.split('.').pop()
        cb(null, `${Date.now()}_${Math.floor(Math.random() * Math.floor(666))}.${fileExt}`);
    }
});
// метод добавления пользователя
router.post('/', multer({storage:storageConfig}).single('avatar'), async (req, res, next) =>{
    const avatar = req.file ? req.file.filename : ''
    const { login, permission, username, departament, network, mac } = req.query
    const departamentArr = await getDepartamentId(departament)
    const candidate = await User.findOne({where: {login, mac}, raw:true})
    if(candidate){
        let token = await generateAccessToken(candidate)
        return res.status(200).json({ 
            success: true,
            message: 'Успешная авторизация',
            user: {...candidate, token}
        })
    }else{
        User.create({
            login, 
            username,
            avatar, 
            permission, 
            departamentId: departamentArr.id,
            departamentName: departamentArr.name,
            network,
            mac
        }).then(async user=>{
            let token = await generateAccessToken(user)
            Folder.create({
                name: user.dataValues.username,
                userId: user.dataValues.id,
                departamentId: user.dataValues.departamentId
            })
            return res.json({ 
                success: true,
                message: 'Пользователь создан',
                user: {...user.dataValues,token}
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

// метод получения пользователей
router.get('/', (req, res, next) =>{
    User.findAll({
        raw: true,
        include: [
            {
              model: Folder,
              attributes: [ 'id', 'name' ]
            }
          ]
    }).then(users=>{
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
router.delete('/', async(req, res, next) =>{
    const { token } = req.query
    try {
        await Token.destroy({where: { token }})
        return res.status(201).json({ 
            success: true,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Что-то пошло не так, попробуйте еще раз',
            error
        })
    }
})
function getDepartamentId(name){
    return new Promise((resolve, reject)=>{
        Departament.findOne({where: {name}, raw: true})
        .then(res=>{
            if(res == null){
                Departament.create({name}).then(res=>{
                    resolve(res.dataValues)
                })
            }else{
                resolve(res)
            }
        })
        .catch(err=>{
            reject(err)
        })
    })
}
async function generateAccessToken(user) {
        let token = jwt.sign({ userId: user.id, userName: user.username, macAddress: user.mac, permission: user.permission, departamentId: user.departamentId }, config.get('jwtSecret'))
        await Token.create({
            token,
            userId: user.id
        })
        return token
}
module.exports = router