<template>
  <div class="notice">
    <div
      class="notice_btn"
      :class="noticeList.length > 0 ? 'is_active' : ''"
      ref="notice"
      @click="shownotify = !shownotify"
      v-b-tooltip.hover
      :title="'Уводомлений: ' + noticeList.length"
    >
      <i class="fa fa-bell-o"></i>
      <span class="notice_count">{{
        noticeList.length >= 99 ? 99 : noticeList.length
      }}</span>
    </div>
      <ul class="notice_list" v-click-outside="closeNotice">
        <li class="notice_list_action" v-show="noticeList.length > 0">
          <input @change="noticeChecked($event)" class="cinput notice_list_action_chekbox " type="checkbox">
          <transition-group name="slide-down" class="notice_list_action_btn">
            <button key="1" v-show="showActionButton" @click="deleteNotice">Удалить</button>
            <button key="2" v-show="showActionButton" @click="changeNotice">Прочитанные</button>
          </transition-group>
        </li>
        <div class="mCustomScrollbar" data-mcs-theme="dark" style="position: fixed;max-height: 78vh">  
        <li
          v-for="notice in noticeList"
          :key="notice.id"
          class="notice_item"
        >
          <input class="cinput notice_item_chekbox" type="checkbox" :value="notice.id">
          <span class="notice_item_close"><i class="fa fa-times" @click="closeNotify($event, notice.id)"></i></span>
          <div class="notice_item_wrap" @click='sowNoticeParam($event)'>
          <!-- :style="{ backgroundColor: notice.bgColor, color: notice.color }" -->
            <h6>{{ notice.title }}</h6>
            <p>{{ notice.text }}</p>
          </div>
        </li>
        </div>
      </ul>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import gsap from 'gsap'
const tl = gsap.timeline()
export default {
  data() {
    return {
      shownotify: false,
      showActionButton: false,
      selectItem: []
    };
  },
  watch: {
    shownotify() {
      let noti_item = document.querySelectorAll(".notice_item");
      let notify_list = document.querySelector(".notice_list");
      if (this.shownotify && noti_item.length > 0) {
        notify_list.classList.add("active");
        tl.to(noti_item, { x: 0, opacity: 1, duration: 0.2, stagger: 0.1 });
      } else {
        tl.to(noti_item, {
          x: 100,
          opacity: 0,
          duration: 0.2,
          stagger: 0.1,
        }).then(function (res) {
          notify_list.classList.remove("active");
        });
      }
    }
  },
  mounted() {
    let noti_item = document.querySelectorAll(".notice_item");
    if (!this.shownotify && noti_item.length > 0) {
      tl.to(noti_item, { x: 100, opacity: 0, duration: 0.2, stagger: 0.1 });
    }
  },
  computed: {
    ...mapGetters(['notices', 'user']),
    noticeList(){
      return this.notices.filter(notice=>notice.status == 'unread')
    }
  },
  methods: {
    ...mapActions(['deleteNotices', 'updateNotices']),
    // notice() {
    //   const audio = new Audio("static/notify.mp3");
    //   // if (audio) {
    //   //     audio.play();
    //   // }
    //   // let myNotification = new Notification("Title", {
    //   //   body: this.username,
    //   //   timeoutType: 'never',
    //   //   audio: this.$path.join(__dirname, '/static/notify.mp3'),
    //   //   hasReply: true
    //   // });
    //   // console.log(myNotification)
    //   // myNotification.onclick = () => {
    //   //   console.log('Notification clicked')
    //   //   myNotification.close()
    //   // }
    // },
    sowNoticeParam(event){
      let input = event.target.closest(".notice_item").querySelector('.notice_item_chekbox')
      input.classList.toggle('is_active')
      if(!this.hasClass(input, 'is_active')){
        input.checked = true
        this.selectItem.push(input.value)
      }else{
        input.checked = false
        this.selectItem = this.selectItem.filter(val=>val != input.value)
      }
      // console.log('event', event)
      
    },
    noticeChecked(event){
      let inputOne = event.target
      let items = document.querySelectorAll('.notice_item')
      if(inputOne.checked){
        this.showActionButton = true
        items.forEach(item=>{
          let input = item.querySelector('.notice_item_chekbox')
          input.classList.add('is_active')
          input.checked = true
          this.selectItem.push(input.value)
        })
      }else{
        this.showActionButton = false
        items.forEach(item=>{
          let input = item.querySelector('.notice_item_chekbox')
          input.classList.remove('is_active')
          input.checked = false
          this.selectItem = []
        })
      }
    },
    deleteNotice(){
      let data ={
        id: this.selectItem,
        userId: this.user.id
      }
      this.$socket.emit('notisDelete', data)
    },
    changeNotice(){
      let data ={
        id: this.selectItem,
        userId: this.user.id
      }
      this.$socket.emit('notisRead', data)
    },
    closeNotice(event){
      if(!this.hasClass(event.target, 'notice_count')){
        this.shownotify = false
      }
    },
    hasClass(el, clss) {
      return el.className && new RegExp("(^|\\s)" + clss + "(\\s|$)").test(el.className) == '' ? true : false;
    },
    closeNotify(e, id) {
      let item = e.target.closest(".notice_item")
      tl.to(item, {
        x: 100,
        opacity: 0,
        duration: 0.2,
      }).then(res => {
        let notices = this.notices.filter(noti=> {
          return noti.id !== id;
        });
        let data ={
          noticeId: id,
          userId: this.user.id
        }
        this.$store.commit('setNotices', notices)
        this.$socket.emit("noticeRead", data)
      });
    },
  },
};
</script>