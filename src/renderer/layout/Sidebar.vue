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
    <div class="folder_list_head" v-if="activeDepartament">
      <span class="folder_list_head_close" @click="activeDepartament = null"><i class="fa fa-chevron-left"></i></span>
      <h3 class="folder_list_head_title">{{activeDepartament}}</h3>
    </div>
    <transition-group v-if="!activeDepartament" name="slide-fade" tag="ul" class="folder_list">
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
    <transition-group v-else  name="slide-fade" tag="ul" class="folder_list">
        <li
          class="folder_list_item"
          :class="activeFolder == folder.id ? 'is_active' : ''"
          v-for="folder in folderList"
          :key="folder.id+'fol'"
          @click="folderClick(folder)"
        >
          <span class="folder_list_item_name">{{ folder.name }} <i class="fa fa-chevron-right"></i></span>
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
    }
    sidebar.style.flexBasis = "325px";
  },
  computed: {
    ...mapGetters(["departaments", "folders"]),
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
      this.activeFolder = folder.id;
      this.$emit("folder", folder);
    },
    
  },
};
</script>