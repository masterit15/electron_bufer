<template>
  <div class="form" :style="{backgroundImage: `url(${bgImage})`}">
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
        <input required type="text" v-model="udepartament" id="udepartament">
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
const userInfo = os.userInfo()
const network = os.networkInterfaces()
var userNetwork = []
if(os.type() == 'Windows_NT'){
  userNetwork = network.Ethernet[1]
}else if(os.type() == 'Darwin'){
  userNetwork = network.en1[1]
}else{
  userNetwork = {}
}
const username = userInfo.username;
export default {
  data(){
    return {
      deparr: [],
      openDropdown: false,
      ulogin: username || '',
      unetwork: userNetwork,
      uname: '',
      uavatar: '',
      udepartament: '',
      bgImage: `static/img/${Math.floor(Math.random() * 5) + 1}.jpg`,
      searchdep: ''
    }
  },
  watch: {
    udepartament(){
      if(this.udepartament.length > 0){
        this.openDropdown = true
      }else{
        this.openDropdown = false
      }
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
  mounted(){
    this.bodyFixed()
  },
  methods: {
    ...mapActions(['getDepartaments', 'Auth']),
    async authBufer(){
      let userData = {
        login: this.ulogin,
        username: this.uname,
        avatar: this.uavatar,
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
      if(event.target){
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
      this.bodyFixed(null)
    },
  }
}
</script>