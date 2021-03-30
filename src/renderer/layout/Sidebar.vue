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
      <div class="folder_list_head" v-if="activeDepartament">
        <span class="folder_list_head_close" @click="activeDepartament = null"><i class="fa fa-chevron-left"></i> {{activeDepartament}}</span>
      </div>
    </transition>
    <transition-group v-if="!activeDepartament" name="slide-fade" tag="ul" class="folder_list" data-simplebar>
        <li
          class="folder_list_item"
          :class="activeDepartament == departament.id ? 'is_active' : ''"
          v-for="departament in departamentsList"
          :key="departament.id+'dep'"
          @click="departamentClick(departament)"
        >
          <span class="folder_list_item_name">{{ departament.name }} <i class="fa fa-chevron-right"></i></span>
        </li>
    </transition-group>
    <transition-group v-else  name="slide-fade" tag="ul" class="folder_list" data-simplebar>
        <li
          class="folder_list_item"
          :class="activeFolder == folder.id ? 'is_active' : ''"
          v-for="folder in folderList"
          :key="folder.id+'fol'"
          @click="folderClick(folder)"
        >
          <span class="folder_list_item_name"><i class="fa fa-folder-o"></i> {{ folder.name }} <i class="fa fa-chevron-right"></i></span>
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
      activeFolder: null,
      search: '',
      version: ''
    };
  },
  mounted() {
    const resizer = document.querySelector("#resizer");
    const sidebar = document.querySelector("#sidebar");
    const header = document.querySelector('#header')
    const main = document.querySelector('#main')

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
    }
    header.style.cssText = `width: ${main.offsetWidth}px`
    sidebar.style.flexBasis = "325px";
  },
  computed: {
    ...mapGetters(["departaments", "folders", "getFiles"]),
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
    ...mapActions(["getDepartaments", "getFolders"]),
    departamentClick(departament) {
      this.activeDepartament = departament.name;
      this.getFolders(departament.id);
    },
    folderClick(folder) {
      this.getFiles(folder.id)
    },
    
  },
};
</script>