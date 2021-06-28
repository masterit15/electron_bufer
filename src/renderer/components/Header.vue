<template>
  <div id="header" class="nontextselect">
    <div class="user_container">
      <b-dropdown variant="link" toggle-class="text-decoration-none" no-caret>
        <template #button-content>
          <div class="user">
            <!-- v-b-tooltip.hover :title="user.username" -->
            <div class="avatar" v-if="user.avatar" 
            :style="{backgroundImage: `url(http://10.20.0.41/static/${user.avatar})`}"
            ></div>
            <avatar v-else :username="user.login" :size="42"></avatar>
          </div>
        </template>
        <b-dropdown-item href="#">Action</b-dropdown-item>
        <b-dropdown-item href="#">Личные данные</b-dropdown-item>
        <b-dropdown-item href="#" @click="Outh">Выйти</b-dropdown-item>
      </b-dropdown>
      <Notifycation />
    </div>
    <div class="circle" >
      <input type="file"  @change="addFiles" ref="files" class="file_input" multiple />
      <span class="circle__btn" @click="clickInput">
        <i class="fa fa-upload"></i>
      </span>
      <span class="circle__back-1"></span>
      <span class="circle__back-2"></span>
    </div>
  </div>
</template>
<script>
import Notifycation from "@/components/Notice";
import DragDroup from "@/components/DragDroupUploader";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['user', 'users', 'activeFolderArr', 'inputFiles']),
  },
  components: {
    Notifycation,
    DragDroup
  },
  methods: {
    ...mapActions(['logOut']),
    async Outh() {
      await this.logOut(this.user.token)
      this.$socket.emit("userLeft", this.user);
      this.resetState()
      this.$router.push("/auth");
    },
    clickInput() {
      let play = document.querySelector('.play');
      let pause = document.querySelector('.pause');
      let playBtn = document.querySelector('.circle__btn');
      let wave1 = document.querySelector('.circle__back-1');
      let wave2 = document.querySelector('.circle__back-2');
      let input = document.querySelector(".file_input");
      input.value = ''
      input.click();

      // pause.classList.toggle('visibility');
      // play.classList.toggle('visibility');
      // playBtn.classList.toggle('shadow');
      // wave1.classList.toggle('paused');
      // wave2.classList.toggle('paused');
    },
    addFiles(e) {
      
      let files = this.$refs.files.files // e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      
      this.$store.commit('setInputFiles', files)
    },
    resetState(){
        this.$store.commit('setUser', [])
        this.$store.commit('setUsers', [])
        this.$store.commit('setFiles', [])
        this.$store.commit('setFolders', [])
        this.$store.commit('setDepartaments', [])
        localStorage.removeItem("user")
    },
  },
};
</script>