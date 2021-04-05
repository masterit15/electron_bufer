<template>
  <div id="app">
    <router-view></router-view>
    <div class="app_version">{{version}}</div>
    <div id="notification" class="hidden" ref="notification">
      <p id="message"></p>
      <button id="close-button" @click="closeNotification" ref="close">
        Закрыть
      </button>
      <button id="restart-button" @click="restartApp" class="hidden" ref="restart">
        Перезагрузить
      </button>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = require('electron');
import {mapGetters, mapActions} from 'vuex'
export default {
  name: "bufer",
  data(){
    return {
      message: '',
      version: ''
    }
  },
  methods: {
    chekUpdate(){
      let that = this 
      ipcRenderer.send('app_version');
      ipcRenderer.on('app_version', (event, arg) => {
        ipcRenderer.removeAllListeners('app_version');
        that.version = 'Version ' + arg.version;
      });
      this.l
      const notification = this.$refs.notification.target;
      const restartButton = this.$refs.restart.target;
      ipcRenderer.on('update_available', () => {
        ipcRenderer.removeAllListeners('update_available');
        that.message = 'Доступно новое обновление. Скачиваю прямо сейчас...';
        notification.classList.remove('hidden');
      });

      ipcRenderer.on('update_downloaded', () => {
        ipcRenderer.removeAllListeners('update_downloaded');
        that.message = 'Обновление Загружено. Он будет установлен при перезагрузке. Перезагрузить сейчас?';
        restartButton.classList.remove('hidden');
        notification.classList.remove('hidden');
      });
    },
    closeNotification() {
      notification.classList.add('hidden');
    },
    restartApp() {
      ipcRenderer.send('restart_app');
    }
  }
};
</script>
