import Vue from 'vue'
import axios from 'axios'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
import smalltalk from 'smalltalk/lib/smalltalk'
import App from './App'
import router from './router'
import store from './store'
import Avatar from 'vue-avatar'
import VueSocketIO from 'vue-socket.io'
import vClickOutside from 'v-click-outside'
import inViewportDirective from 'vue-in-viewport-directive'
Vue.directive('in-viewport', inViewportDirective)

Vue.use(vClickOutside)
import messages from './plugins/messages'
Vue.use(messages)

import dateFilter from './filter/date.filter'
Vue.filter('date', dateFilter)

import fileIcon from './filter/fileicon.filter'
Vue.filter('icon', fileIcon)

import fileSize from './filter/filesize.filter'
Vue.filter('size', fileSize)


var baseURL = ''

if(process.env.NODE_ENV === 'production'){
  baseURL = 'http://localhost:5050/api/'//'http://10.20.0.41/api/'
}else{
  baseURL = 'http://localhost:5050/api/'
}

Vue.use(new VueSocketIO({
    debug: false,
    connection: baseURL.replace("/api/", ""),
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    },
    // options: { path: "/my-app/" } //Optional options
}))

import './sass/main.sass'
// Vue.config.devtools = process.env.NODE_ENV === 'development'
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

axios.defaults.baseURL = baseURL

if (localStorage.user) {
  const token = JSON.parse(localStorage.user).token
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

Vue.prototype.$smalltalk = smalltalk
Vue.config.productionTip = false

Vue.component('Avatar', Avatar)
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
