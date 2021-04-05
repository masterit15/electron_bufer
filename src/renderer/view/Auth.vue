<template>
  <div class="form" :style="{backgroundImage: `url(${bgImage})`}" style="-webkit-app-region: drag">
    <div class="logo">
      <img src="../assets/logo.png" alt="logo">
      <h2>BUFER</h2>
    </div>
    <form @submit.prevent="authBufer" class="form_auth">
      <div class="form-field p-0">
        <div v-if="uavatar" id="ava" :style="{backgroundImage: `url(${uavatar})`}"><span class="delete_avatar" @click="uavatar = ''"><i class="fa fa-times"></i></span></div>
        <div v-else class="add_avatar" @click="addAvatar">
          <i class="fa fa-user"></i>
          <input class="input_avatar" @change="hendleImages($event)" type="file" accept="image/*" ref="avatar">
        </div>
      </div>
      <div class="form-field">
        <input required type="text" ref="udep" v-model="udepartament" id="udepartament" @click="openDropdown = true">
        <label class="form-field-label" for="udepartament">Выберите свой департамент</label>
        <ul :class="openDropdown ? 'is_active' : ''" class="form-dropdown mCustomScrollbar" v-click-outside="closeDropdown" data-mcs-theme="dark" ref="dropdown" v-show="departamentList.length > 0">
          <input class="form-dropdown-search" type="text" v-model="searchdep">
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
import { log } from 'util'
const userInfo = os.userInfo()
const network = os.networkInterfaces()
var userNetwork = []
if(os.type() == 'Windows_NT'){
  userNetwork = network.Ethernet[1]
}else if(os.type() == 'Darwin'){
  userNetwork = network.en1[1]
}else{

}
const username = userInfo.username;
export default {
  data(){
    return {
      openDropdown: false,
      ulogin: username || '',
      unetwork: userNetwork,
      uname: '',
      uavatar: '',
      udepartament: '',
      bgImage: 'https://picsum.photos/1200',
      searchdep: ''
    }
  },
  created(){
    this.getDepartaments()
  },
  computed: {
    ...mapGetters(['departaments', 'user']),
    departamentList(){
      return this.departaments.filter(departament=>{
        return departament.name.toLowerCase().includes(this.searchdep.toLowerCase())
      })
    }
  },
  mounted(){
    $('.mCustomScrollbar').mCustomScrollbar({
      autoHideScrollbar: true,
      scrollbarPosition: "inside"
    })
    this.setIntervalBgcChange()
    this.bodyFixed()
  },
  methods: {
    ...mapActions(['getDepartaments', 'addUsers', 'getUsers']),
    async authBufer(){
      let data = {
        login: this.ulogin,
        username: this.uname,
        avatar: this.uavatar,
        departament: this.udepartament,
        network: this.unetwork,
        mac: this.unetwork.mac
      }
      let res = await this.addUsers(data)
      if(res.success){
        this.$socket.emit("userJoined", {...this.user, sid: this.$socket.id, room: this.udepartament})
        this.bodyFixed('relative')
        clearInterval(this.setIntervalBgcChange());
        this.getUsers()
        this.$router.push('/') 
      }
    },
    bodyFixed(position='fixed'){
      let body = document.querySelector('body')
      body.style.position = position
    },
    setIntervalBgcChange(){
      let that = this
      let refreshIntervalBg = setInterval(()=>{
          fetch('https://picsum.photos/1200')
          .then(res=>{
            that.bgImage = res.url
          })
        }, 120000)
      return refreshIntervalBg
    },
    clickItem(item){
      this.udepartament = item.name
      if(this.udepartament.length > 0){
        this.openDropdown = false
      }
    },
    closeDropdown(event){
      if(!event){
        this.openDropdown = false
      }
    },
    addAvatar(){
      this.$refs.avatar.click()
    },
    async hendleImages(e){
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
      this.bodyFixed('relative')
      clearInterval(this.setIntervalBgcChange());
    },
  }
}
</script>