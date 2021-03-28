<template>
  <div id="app">
    <Form/>
    <router-view></router-view>
  </div>
</template>

<script>
import Form from "@/components/Form";
export default {
  name: "bufer",
  sockets: {
    connect: function () {
      console.log("socket connected");
    }
  },
  created(){
    //this.$socket.emit("userJoined", userInfo)
  },
  components: {
    Form,
  },
};
</script>
