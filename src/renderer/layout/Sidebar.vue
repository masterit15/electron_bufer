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
    <ul v-if="!activeDepartament" class="departament_list">
      <li :class="activeDepartament == departament.id ? 'is_active' : ''" v-for="(departament, index) in departamentsList" :key="index" @click="departamentClick(departament)">{{departament.name}}</li>
    </ul>
    <ul else class="folder_list">
      <li :class="activeFolder == folder.id ? 'is_active' : ''" v-for="(folder, index) in folderList" :key="index" @click="folderClick(folder)">{{folder.name}}</li>
    </ul>
  </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
export default {
  data() {
    return {
      activeDepartament: null,
      activeFolder: null,
      search: ''
    }
  },
  computed: {
    ...mapGetters(['departaments', 'folders']),
    departamentsList(){
      return this.departaments.filter(departament => {
        return departament.name.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    folderList(){
      return this.folders.filter(folder => {
        return folder.name.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  created() {
    this.getDepartaments()
  },
  methods: {
    ...mapActions(['getDepartaments', 'getFolders']),
    departamentClick(departament){
      this.activeDepartament = departament.id
      this.getFolders(departament.id)
    },
    folderClick(folder){
      activeFolder = folder.id
      this.$emit('folder', departament)
    }
  },
}
</script>