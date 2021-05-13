<template>
  <div class="file_form">
    <div class="file_form_wrap" v-show="inputFiles.length > 0">
      <h4 class="file_wrap_text">
        перетащите или кликните, что бы прикрепить файл(ы)
      </h4>
      <div class="file_list">
        <ul>
          <li v-for="(file, index) in inputFiles" :key="index">
            <span class="file_name">
              <span :inner-html.prop="file.name | icon()"></span>
              {{ file.name }}
            </span>
            <span class="file_size">
              {{ file.size | size() }}
            </span>
            <span class="file_delete" @click="deleteFile(file)"
              ><i class="fa fa-times"></i
            ></span>
          </li>
        </ul>
      </div>
      <div class="file_actions">
        <button class="btn file_btn" @click="uploadFiles">Загрузить</button>
        <button class="btn file_btn" @click="clickInput">Прикрепить еще</button>
        <button class="btn file_btn" @click="clearInput">Очистить</button>
      </div>
    </div>
    <transition name="fade">
      <div class="loader" v-show="loader">
        <div class="file_uploader">
          <div class="file_uploader_percent">{{ percentFull }} %</div>
          <svg viewBox="0 0 100 100" style="display: block; width: 100%">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#ffaa78" />
                <stop offset="100%" stop-color="#ff7b78" />
              </linearGradient>
            </defs>
            <path
              d="M 50,50 m 0,-47.5 a 47.5,47.5 0 1 1 0,95 a 47.5,47.5 0 1 1 0,-95"
              stroke="#ddd"
              stroke-width="5"
              fill-opacity="0"
            ></path>
            <path
              class="xpath"
              d="M 50,50 m 0,-47.5 a 47.5,47.5 0 1 1 0,95 a 47.5,47.5 0 1 1 0,-95"
              stroke="url(#gradient)"
              stroke-width="5"
              fill-opacity="0"
              style="stroke-dasharray: 300, 300; stroke-dashoffset: 300"
            ></path>
          </svg>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
export default {
  props: {
    files: Array,
  },
  data() {
    return {
      percent: 0,
      percentFull: 0,
      loader: false,
    };
  },
  computed: {
    ...mapGetters(["users", "user", "activeFolderArr", "inputFiles"]),
  },
  methods: {
    ...mapActions(["getFiles"]),
    clickInput() {
      let input = document.querySelector(".file_input");
      input.click();
    },
    addFiles(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.$store.commit("setInputFiles", files);
    },
    deleteFile(file) {
      this.$store.commit("deleteInputFiles", file);
    },
    clearInput(){
      let input = document.querySelector(".file_input");
      input.value = ''
      this.$store.commit("deleteInputFiles", null);
    },
    progressAnimation() {
      let dashArray = document
        .querySelector(".xpath")
        .style.strokeDasharray.split(",")[0];
      let dashOffset = document.querySelector(".xpath");
      dashOffset.style.strokeDashoffset = `${
        dashArray - (dashArray * this.percentFull) / 100
      }px`;
      if (this.percent == 0 || this.percent == 1) {
        this.$electron.remote.getCurrentWindow().setProgressBar(-1);
        let that = this;
        function done() {
          return new Promise(function (resolve, reject) {
            setTimeout(() => {
              that.loader = false;
              resolve(that.loader);
            }, 200);
          });
        }
        done().then((res) => {
          if (!res) this.$store.commit("deleteInputFiles", null);
          this.getFiles(this.activeFolderArr.id);
        });
      } else {
        this.$electron.remote.getCurrentWindow().setProgressBar(this.percent);
        this.loader = true;
      }
    },
    async uploadFiles() {
      let data = new FormData();
      let that = this;
      for (const file of this.inputFiles) {
        data.append("files", file);
      }
      const config = {
        onUploadProgress: function (progressEvent) {
          that.percentFull = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          that.percent =
            Math.round((progressEvent.loaded * 100) / progressEvent.total) /
            100;
          that.progressAnimation();
        },
      };
      axios
        .post(
          `http://localhost:5050/api/file?folderId=${this.activeFolderArr.id}&ownerId=${this.user.id}&ownerName=${this.user.username}`,
          data,
          config
        )
        .then(async (res) => {
          if (res.data.success) {
            let user = this.users.find(
              (user) => user.id == this.activeFolderArr.userId
            );
            let data = {
              ...user,
              files: [],
            };
            this.inputFiles.forEach((file) => {
              data.files.push(file.name);
            });
            this.$socket.emit("userAddFiles", data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>