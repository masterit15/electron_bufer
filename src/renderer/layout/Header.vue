<template>
  <div id="header">
    <div class="user_container">
      <div class="user" @click="Outh">
        <avatar :username="user.login" :size="42"></avatar>
        <span class="user_name">{{user.username}}</span>
      </div>
        <!-- <u class="dropdown">
          <li>dropdown</li>
          <li>dropdown</li>
          <li @click="logout">Выйти</li>
        </u> -->
      <Notifycation />
    </div>
  </div>
</template>
<script>
import Notifycation from '@/components/Notifycation'
import {mapGetters, mapActions} from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    ...mapActions(['logout']),
  },
  components: {
    Notifycation
  },
  methods: {
    async Outh(){
      // await this.logout()
      localStorage.removeItem('user')
      this.$socket.emit("userLeft", this.user)
      this.$router.push('/auth')
    }
  }
}
</script>