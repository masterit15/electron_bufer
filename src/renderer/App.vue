<template>
  <div id="app">
    <Form v-if="!user"/>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import Form from "@/components/Form";
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
  },
  components: {
    Form,
  },
};
</script>
