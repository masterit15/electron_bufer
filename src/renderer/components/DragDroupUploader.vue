<template>
  <div class="addfileform">
    <div class="file_form">
      <div class="file_prev" v-if="files.length > 0">
        <ul>
          <li v-for="(file, index) in files" :key="index">
            <i class="fa fa-file"></i> {{ file.name }}
            <span class="file_delete" @click="deleteFile(index)"
              ><i class="fa fa-times"></i
            ></span>
          </li>
        </ul>
        <button @click="uploadFiles">Загрузить</button>{{ percent }}
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
    };
  },
  watch: {
    percent(){
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
    ...mapGetters(['user', 'activeFolderArr'])
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
          that.percent = Math.round((progressEvent.loaded * 100) / progressEvent.total) / 100
        }
      }
      axios.post(`http://localhost:5050/api/file?folderId=${this.activeFolderArr.id}&ownerId=${this.user.id}&ownerName=${this.user.username}`, data, config)
      .then(res=>{
        if(res.data.success){
          let data = {
            userId: this.activeFolderArr.userId,
            ownerName: this.user.username,
            files: []
          }
          this.files.forEach(file=>{
            data.files.push(file.name) 
          })
          this.$socket.emit("userAddFiles", data)
          this.getFiles(this.activeFolderArr.id)
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