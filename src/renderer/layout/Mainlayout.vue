<template>
  <div id="wrapper">
    <div id="container">
      <AppSidebar/>
      <div id="resizer"></div>
      <main id="main">
          <transition name="slide-fade">
            <router-view />
          </transition>
          <Uploader v-show="inputFiles.length > 0"/>
      </main>
      <AppRightBar/>
    </div>
  </div>
</template>
<script>
import AppRightBar from "../components/Header";
import AppSidebar from "../components/Sidebar";
import Uploader from "../components/FileUploader";
import { mapActions, mapGetters } from "vuex";
export default {
  sockets: {
    connect: function () {
      // this.$socket.emit('join_room', this.user.departamentName);
      if(this.user){
        this.$socket.emit("userJoined", this.user, data =>{
          if(typeof data === 'string'){
            console.error(data)
          }else{
            this.$store.commit('setUser', data.user)
          }
        });
      }
    },
    disconnect() {
      console.log("Пользователь отключился");
    },
  },
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
    ...mapGetters(["users", "files", "user", "activeFolderArr", "notimessage", "inputFiles"]),
    noticeMessages() {
      return this.notimessage || "";
    },
  },
  mounted() {
    this.resizeContent()
    let win = this.$electron.remote.getCurrentWindow();
    let holder = document.getElementById("main");
    holder.classList = "";
    // срабатывает, когда элемент будет перенесен на заданную зону (цель для переноса)
    holder.ondragenter = () => {
      holder.classList = "active";
      return false;
    };
    // срабатывает, когда элемент перемещают над допустимой зоной для переноса
    holder.ondragover = () => {
      // console.log(holder)
      return false;
    };
    // срабатывает в начале операции перетаскивания элемента
    holder.ondragstart = () => {
      return false;
    };
    // срабатывает, когда элемент выходит из допустимой зоны для переноса
    holder.ondragleave = () => {
      holder.classList = "";
      return false;
    };
    // срабатывает, когда элемент перетаскивается
    holder.ondrag = () => {
      return false;
    };
    // срабатывает после того, как перетаскиваемый элемент опустился на объект перетаскивания
    holder.ondrop = async (e) => {
      e.preventDefault();
      for (let f of e.dataTransfer.files) {
        this.$store.commit('setInputFiles', f)
        holder.classList = "";
      }
      return false;
    };
    // рабатывает, когда пользователь закончил перетаскивание элемента
    holder.ondragend = () => {
      return false;
    };
  },
  methods: {
    ...mapActions(["getDepartaments", "getUsers"]),
     resizeContent(){
      const resizer = document.querySelector("#resizer");
      const sidebar = document.querySelector("#sidebar");
      // const header = document.querySelector('#header')
      const main = document.querySelector('#main')
      const drag = document.querySelector(".file_form.is_active");
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
        // header.style.cssText = `width: ${main.offsetWidth}px`
        if(drag){
          drag.style.cssText = `width: ${main.offsetWidth}px`
        }
      }
      sidebar.style.flexBasis = "325px";
      // header.style.cssText = `width: ${main.offsetWidth}px`
      if(drag){
        drag.style.cssText = `width: ${main.offsetWidth}px`
      }
      window.addEventListener('resize', function(e){
        e.preventDefault();
        // header.style.cssText = `width: ${main.offsetWidth}px`
        if(drag){
          drag.style.cssText = `width: ${main.offsetWidth}px`
        }
      })
    }
  },
  components: {
    AppRightBar,
    AppSidebar,
    Uploader
  },
};
</script>