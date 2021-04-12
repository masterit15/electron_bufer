const { Router } = require('express')
const router = Router()
const path = require('path');
const FILES_STORE = path.join(__dirname, 'files/');
const { AUTH_TOKEN } = require('../config');

// метод добавления пользователя
router.post('/', async (req, res, next) =>{
  const authToken = req.get('Authorization').split(' ').pop()
  if (!authToken || authToken !== AUTH_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: 'No files were uploaded.' });
  }

  const files = req.files.File;

  if (Array.isArray(files)) {
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      const path = `${FILES_STORE}${file.name}`;
      file.mv(path, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'An error occured during upload, please try again' });
        }
      });
    }
  } else {
    const path = `${FILES_STORE}${files.name}`;
    files.mv(path, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'An error occured during upload, please try again' });
      }
    });
  }

  return res.status(200).json({ message: 'Files were uploaded' });
})

module.exports = router