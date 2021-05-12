import axios from 'axios'
export default {
  state: {
    files: [],
    inputFiles: []
  },
  mutations: {
    setFiles(state, files){
      state.files = files
    },
    setInputFiles(state, files){
      console.log(files);
      if(files.length > 0){
        state.inputFiles = [...state.inputFiles, ...files]
      }else{
        state.inputFiles = []
      }
    },
    deleteInputFiles(state, index=null){
      if(!index){
        state.inputFiles = []
      }else{
        state.inputFiles = state.inputFiles.splice(index, 1);
      }
    },
    SOCKET_setFilesChange(state, filesId){
      let index = state.files.findIndex(file=>file.id == filesId)
      state.files[index].status = 'viewed'
    }
  },
  actions: {
    SOCKET_updateChange({rootState, dispatch}, userId){
      let folders = rootState.folder.folders
      let folder = folders.filter(folder=>Number(folder.userId) === Number(userId))
      dispatch('getFiles', folder[0].id)
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
      return res.data.file
    },
    async deleteZIP({}, zipFileName = ''){
      let res = await axios.delete('file/zip', { params: { zipFileName } })
      return res.data
    },
    async renameFile({dispatch}, fileParam = {}){
      let res = await axios.put('http://localhost:5050/api/file', { ...fileParam })
      // dispatch('getFiles', fileParam.folderId)
      return res.data.success
    }
  },
  getters: {
    files: state => state.files,
    inputFiles: state => state.inputFiles
  }
}