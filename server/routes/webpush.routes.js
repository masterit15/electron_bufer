const { Router } = require('express')
const webpush = require('../webpush')
const User = require('../model/user')
const router = Router()

router.post('/', (req, res) => {
    const {id, subscription} = req.body;
    console.log(req.body);
    User.update({
      subscription: subscription
    }, {
      where: { id }
    })
    res.status(201).json({
      subscribe: subscription.keys
    });
    const payload = JSON.stringify({ title: 'Вы подписались на уведомления!' });

    webpush.sendNotification(subscription, payload).catch(error => {
      console.error(error.stack);
    });
  });

module.exports = router