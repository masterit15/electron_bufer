const { Router } = require('express')
const router = Router()
const User = require('../model/user')

// метод добавления пользователя
router.post('/', async (req, res, next) =>{
    console.log(req.body)
    let {login, permission, username, avatar} = req.body
    const candidate = await User.findOne({where: {login}})
    if(candidate){
        return res.json({message: 'Такой пользователь уже существует'})
    }
    User.create({
      login, 
      username,
      avatar, 
      permission, 
  }).then(users=>{
      return res.status(201).json({ 
          success: true,
          message: 'Пользователь создан',
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

// метод получения пользователя
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
module.exports = router