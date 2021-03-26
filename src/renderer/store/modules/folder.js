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
    getFolders({commit}, data = {}){
      let res = axios.get('http://localhost:5050/api/departament')
      commit('setFolders', res.data.folders)
    },
    addFolders({commit}, data = {}){
      let res = axios.post('http://localhost:5050/api/departament', {params: {
        ...data
      }
    })
      commit('setFolders', res.data.folders)
    }
  },
  getters: {
    folders: state => state.folders
  }
}