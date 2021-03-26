<template>
  <div id="sidebar">
    <div class="logo">
      <img src="../assets/logo.png" alt="logo">
      <h2>BUFER</h2>
    </div>
    <div class="search">
      <i class="fa fa-search"></i>
      <input type="search" v-model="search" id="" placeholder="Поиск">
    </div>
    <ul class="dir_list">
      <li :class="activeDepartament == departament.id ? 'is_active' : ''" v-for="(departament, index) in departamentsList" :key="index" @click="dirClick(departament)">{{departament.name}}</li>
    </ul>
  </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
export default {
  data() {
    return {
      activeDepartament: null,
      search: ''
    }
  },
  computed: {
    ...mapGetters(['departaments']),
    departamentsList(){
      return this.departaments.filter(departament => {
        return departament.name.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  mounted() {

  },
  methods: {
    dirClick(departament){
      this.activeDepartament = departament.id
      this.$emit('dir', dir)
    }
  },
}
</script>