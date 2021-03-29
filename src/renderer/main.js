import Vue from 'vue'
import axios from 'axios'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
import smalltalk from '../../node_modules/smalltalk/lib/smalltalk'
import App from './App'
import router from './router'
import store from './store'
import Avatar from 'vue-avatar'
import VueSocketIO from 'vue-socket.io'
import db from './db'
Vue.use(new VueSocketIO({
    debug: false,
    connection: 'http://localhost:5050',
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    },
    // options: { path: "/my-app/" } //Optional options
}))

import './sass/main.sass'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.prototype.$http = axios
if (localStorage.user) {
  const tokenData = JSON.parse(localStorage.user)
  Vue.prototype.$http.defaults.headers.common['Authorization'] = `Bearer ${tokenData.accessToken}`
}

Vue.prototype.$smalltalk = smalltalk
Vue.prototype.$db = db
Vue.config.productionTip = false
Vue.component('Avatar', Avatar)
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
