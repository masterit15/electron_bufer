const webpush = require('web-push')
const config = require('config')

webpush.setVapidDetails('mailto:masterit15@yandex.ru', config.get('public_key'), config.get('privat_key'));

module.exports = webpush