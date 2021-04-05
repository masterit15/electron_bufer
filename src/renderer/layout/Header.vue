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
    ...mapGetters(["user"]),
  },
  methods: {
    ...mapActions(["logout"]),
  },
  components: {
    Notifycation,
  },
  methods: {
    async Outh() {
      // await this.logout()
<<<<<<< HEAD
      localStorage.removeItem("user");
      this.$socket.emit("userLeft", this.user);
      this.$router.push("/auth");
    },
  },
};
=======
      localStorage.removeItem('user')
      this.$socket.emit("userLeft", this.user)
      // this.$store.replaceState({})
      this.$router.push('/auth')
    }
  }
}
>>>>>>> 48c32c0643262eb3be3c95b3a1086dcd08d1413b
</script>