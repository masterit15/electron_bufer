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
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
const audio = new Audio("static/notify.mp3");
export default {
  data() {
    return {
      shownotify: false,
    };
  },
  watch: {
    noticeList(){
      if (audio) {
        audio.play();
      }
    },
    shownotify() {
      let notices = this.notices.filter(notice=>notice.status == 'unread')
      if(this.shownotify){
        
        let data = {
              ...this.user,
              msId: []
            }
        notices.forEach(notice => {
        let messageId = this.$message(
            notice.text,
            notice.title,
            "success",
            notice.id,
          );
          data.msId.push(messageId)
        });
        if(data.msId.length > 0){
          this.$socket.emit('noticeRead', data)
        }
      }
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
    //   if (audio) {
    //       audio.play();
    //   }
    //   let myNotification = new Notification("Title", {
    //     body: this.username,
    //     timeoutType: 'never',
    //     hasReply: true
    //   });
    //   console.log(myNotification)
    //   myNotification.onclick = () => {
    //     console.log('Notification clicked')
    //     myNotification.close()
    //   }
    // },
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