import axios from 'axios'

export default {
  actions: {
    upload({}, files) {
      let percentCompleted
      const config = {
        onUploadProgress: function(progressEvent) {
          percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          console.log(percentCompleted)
        }
      }
      let data = new FormData()
      data.append('files', files)
      axios.post('http://localhost:5050/api/upload', data, config)
      return percentCompleted
    }
  }
}