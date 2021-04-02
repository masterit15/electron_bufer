

import axios from 'axios'
export default {
  state: {
    notices: [],
  },
  mutations: {
    setNotices(state, notices){
      state.notices = notices
    }
  },
  actions: {
    SOCKET_noticeUser({dispatch}, userId){
      dispatch('getNotices', userId)
    },
    getNotices({commit}, data = {}){
      axios.get('http://localhost:5050/api/user').then(res=>{
        commit('setNotices', res.data.notices)
      })
      .catch(err=>{
        console.log('getNotices error', err)
      })
      
    }
  },
  getters: {
    notices: state => state.notices,
  }
}