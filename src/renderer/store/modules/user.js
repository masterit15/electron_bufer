import axios from 'axios'
export default {
  state: {
    users: [],
    user: JSON.parse(localStorage.getItem('user')),
    notimessage: {},
    lockscreen: false
  },
  mutations: {
    setLock(state, lock){
      state.lockscreen = lock
    },
    setUsers(state, users){
      state.users = users
    },
    setUser(state, user){
      localStorage.setItem('user', JSON.stringify(user))
      state.user = user
    },
    SOCKET_online(state, id){
      let index = state.users.findIndex(user=>Number(user.id) == Number(id))
      if(index !== -1){
        state.notimessage = { text: '', title: `Пользователь ${state.users[index].username} вошел`, variant: 'success' }
        state.users[index].online = 'Y'
      }
    },
    SOCKET_userIsOnline(state, id){
      let index = state.users.findIndex(user=>Number(user.id) == Number(id))
      if(index !== -1){
        // state.notimessage = { text: '', title: `Пользователь ${state.users[index].username} вошел`, variant: 'success' }
        state.users[index].online = 'Y'
      }
    },
    SOCKET_offline(state, id){
      let index = state.users.findIndex(user=>Number(user.id) == Number(id))
      if(index !== -1){
        state.notimessage = { text: '', title: `Пользователь ${state.users[index].username} вышел`, variant: 'warning' }
        state.users[index].online = 'N'
      }
    }
  },
  actions: {
    getUsers({commit}, data = {}){
      axios.get('user').then(res=>{
        commit('setUsers', res.data.users)
      })
      .catch(err=>{
        console.log('getUsers error', err)
      })
    },
    async Auth({commit}, data = {}){
      let dataForm = new FormData();
      dataForm.append("avatar", data.avatar);
      let postres = []
      await axios.post(`user?login=${data.login}&username=${data.username}&departament=${data.departament}&network=${data.network}&mac=${data.mac}`, dataForm)
      .then(res=>{
        let user = res.data.user
        // commit('setUser', user)
        postres = res.data
      })
      .catch(err=>{
        postres = err
      })
      return postres
    },
    async logOut({}, token){
      return await axios.delete('user', {params:{token}})
      .then(res=>{
        delete axios.defaults.headers.common['Authorization']
        return res.data.success
      })
      .catch(err=>err)
    },
    async unLockScreen({commit}, password){
      if(password == '0000'){
        commit('setLock', false)
      }
    },
    async LockScreen({commit}){
      commit('setLock', true)
    },
  },
  getters: {
    users: state => state.users,
    user: state => state.user,
    notimessage: state => state.notimessage,
    lockscreen: state => state.lockscreen
  }
}