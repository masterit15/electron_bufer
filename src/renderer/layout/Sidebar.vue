<template>
  <div id="sidebar">
    <div class="logo">
      <img src="../assets/logo.png" alt="logo" />
      <h2>BUFER</h2>
    </div>
    <div class="search">
      <i class="fa fa-search"></i>
      <input type="search" v-model="search" id="" placeholder="Поиск" />
    </div>
    <transition name="slide-fade">
      <div class="folder_list_head" v-if="activeDepartament" @click="activeDepartament = null">
        <span class="folder_list_head_close" ><i class="fa fa-chevron-left"></i> <i class="fa fa-folder-open-o" ></i>{{activeDepartament}} </span>
      </div>
    </transition>
    <transition-group v-if="!activeDepartament" name="slide-fade" tag="ul" class="folder_list mCustomScrollbar" data-mcs-theme="dark">
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
    <transition-group v-else  name="slide-fade" tag="ul" class="folder_list mCustomScrollbar" data-mcs-theme="dark">
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
      activeDepartament: '',
      isActiveFolder: null,
      search: '',
      version: ''
    };
  },
  mounted() {
    const resizer = document.querySelector("#resizer");
    const sidebar = document.querySelector("#sidebar");
    const header = document.querySelector('#header')
    const main = document.querySelector('#main')
    const drag = document.querySelector(".addfileform");
    const body    = document.querySelector('body')
    resizer.addEventListener("mousedown", (event) => {
      resizer.classList.add('is_active')
      body.classList.add('nontextselect')
      document.addEventListener("mousemove", resize, false);
      document.addEventListener(
        "mouseup",
        () => {
          
          resizer.classList.remove('is_active')
          body.classList.remove('nontextselect')
          document.removeEventListener("mousemove", resize, false);
        },
        false
      );
    });

    function resize(e) {
      const size = `${e.x}px`;
      sidebar.style.flexBasis = size;
      header.style.cssText = `width: ${main.offsetWidth}px`
      drag.style.cssText = `width: ${main.offsetWidth}px`
    }
    sidebar.style.flexBasis = "325px";
    header.style.cssText = `width: ${main.offsetWidth}px`
    drag.style.cssText = `width: ${main.offsetWidth}px`
    window.addEventListener('resize', function(e){
      e.preventDefault();
      header.style.cssText = `width: ${main.offsetWidth}px`
      drag.style.cssText = `width: ${main.offsetWidth}px`
    })
  },
  computed: {
    ...mapGetters(["departaments", "folders", "users"]),
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
  created() {
    this.getDepartaments();
  },
  methods: {
    ...mapActions(["getDepartaments", "getFolders", "getFiles", "activateFolder"]),
    online(userId){
      let user = this.users.find(user=> user.id == userId)
      if(user.online == 'Y'){
          return '<i class="fa fa-folder" style="color:#7bd158"></i>'
      }
      return '<i class="fa fa-folder-o" style="color:#252831"></i>'
    },
    departamentClick(departament) {
      this.activeDepartament = departament.name;
      this.getFolders(departament.id);
    },
    folderClick(folder) {
      // this.$emit("folder");
      // this.activateFolder(folder)
      this.$store.commit('setActiveFolder', folder)
      this.getFiles(folder.id)
    },
    
  },
};
</script>