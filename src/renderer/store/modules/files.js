import axios from 'axios'
export default {
  state: {
    files: []
  },
  mutations: {
    setFiles(state, files){
      state.files = files
    }
  },
  actions: {
    SOCKET_updateChange({state, dispatch}, userId){
      let folder = state.folders.filter(folder=>Number(folder.userId) === Number(userId))
      console.log(folder);
      dispatch('getFiles', folder.id)
    },
    getFiles({commit}, folderId = null){
      axios.get('file', {params: {
        folderId
      }})
      .then(res=>{
        commit('setFiles', res.data.files)
      })
      .catch(err=>{
        console.log('getFiles error', err)
      })
    },
    async deleteFiles({dispatch}, fileParam = {}){
      let res = await axios.delete('http://localhost:5050/api/file', { params: { id: fileParam.id } })
      dispatch('getFiles', fileParam.folderId)
      return res.data.success
    },
    async downloadZIP({}, filesArrId = {}){
      let res = await axios.get('file/zip', { params: { filesArrId } })
      return res.data
    },
    async renameFile({dispatch}, fileParam = {}){
      console.log(fileParam);
      let res = await axios.put('http://localhost:5050/api/file', { ...fileParam })
      dispatch('getFiles', fileParam.folderId)
      return res.data.success
    }
    // addFiles({}, {folderId, files}) {
    //   let percentCompleted
    //   const config = {
    //     onUploadProgress: function(progressEvent) {
    //       percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    //       console.log(percentCompleted)
    //     }
    //   }
    //   let data = new FormData()
    //   data.append('files', files)
    //   axios.post('http://localhost:5050/api/upload', data, config)
    //   return percentCompleted
    // }
    
  },
  getters: {
    files: state => state.files
  }
}