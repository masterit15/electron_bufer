const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }
  try {
    const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"
    
    if (!token) {
      return res.status(401).json({ message: 'Нет авторизации или закончилась сессия' })
    }
    
    const decoded = jwt.verify(token, config.get('jwtSecret'))
    req.user = decoded
    next()

  } catch (e) {
    if (e.message === 'jwt expired'){
      res.status(401).json({
        success: false,
        message: 'Ваш токен истек в ' + e.expiredAt,
        token: false
      })
    }else{
      res.status(401).json({ message: e.message + ' ' + e.expiredAt })
    }
  }
}