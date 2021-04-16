<template>
  <div id="home wrapper">
    <div id="container">
      <app-sidebar></app-sidebar>
      <div id="resizer"></div>
      <app-header></app-header>
      <main class="main-content mCustomScrollbar" id="main">
        <transition name="slide-fade">
          <router-view />
        </transition>
      </main>
    </div>
  </div>
</template>
<script>
import AppHeader from "../components/Header";
import AppSidebar from "../components/Sidebar";
import { mapActions, mapGetters } from "vuex";
export default {
  async created(){
    await this.getDepartaments();
    await this.getUsers();
  },
  watch: {
    fileSelectArr() {
      if (this.fileSelectArr.length > 0) {
        this.fileActionPanel = true;
      } else {
        this.fileActionPanel = false;
        this.$refs.chekone.checked = false;
      }
    },
    noticeMessages() {
      if (this.notimessage) {
        let { title, text, variant } = this.notimessage;
        this.$message(title, text, variant);
      }
    },
  },
  computed: {
    ...mapGetters(["users", "files", "user", "activeFolderArr", "notimessage"]),
    noticeMessages() {
      return this.notimessage || "";
    },
  },
  mounted() {
    this.resizeContent()
    this.$store.commit("addSidUser", {
      sid: this.$socket.id,
      room: this.user.departamentName,
    });
    this.$socket.emit("userJoined", {
      ...this.user,
      sid: this.$socket.id,
      room: this.udepartament,
    });
    let win = this.$electron.remote.getCurrentWindow();
    $(".mCustomScrollbar").mCustomScrollbar({
      autoHideScrollbar: true,
      scrollbarPosition: "inside",
    });
    
  },
  methods: {
    ...mapActions(["getDepartaments", "getUsers"]),
     resizeContent(){
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
    }
  },
  components: {
    AppHeader,
    AppSidebar,
  },
};
</script>