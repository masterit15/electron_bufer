import axios from 'axios'
export default {
  state: {
    users: [],
    user: JSON.parse(localStorage.getItem('user')),
    notimessage: {}
  },
  mutations: {
    setUsers(state, users){
      state.users = users
    },
    setUser(state, user){
      state.user = user
    },
    addSidUser(state, data){
      let storageUser = JSON.parse(localStorage.getItem('user'))
        storageUser.sid = data.sid
        storageUser.room = data.room
        storageUser.online = 'Y'
        localStorage.setItem('user', JSON.stringify(storageUser))
        let index = state.users.findIndex(user=>Number(user.id) == Number(state.user.id))
        if(index !== -1){
          state.users[index].sid = data.sid
          state.users[index].room = data.room
          state.users.forEach((user, i) => {
            state.users[i].room = data.room
          });
        }
    },
    SOCKET_online(state, id){
      let index = state.users.findIndex(user=>Number(user.id) == Number(id))
      console.log(index);
      if(index !== -1){
        state.notimessage = { text: '', title: `Пользователь ${state.users[index].username} вошел`, variant: 'success' }
        state.users[index].online = 'Y'
      }
    },
    SOCKET_offline(state, id){
      let index = state.users.findIndex(user=>Number(user.id) == Number(id))
      if(index !== -1){
        state.notimessage = { text: '', title: `Пользователь ${state.users[index].username} вышел`, variant: 'warning' }
        state.users[index].online = 'N'
      }
    },
    SOCKET_test(state, id){
      state.notimessage = { text: '', title: `Пользователь ${id} вышел`, variant: 'danger' }
    },
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
      let params = {...data}
      let postres = []
      await axios.post('user', params)
      .then(res=>{
        let user = res.data.user
        localStorage.setItem('user', JSON.stringify(user))
        commit('setUser', user)
        postres = res.data
      })
      .catch(err=>{
        postres = err
      })
      return postres
    },
    async logout({}){
      let user = await JSON.parse(localStorage.getItem('user'))
      let res = await axios.delete('user', {params:{token: user.token}})
      if(res.data.success){
        localStorage.removeItem('user')
        delete axios.defaults.headers.common['Authorization']
      }
      return res.data.success
    },
  },
  getters: {
    users: state => state.users,
    user: state => state.user,
    notimessage: state => state.notimessage
  }
}