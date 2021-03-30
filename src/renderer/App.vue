<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
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
    ...mapActions(['getUsers'])
  }
};
</script>
