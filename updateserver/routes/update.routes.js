const { Router } = require('express')
const router = Router()
const { AUTH_TOKEN } = require('../config');
// метод получения пользователей
router.get('/', (req, res, next) =>{
  console.log(req.query)
  const { platform, version } = req.query
  const authToken = req.get('Authorization').split(' ').pop()
  if (!authToken || authToken !== AUTH_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return res.status(200).json({ message: 'Server is up!' });
})

module.exports = router