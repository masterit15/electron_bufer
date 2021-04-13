import axios from 'axios'
export default {
  state: {
    folders: [],
    activeFolderArr: []
  },
  mutations: {
    setFolders(state, folders){
      state.folders = folders
    },
    setActiveFolder(state, folder){
      state.activeFolderArr = folder
    }
  },
  actions: {
    getFolders({commit}, departamentId = null){
      console.log(departamentId)
      axios.get('folder', {params: {
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
      let res = axios.post('folder', {params: {
        ...data
      }
    })
    },
    activateFolder({commit}, folder){
      commit('setActiveFolder', folder)
    }
  },
  getters: {
    folders: state => state.folders,
    activeFolderArr: state => state.activeFolderArr
  }
}