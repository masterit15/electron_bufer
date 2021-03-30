<template>
https://github.com/johndyer24/electron-auto-update-example/blob/master/index.html
  <div id="app">
    <router-view></router-view>
    <div class="app_version">{{version}}</div>
    <div id="notification" class="hidden">
      <p id="message"></p>
      <button id="close-button" onClick="closeNotification()">
        Close
      </button>
      <button id="restart-button" onClick="restartApp()" class="hidden">
        Restart
      </button>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = require('electron');
import {mapGetters, mapActions} from 'vuex'
export default {
  name: "bufer",
  sockets: {
    connect: function () {
      console.log("socket connected");
    }
  },
  created(){
    this.getUsers()
    this.$socket.emit("userJoined", this.user)
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    ...mapActions(['getUsers']),
    chekUpdate(){
      let that = this 
      const version = document.getElementById('version');
      ipcRenderer.send('app_version');
      ipcRenderer.on('app_version', (event, arg) => {
        ipcRenderer.removeAllListeners('app_version');
        that.version = 'Version ' + arg.version;
      });


      const version = document.getElementById('version');
      const notification = document.getElementById('notification');
      const message = document.getElementById('message');
      const restartButton = document.getElementById('restart-button');
      
      ipcRenderer.send('app_version');
      ipcRenderer.on('app_version', (event, arg) => {
        ipcRenderer.removeAllListeners('app_version');
        version.innerText = 'Version ' + arg.version;
      });

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
