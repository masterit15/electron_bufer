<template>
  <div class="notice">
    <div
      class="notice_btn"
      :class="notices.length > 0 ? 'is_active' : ''"
      ref="notice"
      @click="shownotify = !shownotify"
      v-b-tooltip.hover
      :title="'Уводомлений: ' + notices.length"
    >
      <i class="fa fa-bell-o"></i>
      <span class="notice_count">{{
        notices.length >= 99 ? 99 : notices.length
      }}</span>
    </div>
      <ul class="notice_list mCustomScrollbar" data-mcs-theme="dark" >
        <li
          v-for="notice in notices"
          :key="notice.id"
          class="notice_item"
        >
          <span class="notice_item_close"><i class="fa fa-times" @click="closeNotify($event, notice.id)"></i></span>
          <div
            class="notice_item_wrap"
            
          >
          <!-- :style="{ backgroundColor: notice.bgColor, color: notice.color }" -->
            <h6>{{ notice.title }}</h6>
            <p>{{ notice.text }}</p>
          </div>
        </li>
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
    };
  },
  watch: {
    shownotify() {
      let noti_item = document.querySelectorAll(".notice_item");
      let notify_list = document.querySelector(".notice_list");
      if (this.shownotify) {
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
    },
  },
  mounted() {
    // $('.notice_list').mCustomScrollbar()
    if (!this.shownotify) {
      let noti_item = document.querySelectorAll(".notice_item");
      tl.to(noti_item, { x: 100, opacity: 0, duration: 0.2, stagger: 0.1 });
    }
    this.getNotices(this.user.id)
  },
  computed: {
    ...mapGetters(['notices', 'user']),
  },
  methods: {
    ...mapActions(['getNotices', 'deleteNotices']),
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
    closeNotify(e, id) {
      let item = e.target.closest(".notice_item")
      let that = this;
      tl.to(item, {
        x: 100,
        opacity: 0,
        duration: 0.2,
      }).then(res => {
        // this.notices = this.notices.filter(noti=> {
        //   return noti.id !== id;
        // });
        this.deleteNotices(id)
      });
    },
  },
};
</script>