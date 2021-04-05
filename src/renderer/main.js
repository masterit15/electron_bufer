import Vue from 'vue'
import axios from 'axios'
import { BootstrapVue, IconsPlugin, ToastPlugin } from 'bootstrap-vue'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
import smalltalk from '../../node_modules/smalltalk/lib/smalltalk'
import App from './App'
import router from './router'
import store from './store'
import Avatar from 'vue-avatar'
import VueSocketIO from 'vue-socket.io'
import vClickOutside from 'v-click-outside'
Vue.use(vClickOutside)
import messages from './plugins/messages'
Vue.use(messages)

import dateFilter from './filter/date.filter'
Vue.filter('date', dateFilter)

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
  console.log(JSON.parse(localStorage.user));
  const token = JSON.parse(localStorage.user).token
  console.log(token);
  Vue.prototype.$http.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
window.console.log
window.$ = window.jQuery = require('jquery');
import 'jquery-mousewheel'
import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min'

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
