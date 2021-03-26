import axios from 'axios'
export default {
  state: {
    departaments: []
  },
  mutations: {
    setDepartaments(state, departaments){
      state.departaments = departaments
    }
  },
  actions: {
    getDepartaments({commit}, data = {}){
      let res = axios.get('http://localhost:5050/api/departament')

      commit('setDepartaments', res.data.departaments)
    }
  },
  getters: {
    departaments: state => state.departaments
  }
}