<template>
  <div class="form" :style="{backgroundImage: `url(${bgImage})`}">
    <div class="loader" v-if="loader"></div>
    <div class="logo">
      <img src="../assets/logo.png" alt="logo">
      <h2>BUFER</h2>
    </div>
    <form @submit.prevent="authBufer" class="form_auth">
      <div class="form-field p-0">
        <div v-if="uavatar" id="ava" :style="{backgroundImage: `url(${uavatar})`}"><span class="delete_avatar" @click="uavatar = ''"><i class="fa fa-times"></i></span></div>
        <div v-else class="add_avatar" @click="addAvatar">
          <i class="fa fa-user"></i>
          <input class="input_avatar" name="avatar" @change="hendleImages($event)" type="file" accept="image/*" ref="avatar">
        </div>
      </div>
      <div class="form-field">
        <input required type="text" v-model="udepartament" @focus="openDropdown = true" @input="depList($event)" id="udepartament">
        <label class="form-field-label" for="udepartament">Выберите свой департамент</label>
        <ul :class="openDropdown ? 'is_active' : ''" class="form-dropdown" v-click-outside="closeDropdown">
          <li v-for="departament in departamentList" :key="departament.id" @click="clickItem(departament)">{{departament.name}}</li>
        </ul>
      </div>
      <div class="form-field">
        <input required type="text" v-model="ulogin" id="ulogin">
        <label class="form-field-label" for="ulogin">Логин</label>
      </div>
      <div class="form-field">
        <input required type="text" v-model="uname" id="uname">
        <label class="form-field-label" for="uname">ФИО ( Название Вашей папки )</label>
      </div>
      <input class="btn" type="submit" placeholder="Войти">
    </form>
  </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
import os from 'os'
import axios from 'axios'
const userInfo = os.userInfo()
const network = os.networkInterfaces()
var userNetwork = []
if(os.type() == 'Windows_NT'){
  userNetwork = network.Ethernet ? network.Ethernet[1] : 'notwork'
}else if(os.type() == 'Darwin'){
  userNetwork = network.en1 ? network.en1[1] : 'notwork'
}else{
  userNetwork = {}
}
if(userNetwork == 'notwork'){
  const { remote, ipcRenderer } = require('electron');
  this.$smalltalk
    .confirm("Сетевое подключения", `Нет сетевого подключения`, {
      buttons: {
        ok: "Перезагрузить",
        cancel: "Закрыть",
      },
    })
    .then(() => {
      console.log("Перезагрузить");
      remote.getCurrentWindow().reload()
    })
    .catch(() => {
      ipcRenderer.send("quit-app");
    });
}
const username = userInfo.username;
export default {
  data(){
    return {
      loader: true,
      deparr: [],
      openDropdown: false,
      ulogin: username || '',
      unetwork: userNetwork,
      uname: '',
      uavatar: '',
      udepartament: '',
      bgImage: `static/img/5.jpg`,//${Math.floor(Math.random() * 5) + 1}.jpg`,
      searchdep: '',
      avatar: null
    }
  },
  computed: {
    ...mapGetters(['departaments', 'user']),
    departamentList(){
      return this.departaments.filter(departament=>{
        return departament.name.toLowerCase().includes(this.udepartament.toLowerCase())
      })
    }
  },
  created(){
    this.bgLoad()
  },
  mounted(){
    this.bodyFixed()
    this.getDepartaments()
  },
  methods: {
    ...mapActions(['getDepartaments', 'Auth', 'getFolders']),
    depList(event){
      // if(event.target.value.length > 0){
      //   this.openDropdown = true
      // }else{
      //   this.openDropdown = false
      // }
    },
    async authBufer(){
      let userData = {
        login: this.ulogin,
        username: this.uname,
        avatar: this.avatar,
        departament: this.udepartament,
        network: this.unetwork,
        mac: this.unetwork.mac
      }
      let res = await this.Auth(userData)
      if(res.success){
        const user = {
          ...res.user,
          room: this.udepartament,
        }
        let departament = {
          id: res.user.departamentId,
          name: res.user.departamentName
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
        this.$store.commit('setActiveDepartament', departament)
        await this.getFolders(departament.id);
        this.$socket.emit("userJoined", user, data =>{
          if(typeof data === 'string'){
            console.error(data)
          }else{
            this.$store.commit('setUser', data.user)
            this.bodyFixed(null)
            this.$router.push('/') 
          }
        });
      }
    },
    bodyFixed(position='fixed'){
      let body = document.querySelector('body')
      body.style.position = position
    },
    clickItem(item){
      this.udepartament = item.name
      if(this.udepartament.length > 0){
        this.openDropdown = false
      }
    },
    closeDropdown(event){
      let depInput = document.querySelector('#udepartament')
      if(event.target !== depInput){
        this.openDropdown = false
      }
    },
    addAvatar(){
      this.$refs.avatar.click()
    },
    loadImageAsync(url) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
      });
    },
    bgLoad(){
      Promise.all([
        this.loadImageAsync("static/img/5.jpg")
      ])
      .then(images => {
        this.loader = false
      });
    },
    async hendleImages(e){
      this.avatar = e.target.files[0]
      await this.getBase64(e.target)
      .then(res=>{
        this.uavatar = res
      })
      .catch(err=>{
        console.log(err)
      })
    },
    getBase64(input){
      return new Promise((reject, resolve)=>{
        try {
          if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
              reject(e.target.result)
            }
            reader.readAsDataURL(input.files[0]); // convert to base64 string
          }
        } catch (error) {
          resolve(error)
        }
          
      })
    },
    beforeDestroy() {
      this.bodyFixed(null)
    },
  }
}
</script>