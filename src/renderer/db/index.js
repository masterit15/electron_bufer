const Datastore = require('nedb')
const path = require('path')
import {remote} from 'electron'
const dbFile = path.join(remote.app.getPath('userData'),'/database.db')
const db = new Datastore({ filename: dbFile, autoload: true });

db.loadDatabase(function (error) {   
  if (error) {
      console.log('FATAL: local database could not be loaded. Caused by: ' + error);
      throw error;
    }
    // console.log('INFO: local database loaded successfully.', db);
});
export default db