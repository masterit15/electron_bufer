import axios from 'axios'
export default {
  state: {
    files: [],
    fileCount: null,
    inputFiles: []
  },
  mutations: {
    setFiles(state, files){
      state.files = files
      state.fileCount = files.length
    },
    setInputFiles(state, files){
      if(files.length > 0){
        state.inputFiles = [...state.inputFiles, ...files]
      }else{
        state.inputFiles = []
      }
    },
    deleteInputFiles(state, file){
      if(!file){
        state.inputFiles = []
      }else{
        state.inputFiles = state.inputFiles.filter(inpfile=> inpfile.name !== file.name && inpfile.lastModified !== file.lastModified)
      }
    },
    SOCKET_setFilesChange(state, filesId){
      let index = state.files.findIndex(file=>file.id == filesId)
      state.files[index].status = 'viewed'
    },
    SOCKET_fileStatus(state, fileId){
      if(fileId.length > 0){
        fileId.forEach(fileId => {
          let index = state.files.findIndex(file=>Number(file.id) == Number(fileId))
          if(index !== -1){
            state.files[index].status = 'viewed'
          }
        });
      }
    }
  },
  actions: {
    SOCKET_updateChange({rootState, dispatch}, userId){
      let folders = rootState.folder.folders
      let folder = folders.filter(folder=>Number(folder.userId) === Number(userId))
      if(rootState.folder.activeFolderArr.id == folder[0].id){
        dispatch('getFiles', folder[0].id)
      }
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
      let res = await axios.delete('file', { params: { id: fileParam.id } })
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
      let res = await axios.put('file', { ...fileParam })
      // dispatch('getFiles', fileParam.folderId)
      return res.data.success
    }
  },
  getters: {
    files: state => state.files,
    inputFiles: state => state.inputFiles,
    fileCount: state => state.fileCount
  }
}