

import axios from 'axios'
export default {
  state: {
    notices: [],
  },
  mutations: {
    setNotices(state, notices){
      state.notices = notices
    },
  },
  actions: {
    SOCKET_noticeUser({dispatch}, userId){
      dispatch('getNotices', userId)
      console.log(userId);
    },
    getNotices({commit}, id){
      axios.get('notice', {params:{id}}).then(res=>{
        commit('setNotices', res.data.notices)
      })
      .catch(err=>{
        console.log('getNotices error', err)
      })
    },
    updateNotices({dispatch}, id){
      axios.put('notice', {params:{id}}).then(res=>{
          commit('setNotices', res.data.notices)
        })
        .catch(err=>{
          console.log('getNotices error', err)
        })
      },
    deleteNotices({state,dispatch}, id){
      axios.delete('notice', {params:{id}}).then(res=>{
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