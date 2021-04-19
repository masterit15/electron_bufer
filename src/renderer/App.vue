<template>
  <div id="app">
    <component :is="layout">
      <router-view></router-view>
    </component>
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
import EmptyLayout from "./layout/Emptylayout.vue";
import MainLayout from "./layout/Mainlayout.vue";
export default {
  sockets: {
    connect: function () {
      if(this.user){
        this.$socket.emit('join_room', this.user.departamentName);
        this.$store.commit("addSidUser", {sid: this.$socket.id, room: this.user.departamentName});
      }
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
  computed: {
    ...mapGetters(['user']),
    layout() {
      return (this.$route.meta.layout || "empty") + "-layout";
    }
  },
  components: {
    EmptyLayout,
    MainLayout
  }
};
</script>
