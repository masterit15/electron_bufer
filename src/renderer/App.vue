<template>
  <div id="app">
    <router-view></router-view>
    <div class="app_version">{{ version }}</div>
    <div id="updatenotification" v-show="updateNotification">
      <h5 id="messagetitle">{{ messageTitle }}</h5>
      <p id="message">{{ message }}</p>
      <div id="actionblock">
      <button id="button-close" @click="closeNotification">Закрыть</button>
      <button id="button-restart" @click="restartApp">Перезагрузить</button>
      </div>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");
import { mapGetters } from "vuex";
export default {
  sockets: {
    connect: function () {
      this.$socket.emit('join_room', this.user.departamentName);
      this.$store.commit("addSidUser", {sid: this.$socket.id, room: this.user.departamentName});
    },
    disconnect() {
      console.log("Пользователь отключился");
    },
  },
  name: "bufer",
  data() {
    return {
      message: "",
      messageTitle: "",
      version: "",
      updateNotification: false
    };
  },
  mounted() {
    this.chekUpdate();
  },
  watch: {
    noticeMessages() {
      let {title, text, variant} = this.notimessage
      this.$message(title, text, variant);
    },
  },
  computed: {
    ...mapGetters(["user", "notimessage"]),
    noticeMessages() {
      return this.notimessage;
    },
  },

  methods: {
    chekUpdate() {
      let that = this;
      ipcRenderer.send("app_version");
      ipcRenderer.on("app_version", (event, arg) => {
        ipcRenderer.removeAllListeners("app_version");
        that.version = "Версия " + arg.version;
      });
      const restartButton = document.querySelector('#button-restart');
      ipcRenderer.on("update_available", () => {
        ipcRenderer.removeAllListeners("update_available");
        that.messageTitle = "Доступно обновление."
        that.message = "Скачиваю прямо сейчас...";
        that.updateNotification = true
      });
      ipcRenderer.on("update_downloaded", () => {
        ipcRenderer.removeAllListeners("update_downloaded");
        that.messageTitle = "Обновление скачано"
        that.message = "Обновление будет установлен при перезагрузке. Перезагрузить сейчас?";
        restartButton.classList.remove("hidden");
        // that.updateNotification = false
      });
    },
    closeNotification() {
      this.updateNotification = false
    },
    restartApp() {
      ipcRenderer.send("restart_app");
    },
  },
};
</script>
