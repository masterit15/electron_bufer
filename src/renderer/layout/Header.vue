<template>
  <div id="header">
    <div class="user_container" @click="notice">
      <div 
        v-bind:class="this.notifyed.length > 0 ? 'notice is_active' : 'notice'" ref="notice" 
        @click="shownotify=!shownotify"
        v-b-tooltip.hover :title="'Уводомлений: '+notifyed.length">
          <i class="fa fa-bell-o"></i>
          <span class="notice_count">{{ notifyed.length >= 99 ? 99 :  notifyed.length }}</span>
        </div>
      <avatar :username="username" :size="42"></avatar>
      <u class="notice_list">
        <li v-for="(notice, i) in notifyed" :key="notice.title+'-'+i" class="notice_item">
        <div class="notice_item_wrap" :style="{backgroundColor: notice.bgColor, color: notice.color}">
          <h6><i :class="'fa '+notice.icon" @click="closeNotify($event, i)"></i> {{notice.title}}</h6>
          <p>{{notice.text}}</p>
        </div>
      </li>
      </u>
    </div>
  </div>
</template>
<script>
import os from 'os'
const username = os.userInfo().username
import gsap from 'gsap'
const tl = gsap.timeline()
export default {
  data() {
    return {
      username: username,
      shownotify: false,
      notifyed: [
        {title: "Test1", text: "werewrwer", icon: "fa-times", bgColor: '#f79696'+14, color: '#f79696'},
        {title: "Test2", text: "werewrwer", icon: "fa-times", bgColor: '#ffc106'+14, color: '#ffc106'},
        {title: "Test3", text: "werewrwer", icon: "fa-times", bgColor: '#17b8a1'+14, color: '#17b8a1'},
        {title: "Test1", text: "werewrwer", icon: "fa-times", bgColor: '#f79696'+14, color: '#f79696'},
        {title: "Test2", text: "werewrwer", icon: "fa-times", bgColor: '#ffc106'+14, color: '#ffc106'},
        {title: "Test3", text: "werewrwer", icon: "fa-times", bgColor: '#17b8a1'+14, color: '#17b8a1'},
        {title: "Test1", text: "werewrwer", icon: "fa-times", bgColor: '#f79696'+14, color: '#f79696'},
        {title: "Test2", text: "werewrwer", icon: "fa-times", bgColor: '#ffc106'+14, color: '#ffc106'},
        {title: "Test3", text: "werewrwer", icon: "fa-times", bgColor: '#17b8a1'+14, color: '#17b8a1'}
      ],
    }
  },
  watch: {
    shownotify(){
      let noti_item =  document.querySelectorAll('.notice_item')
      let notify_list = document.querySelector('.notice_list')
      console.log(notify_list)
      if(this.shownotify){
        notify_list.classList.add('active')
        tl.to(noti_item, { x: 0, opacity: 1, duration: .2, stagger: 0.1 })
      }else{
        tl.to(noti_item, { x: 100, opacity: 0, duration: .2, stagger: 0.1 })
        .then(function (res) {
          notify_list.classList.remove('active')
        })
      }
    }
  },
  mounted() {
    if(!this.shownotify){
      let noti_item =  document.querySelectorAll('.notice_item')
      tl.to(noti_item, { x: 100, opacity: 0, duration: .2, stagger: 0.1 })
    }
  },
  methods: {
    notice(){
      const audio = new Audio('static/notify.mp3');
      // if (audio) {
      //     audio.play();
      // }
      let myNotification = new Notification("Title", {
        body: this.username,
        timeoutType: 'never',
        audio: this.$path.join(__dirname, '/static/notify.mp3'),
        hasReply: true
      });
      console.log(myNotification)
      myNotification.onclick = () => {
        console.log('Notification clicked')
        myNotification.close()
      }
      // setInterval(()=>{
      //   myNotification.shownotify()
      // }, 3000)
    },
    closeNotify($event, i){
      let that = this
      let noti_item =  document.querySelectorAll('.noti_item')
      let height = noti_item[i].height
      tl.to(noti_item[i], { y: 100, opacity: 0, duration: .2, stagger: 0.1 })
        .then(function (res) {
          that.notifyed.splice(i, 1)
        })
    },
  }
}
</script>