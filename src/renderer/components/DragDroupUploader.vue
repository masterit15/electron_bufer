<template>
  <div class="file_form" :class="files.length > 0 ? 'is_active' : ''">
    <div class="file_form_wrap">
      <div class="file_prev" v-show="files.length > 0">
        <div class="file_prev_wrap">
          <div class="file_prev_list mCustomScrollbar">
            <ul>
              <li v-for="(file, index) in files" :key="index">
                <span class="file_name">
                  <span :inner-html.prop="file.name|icon()"></span>
                  {{ file.name }}
                </span>
                <span class="file_size">
                  {{ file.size | size() }}
                </span>
                <span class="file_delete" @click="deleteFile(index)"
                  ><i class="fa fa-times"></i
                ></span>
              </li>
            </ul>
          </div>
        </div>
        <button class="btn file_btn" @click="uploadFiles">Загрузить</button>
      </div>
      <div id="drag-file" class="add_btn" @click="clickInput" :class="files.length > 0 ? 'is_active' : ''">
        <input type="file"  @change="addFiles" id="files_input" multiple />
        <span class="file_text">
          <h4>перетащите или кликните, что бы прикрепить файл(ы)</h4> 
          <i class="fa fa-upload"></i> 
        </span>
      </div>
    </div>
    <transition name="fade">
      <div class="loader" v-show="loader">
        <div class="file_prev_uploader">
          <div class="file_prev_uploader_percent">{{ percentFull }} %</div>
          <svg viewBox="0 0 100 100" style="display: block; width: 100%;">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#ffaa78" />
                <stop offset="100%" stop-color="#ff7b78" />
              </linearGradient>
            </defs>
            <path d="M 50,50 m 0,-47.5 a 47.5,47.5 0 1 1 0,95 a 47.5,47.5 0 1 1 0,-95" stroke="#ddd" stroke-width="5" fill-opacity="0"></path>
            <path class='xpath' d="M 50,50 m 0,-47.5 a 47.5,47.5 0 1 1 0,95 a 47.5,47.5 0 1 1 0,-95" stroke="url(#gradient)" stroke-width="5" fill-opacity="0" style="stroke-dasharray: 300, 300; stroke-dashoffset: 300;"></path>
          </svg>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
const { ipcRenderer } = require("electron");
import fs from 'fs'
import os from 'os'
import { mapActions, mapGetters } from "vuex";
import axios from 'axios'
export default {
  data() {
    return {
      files: [],
      percent: 0,
      percentFull: 0,
      loader: false
    };
  },
  watch: {
    // percent(){
    //   let dashArray = document.querySelector('.xpath').style.strokeDasharray.split(',')[0]
    //   let dashOffset = document.querySelector('.xpath')
    //   dashOffset.style.strokeDashoffset = `${(dashArray-(dashArray*this.percentFull/100))}px`
    //   if(this.percent == 0 || this.percent == 1){
    //     this.$electron.remote.getCurrentWindow().setProgressBar(-1)
    //     let that = this
    //     function done() {
    //       return new Promise(function(resolve, reject) {
    //         setTimeout(()=>{
    //           that.loader = false
    //           resolve(that.loader)
    //         }, 200)
    //       });
    //     }
    //     done().then(res=>{
    //       console.log(res);
    //       if(!res) this.files = []
    //       this.getFiles(this.activeFolderArr.id)
    //     })
    //   }else{
    //     this.$electron.remote.getCurrentWindow().setProgressBar(this.percent)
    //     this.loader = true
    //   }
    // }
  },
  mounted() {
    // console.log(this.$electron.remote.getCurrentWindow().setProgressBar(-1))
    let holder = document.getElementById("main");
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
    progressAnimation(){
      let dashArray = document.querySelector('.xpath').style.strokeDasharray.split(',')[0]
      let dashOffset = document.querySelector('.xpath')
      dashOffset.style.strokeDashoffset = `${(dashArray-(dashArray*this.percentFull/100))}px`
      if(this.percent == 0 || this.percent == 1){
        this.$electron.remote.getCurrentWindow().setProgressBar(-1)
        let that = this
        function done() {
          return new Promise(function(resolve, reject) {
            setTimeout(()=>{
              that.loader = false
              resolve(that.loader)
            }, 200)
          });
        }
        done().then(res=>{
          if(!res) this.files = []
          this.getFiles(this.activeFolderArr.id)
        })
      }else{
        this.$electron.remote.getCurrentWindow().setProgressBar(this.percent)
        this.loader = true
      }
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
          that.progressAnimation()
        }
      }
      axios.post(`file?folderId=${this.activeFolderArr.id}&ownerId=${this.user.id}&ownerName=${this.user.username}`, data, config)
      .then(async res=>{
        if(res.data.success){
          let user = this.users.find(user=>user.id==this.activeFolderArr.userId)
          let data = {
            ...user,
            files: []
          }
          this.files.forEach(file=>{
            data.files.push(file.name) 
          })
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