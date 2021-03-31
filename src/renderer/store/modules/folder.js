import axios from 'axios'
export default {
  state: {
    folders: [],
    activFolderId: null
  },
  mutations: {
    setFolders(state, folders){
      state.folders = folders
    },
    setActiveFolder(state, folderId){
      state.activFolderId = folderId
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
    },
    activeFolder({commit}, folderId){
      commit('setActiveFolder', folderId)
    }
  },
  getters: {
    folders: state => state.folders,
    activFolderId: state => state.activFolderId
  }
}