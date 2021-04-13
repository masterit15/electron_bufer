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
      axios.get('departament')
      .then(res=>{
        commit('setDepartaments', res.data.departaments)
      })
      .catch(err=>{
        console.log(err)
      })
    }
  },
  getters: {
    departaments: state => state.departaments
  }
}