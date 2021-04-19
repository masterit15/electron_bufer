import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import { createPersistedState } from 'vuex-electron'



Vue.use(Vuex)
export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState(),
  ],
  strict: process.env.NODE_ENV !== 'production'
})
