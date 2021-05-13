<template>
  <div id="app">
    <div class="window_border dragselect nontextselect">
      <div class="window_border_folder" v-if="activeFolderArr">Текущая директория: {{activeFolderArr.name}}</div>
      <div class="window_border_action">
        <button class="window_border_action_btn_hide" @click="resizeApp('rollup')"></button>
        <button class="window_border_action_btn_size" @click="resizeApp('resize')"></button>
        <button class="window_border_action_btn_close" @click="resizeApp('close')"></button>
      </div>
    </div>
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
const { ipcRenderer, remote } = require("electron");
import { mapGetters } from "vuex";
import EmptyLayout from "./layout/Emptylayout.vue";
import MainLayout from "./layout/Mainlayout.vue";
export default {
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
    document.addEventListener("keydown", function (e) {
      if (e.which === 123) {
        remote.getCurrentWindow().toggleDevTools();
      }
    })
  },
  methods: {
    resizeApp(param){
      let win = this.$electron.remote.getCurrentWindow()
      if(param == 'close'){
        // win.close()
        ipcRenderer.send("quit-app");
      }else if(param == "resize"){
        if (!win.isMaximized()) {
            win.maximize();          
        } else {
            win.unmaximize();
        }
      }else if(param = 'rollup'){
        win.minimize()
      }
    },
    
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
    ...mapGetters(['user', 'activeFolderArr']),
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
