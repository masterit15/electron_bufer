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
    getFiles({commit}, folderId = null){
      axios.get('http://localhost:5050/api/file', {params: {
        folderId
      }})
      .then(res=>{
        commit('setFiles', res.data.files)
      })
      .catch(err=>{
        console.log('getFiles error', err)
      })
    },
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