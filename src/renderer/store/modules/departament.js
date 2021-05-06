import axios from 'axios'
export default {
  state: {
    departaments: [],
    activeDepartament: null
  },
  mutations: {
    setDepartaments(state, departaments){
      state.departaments = departaments
    },
    setActiveDepartament(state, departament){
      state.activeDepartament = departament
    }
  },
  actions: {
    async getDepartaments({commit}, data = {}){
      let result
      await axios.get('departament', {params:{...data}})
      .then(res=>{
        result = res.data
        commit('setDepartaments', res.data.departaments)
      })
      .catch(err=>{
        console.log(err)
      })
      return result
    }
  },
  getters: {
    departaments: state => state.departaments,
    activeDepartament: state => state.activeDepartament
  }
}