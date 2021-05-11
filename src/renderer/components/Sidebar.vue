<template>
  <div id="sidebar">
    <div class="logo nontextselect dragselect">
      <img src="../assets/logo.png" alt="logo" />
      <h2>BUFER</h2>
    </div>
    <div class="search">
      <i class="fa fa-search"></i>
      <input type="search" v-model="search" id="" placeholder="Поиск" />
    </div>
    <transition name="slide-fade">
      <div class="folder_list_head" v-if="activeDepartament" @click="departamentClose">
        <span class="folder_list_head_close" ><i class="fa fa-chevron-left"></i> <i class="fa fa-folder-open-o" ></i>{{activeDepartament.name}} </span>
      </div>
    </transition>
    <transition-group v-if="!activeDepartament" name="slide-fade" tag="ul" class="folder_list">
        <li
          class="folder_list_item"
          :class="activeDepartament == departament.id ? 'is_active' : ''"
          v-for="departament in departamentsList"
          :key="departament.id+'dep'"
          @click="departamentClick(departament)"
        >
            <div class="folder_list_item_name">
              <span class="folder_list_item_name_text"><i class="fa fa-folder-o"></i> {{ departament.name }}</span>
              <span class="folder_list_item_name_icon"><i class="fa fa-chevron-right"></i></span>
            </div>
        </li>
    </transition-group>
    <transition-group v-else  name="slide-fade" tag="ul" class="folder_list">
        <li
          class="folder_list_item"
          :class="isActiveFolder == folder.id ? 'is_active' : ''"
          v-for="(folder, index) in folderList"
          :key="index+'fol'"
          @click="folderClick(folder)"
        >
          <div class="folder_list_item_name">
            <span class="folder_list_item_name_text"><span v-html="online(folder.userId)"></span> {{ folder.name }}</span>
            <span class="folder_list_item_name_icon"><i class="fa fa-chevron-right"></i></span>
          </div>
        </li>
    </transition-group>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      isActiveFolder: null,
      search: '',
      version: ''
    };
  },
  computed: {
    ...mapGetters(["departaments", "folders", "users", "activeDepartament"]),
    departamentsList() {
      return this.departaments.filter((departament) => {
        return departament.name
          .toLowerCase()
          .includes(this.search.toLowerCase());
      });
    },
    folderList() {
      return this.folders.filter((folder) => {
        return folder.name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
  },
  methods: {
    ...mapActions(["getDepartaments", "getFolders", "getFiles", "activateFolder"]),
    online(userId){
      let user = this.users.find(user=>Number(user.id) === Number(userId))
      if(user && user.online == 'Y'){
          return '<i class="fa fa-folder" style="color:#7bd158"></i>'
      }
      return '<i class="fa fa-folder-o" style="color:#252831"></i>'
    },
    async departamentClick(departament) {
      this.$store.commit('setActiveDepartament', departament)
      await this.getFolders(departament.id);
    },
    departamentClose(){
      this.$store.commit('setActiveDepartament', null)
    },
    folderClick(folder) {
      this.$store.commit('setActiveFolder', folder)
      this.getFiles(folder.id)
    }
  },
};
</script>