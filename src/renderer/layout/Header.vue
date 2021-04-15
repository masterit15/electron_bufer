<template>
  <div id="header">
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
    ...mapGetters(['user', 'users']),
  },
  methods: {
    ...mapActions(['logout', 'getDepartaments', 'getUsers']),
  },
  components: {
    Notifycation,
  },
  methods: {
    resetState(){
      let state = this.$store.state;
      let newState = {};
      Object.keys(state).forEach(key => {
        if(key !== 'departament'){
          // newState.push(`${key}s`)
          newState[`${key}s`] = []
        }
      });
      console.log(newState);
      this.$store.replaceState(newState);
    },
    async Outh() {
      // await this.logout()
      this.resetState()
      localStorage.removeItem("user");
      this.$socket.emit("userLeft", this.user);
      this.$router.push("/auth");
    },
  },
};
</script>