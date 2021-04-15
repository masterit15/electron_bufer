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
      console.log('getDepartaments', result);
      return result
    }
  },
  getters: {
    departaments: state => state.departaments
  }
}