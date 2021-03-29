import axios from 'axios'
export default {
  state: {
    folders: []
  },
  mutations: {
    setFolders(state, folders){
      state.folders = folders
    }
  },
  actions: {
    getFolders({commit}, departamentId = null){
      axios.get('http://localhost:5050/api/folder', {params: {
        departamentId
      }})
      .then(res=>{
        commit('setFolders', res.data.folders)
      })
      .catch(err=>{
        console.log('getFolders error', err)
      })
    },
    addFolders({commit}, data = {}){
      let res = axios.post('http://localhost:5050/api/folder', {params: {
        ...data
      }
    })
    }
  },
  getters: {
    folders: state => state.folders
  }
}