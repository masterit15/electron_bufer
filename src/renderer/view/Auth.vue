<template>
  <div class="form" :style="{backgroundImage: `url(${bgImage})`}" style="-webkit-app-region: drag">
    <div class="logo">
      <img src="../assets/logo.png" alt="logo">
      <h2>BUFER</h2>
    </div>
    <form @submit.prevent="authBufer" class="form_auth" >
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
        <ul class="form-dropdown" v-if="departamentList.length > 0">
          <li v-for="departament in departamentList" :key="departament.id" @click="activeItem(departament)">{{departament.name}}</li>
        </ul>
      </div>
      <div class="form-field">
        <input required type="text" v-model="ulogin" id="ulogin">
        <label class="form-field-label" for="ulogin">Логин</label>
      </div>
      <div class="form-field">
        <input required type="text" v-model="uname" id="uname">
        <label class="form-field-label" for="uname">Имя пользователя ( Название раздела )</label>
      </div>
      <input class="btn" type="submit" placeholder="Войти">
    </form>
  </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
import os from 'os'
const userInfo = os.userInfo()
const username = userInfo.username;
export default {
  data(){
    return {
      ulogin: '' || username,
      uname: '',
      uavatar: '',
      udepartament: '',
      bgImage: 'https://picsum.photos/1200'
    }
  },
  mounted(){
    this.getDepartaments()
  },
  computed: {
    ...mapGetters(['departaments', 'users']),
    departamentList(){
      return this.departaments.filter(departament=>{
        return departament.name.toLowerCase().includes(this.udepartament.toLowerCase())
      })
    }
  },
  mounted(){
    this.setIntervalBgcChange()
    this.bodyFixed()
  },
  methods: {
    ...mapActions(['getDepartaments', 'addUsers']),
    authBufer(){
      let data = {
        login: this.ulogin,
        username: this.uname,
        avatar: this.uavatar,
        departament: this.udepartament
      }
      this.addUsers(data)
      // this.$socket.emit("userJoined", userInfo)
      // this.$socket.emit("userRegister", userInfo)
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
    activeItem(item){
      console.log(item)
      this.udepartament = item.name
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
      bodyFixed(position='relative')
      clearInterval(this.setIntervalBgcChange());
    },
  }
}
</script>