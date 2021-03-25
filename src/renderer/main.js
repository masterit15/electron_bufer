import Vue from 'vue'
import axios from 'axios'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
import VueContext from '../../node_modules/vue-context/src/js/index'
import smalltalk from '../../node_modules/smalltalk/lib/smalltalk'
import App from './App'
import router from './router'
import store from './store'
import Avatar from 'vue-avatar'
const fs = require('fs')
const path = require('path')
import chokidar from 'chokidar';
import Event from 'events';

const EventEmitter  = Event.EventEmitter

class Observer extends EventEmitter {
  constructor() {
    super();
  }

  watchFolder(folder) {
    try {
      console.log(
        `[${new Date().toLocaleString()}] Watching for folder changes on: ${folder}`
      );

      var watcher = chokidar.watch(folder, { persistent: true });

      watcher.on('add', async filePath => {
        if (filePath.includes('error.log')) {
          console.log(
            `[${new Date().toLocaleString()}] ${filePath} has been added.`
          );

          // Read content of new file
          var fileContent = await fs.readFile(filePath);

          // emit an event when new file has been added
          this.emit('file-added', {
            message: fileContent.toString()
          });

          // remove file error.log
          await fs.unlink(filePath);
          console.log(
            `[${new Date().toLocaleString()}] ${filePath} has been removed.`
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

import './sass/main.sass'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.prototype.$fs = fs
Vue.prototype.$path = path
Vue.prototype.$watchet = new Observer();
Vue.prototype.$smalltalk = smalltalk
Vue.config.productionTip = false
Vue.component('VueContext', VueContext)
Vue.component('Avatar', Avatar)
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
