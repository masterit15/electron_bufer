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
    const { login, permission, username, avatar, departament, network, mac } = req.body
    const departamentArr = await getDepartamentId(departament)
    const candidate = await User.findOne({where: {login}, raw:true})
    const allUsers = await User.findAll({raw:true})
    if(candidate){
        const userFind = allUsers.find(user=> (user.mac === candidate.mac && user.login === candidate.login))
        if(userFind){
            let {token} = await Token.findOne({where: { userId: userFind.id }, raw: true})
            return res.status(200).json({ 
                success: true,
                message: 'Успешная авторизация',
                user: {...userFind, token}
            })
        }
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
        }).then(user=>{
            user.token = generateAccessToken(user)
            Folder.create({
                name: user.dataValues.username,
                userId: user.dataValues.id,
                departamentId: user.dataValues.departamentId
            })
            return res.json({ 
                success: true,
                message: 'Пользователь создан',
                user
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
    User.findAll({raw: true}).then(users=>{
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
                    resolve(res.dataValues)
                })
            }else{
                resolve(res.dataValues)
            }
        })
        .catch(err=>{
            reject(err)
        })
    })
}
async function generateAccessToken(user) {
        let token = jwt.sign({ userId: user.id, userId: user.mac, permission: user.permission, departamentId: user.departamentId }, config.get('jwtSecret'))
        await Token.create({
            token,
            userId: user.id
        })
        return token
}
module.exports = router