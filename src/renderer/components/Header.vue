<template>
  <div id="header" class="nontextselect">
    <div class="user_container">
      <b-dropdown variant="link" toggle-class="text-decoration-none" no-caret>
        <template #button-content>
          <div class="user" v-b-tooltip.hover :title="user.username">
            <avatar :username="user.login" :size="42"></avatar>
          </div>
        </template>
        <b-dropdown-item href="#">Action</b-dropdown-item>
        <b-dropdown-item href="#">Личные данные</b-dropdown-item>
        <b-dropdown-item href="#" @click="Outh">Выйти</b-dropdown-item>
      </b-dropdown>
      <Notifycation />
    </div>
    <div class="file_add_btn" @click="clickInput">
      <input type="file"  @change="addFiles" class="file_input" multiple />
      <span class="file_text">
        <i class="fa fa-upload"></i> 
      </span>
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
  methods: {
    ...mapActions(['logout']),
  },
  components: {
    Notifycation,
    DragDroup
  },
  methods: {
    async Outh() {
      this.$socket.emit("userLeft", this.user);
      this.resetState()
      this.$router.push("/auth");
    },
    clickInput() {
      let input = document.querySelector(".file_input");
      input.click();
    },
    addFiles(e) {
      let files = e.target.files || e.dataTransfer.files;
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