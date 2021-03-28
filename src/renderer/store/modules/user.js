import axios from 'axios'
export default {
  state: {
    users: []
  },
  mutations: {
    setUsers(state, users){
      state.users = users
    }
  },
  actions: {
    getUsers({commit}, data = {}){
      let res = axios.get('http://localhost:5050/api/user')
      commit('setUsers', res.data.users)
    },
    async addUsers({dispatch}, data = {}){
      let params = {...data}
      axios.post('http://localhost:5050/api/user', params).then(res=>{
        console.log(res)
        let user = res.data.user
        user.token = res.data.token
        localStorage.setItem('user', JSON.stringify(user))
      })
      .catch(err=>{
        console.log(err)
      })
    },
  },
  getters: {
    users: state => state.users
  }
}