

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
    getNotices({commit}, id){
      axios.get('http://localhost:5050/api/notice', {params:{id}}).then(res=>{
        commit('setNotices', res.data.notices)
      })
      .catch(err=>{
        console.log('getNotices error', err)
      })
    },
    updateNotices({state,dispatch}, id){
      axios.put('http://localhost:5050/api/notice', {params:{id}}).then(res=>{
          console.log(res.data)
          // commit('setNotices', res.data.notices)
        })
        .catch(err=>{
          console.log('getNotices error', err)
        })
      },
    deleteNotices({state,dispatch}, id){
      axios.delete('http://localhost:5050/api/notice', {params:{id}}).then(res=>{
          console.log(res.data)
          // commit('setNotices', res.data.notices)
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