<template>
  <div id="app">
      <Form/>
      <router-view></router-view>
  </div>
</template>

<script>
import os from 'os'
const username = os.userInfo().username
import Form from '@/components/Form'
export default {
  name: "bufer",
  components: {
    Form
  }
}
</script>
