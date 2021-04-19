<template>
  <div id="header">
    <div class="folder_name"><h3 v-if="activeFolderArr">{{activeFolderArr.name}}</h3></div>
    <div class="user_container">
      <b-dropdown variant="link" toggle-class="text-decoration-none" no-caret>
        <template #button-content>
          <div class="user">
            <avatar :username="user.login" :size="42"></avatar>
            <span class="user_name">{{ user.username }}</span>
          </div>
        </template>
        <b-dropdown-item href="#">Action</b-dropdown-item>
        <b-dropdown-item href="#">Личные данные</b-dropdown-item>
        <b-dropdown-item href="#" @click="Outh">Выйти</b-dropdown-item>
      </b-dropdown>
      <Notifycation />
    </div>
  </div>
</template>
<script>
import Notifycation from "@/components/Notifycation";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['user', 'users', 'activeFolderArr']),
  },
  methods: {
    ...mapActions(['logout']),
  },
  components: {
    Notifycation,
  },
  methods: {
    async Outh() {
      this.$socket.emit("userLeft", this.user);
      this.resetState()
      this.$router.push("/auth");
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