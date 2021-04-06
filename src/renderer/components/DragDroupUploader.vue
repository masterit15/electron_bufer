<template>
  <div class="addfileform" :class="files.length > 0 ? 'is_active' : ''">
    <div class="file_form">
      <div class="file_prev" v-show="files.length > 0">
        <div class="file_prev_wrap">
          <div class="file_prev_list">
            <ul>
              <li v-for="(file, index) in files" :key="index">
                <i class="fa fa-file"></i> {{ file.name }}
                <span class="file_delete" @click="deleteFile(index)"
                  ><i class="fa fa-times"></i
                ></span>
              </li>
            </ul>
          </div>
          <div class="file_prev_uploader">
              <div class="file_prev_uploader_percent">{{ percentFull }} %</div>
              <svg viewBox="0 0 100 100" style="display: block; width: 100%;">
                <path d="M 50,50 m 0,-47.5 a 47.5,47.5 0 1 1 0,95 a 47.5,47.5 0 1 1 0,-95" stroke="#ddd" stroke-width="5" fill-opacity="0"></path>
                <path class='xpath' d="M 50,50 m 0,-47.5 a 47.5,47.5 0 1 1 0,95 a 47.5,47.5 0 1 1 0,-95" stroke="#ff6347" stroke-width="5" fill-opacity="0" style="stroke-dasharray: 300, 300; stroke-dashoffset: 300;"></path></svg>
          </div>
        </div>
        <button @click="uploadFiles">Загрузить</button>
      </div>
      <div id="drag-file" class="add_btn" @click="clickInput">
        <input type="file" @change="addFiles" id="files_input" multiple />
        <span class="file_text">перетащите или кликните, что бы прикрепить файл(ы) <i class="fa fa-upload"></i> </span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import axios from 'axios'
export default {
  data() {
    return {
      files: [],
      percent: 0,
      percentFull: 0
    };
  },
  watch: {
    percent(){
      let dashArray = document.querySelector('.xpath').style.strokeDasharray.split(',')[0]
      let dashOffset = document.querySelector('.xpath')
      dashOffset.style.strokeDashoffset = `${(dashArray-(dashArray*this.percentFull/100))}px`
      if(this.percent == 0 || this.percent == 1){
        this.$electron.remote.getCurrentWindow().setProgressBar(-1)
      }else{
        this.$electron.remote.getCurrentWindow().setProgressBar(this.percent)
        
      }
    }
  },
  mounted() {
    // console.log(this.$electron.remote.getCurrentWindow().setProgressBar(-1))
    
    let holder = document.getElementById("drag-file");
    holder.classList = "";
    // срабатывает, когда элемент будет перенесен на заданную зону (цель для переноса)
    holder.ondragenter = () => {
      holder.classList = "active";
      return false;
    };
    // срабатывает, когда элемент перемещают над допустимой зоной для переноса
    holder.ondragover = () => {
      // console.log(holder)
      return false;
    };
    // срабатывает в начале операции перетаскивания элемента
    holder.ondragstart = () => {
      return false;
    };
    // срабатывает, когда элемент выходит из допустимой зоны для переноса
    holder.ondragleave = () => {
      holder.classList = "";
      return false;
    };
    // срабатывает, когда элемент перетаскивается
    holder.ondrag = () => {
      return false;
    };
    // срабатывает после того, как перетаскиваемый элемент опустился на объект перетаскивания
    holder.ondrop = async (e) => {
      e.preventDefault();
      for (let f of e.dataTransfer.files) {
        this.files.push(f);
        holder.classList = "";
      }
      return false;
    };
    // рабатывает, когда пользователь закончил перетаскивание элемента
    holder.ondragend = () => {
      return false;
    };
  },
  computed: {
    ...mapGetters(['users','user', 'activeFolderArr'])
  },
  methods: {
    ...mapActions(["getFiles"]),
    clickInput() {
      let input = document.getElementById("files_input");
      input.click();
    },
    addFiles(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.files.push(...files);
    },
    deleteFile(index) {
      this.files.splice(index, 1);
    },
    async uploadFiles() {
      let data = new FormData()
      let that = this
      for(const file of this.files){
        data.append('files', file)
      }
      const config = {
        onUploadProgress: function(progressEvent) {
          that.percentFull = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          that.percent = Math.round((progressEvent.loaded * 100) / progressEvent.total) / 100
        }
      }
      axios.post(`http://localhost:5050/api/file?folderId=${this.activeFolderArr.id}&ownerId=${this.user.id}&ownerName=${this.user.username}`, data, config)
      .then(res=>{
        if(res.data.success){
          let user = this.users.find(user=>user.id==this.activeFolderArr.userId)
          let data = {
            ...user,
            files: []
          }
          this.files.forEach(file=>{
            data.files.push(file.name) 
          })
          console.log(data)
          this.getFiles(this.activeFolderArr.id)
          this.$socket.emit("userAddFiles", data)
        }
      })
      .catch(err=>{
        console.log(err)
      })
    },
  },
};
</script>
<style lang="sass">
#files_input
  display: none
.file
  &_form
</style>