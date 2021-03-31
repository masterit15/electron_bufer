import axios from 'axios'
export default {
  state: {
    users: [],
    user: JSON.parse(localStorage.getItem('user'))
  },
  mutations: {
    setUsers(state, users){
      state.users = users
    },
    setUser(state, user){
      state.user = user
    },
    SOCKET_online(state, data){
      let onlineUser = state.users.find(user=>Number(user.id) === Number(data.id))
      onlineUser ? onlineUser.online = 'Y' : ''
    },
    SOCKET_offline(state, data){
      let offlineUser = state.users.find(user=>Number(user.id) === Number(data.id))
      offlineUser.online = 'N'
    }
  },
  actions: {
    getUsers({commit}, data = {}){
      axios.get('http://localhost:5050/api/user').then(res=>{
        commit('setUsers', res.data.users)
      })
      .catch(err=>{
        console.log('getUsers error', err)
      })
      
    },
    async addUsers({commit}, data = {}){
      let params = {...data}
      let postres = []
      await axios.post('http://localhost:5050/api/user', params)
      .then(res=>{
        let user = res.data.user
        localStorage.setItem('user', JSON.stringify(user))
        commit('setUser', user)
        postres = res.data
      })
      .catch(err=>{
        postres = err
      })
      console.log('postres',postres)
      
      return postres
    },
    async logout({state}){
      let user = await JSON.parse(localStorage.getItem('user'))
      let res = await axios.delete('http://localhost:5050/api/user', {params:{token: user.token}})
      if(res.data.success){
        localStorage.removeItem('user')
        delete axios.defaults.headers.common['Authorization']
      }
      return res.data.success
    },
  },
  getters: {
    users: state => state.users,
    user: state => state.user
  }
}