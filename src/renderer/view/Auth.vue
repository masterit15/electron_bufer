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
        <input required type="text" ref="udep" v-model="udepartament" id="udepartament" @click="activeDrodown">
        <label class="form-field-label" for="udepartament">Выберите свой департамент</label>
        <ul :class="openDropdown ? 'is_active' : ''" class="form-dropdown mCustomScrollbar" data-mcs-theme="dark" ref="dropdown">
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
      openDropdown: false,
      ulogin: '' || username,
      uname: '',
      uavatar: '',
      udepartament: '',
      bgImage: 'https://picsum.photos/1200',
      searchdep: ''
    }
  },
  computed: {
    ...mapGetters(['departaments']),
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
    this.getDepartaments()
    this.bodyFixed()
  },
  methods: {
    ...mapActions(['getDepartaments', 'addUsers']),
    async authBufer(){
      let data = {
        login: this.ulogin,
        username: this.uname,
        avatar: this.uavatar,
        departament: this.udepartament
      }
      let res = await this.addUsers(data)
      if(res.success){
        this.$socket.emit("userJoined", userInfo)
        this.bodyFixed('relative')
        clearInterval(this.setIntervalBgcChange());
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
      this.$refs.udep.value = item.name
      this.openDropdown = false
    },
    activeDrodown(){
      let dropdown = this.$refs.dropdown
      this.outsideClick(dropdown)
    },
    outsideClick(elem) {
      let that = this;
      function outsideClickListener(event) {
        if (!elem.contains(event.target) && isVisible(elem)) {
          that.openDropdown = false;
          document.removeEventListener("click", outsideClickListener);
        }
      }
      document.addEventListener("click", outsideClickListener);
      function isVisible(elem) {
        //открыто ли условное окно
        return (
          !!elem &&
          !!(
            elem.offsetWidth ||
            elem.offsetHeight ||
            elem.getClientRects().length
          )
        );
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