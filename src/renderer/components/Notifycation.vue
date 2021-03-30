<template>
  <div class="notice">
    <div
      class="notice_btn"
      :class="notifyed.length > 0 ? 'is_active' : ''"
      ref="notice"
      @click="shownotify = !shownotify"
      v-b-tooltip.hover
      :title="'Уводомлений: ' + notifyed.length"
    >
      <i class="fa fa-bell-o"></i>
      <span class="notice_count">{{
        notifyed.length >= 99 ? 99 : notifyed.length
      }}</span>
    </div>
    <ul class="notice_list">
      <li
        v-for="(notice, i) in notifyed"
        :key="notice.id"
        class="notice_item"
      >
        <span class="notice_item_close"><i class="fa fa-times" @click="closeNotify($event, notice.id)"></i></span>
        <div
          class="notice_item_wrap"
          :style="{ backgroundColor: notice.bgColor, color: notice.color }"
        >
          <h6>{{ notice.title }}</h6>
          <p>{{ notice.text }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import gsap from 'gsap'
const tl = gsap.timeline()
export default {
  data() {
    return {
      shownotify: false,
      notifyed: [
        {
          id: 1,
          title: "Test1",
          text: "werewrwer",
          bgColor: "#f79696" + 14,
          color: "#f79696",
        },
        {
          id: 2,
          title: "Test2",
          text: "werewrwer",
          bgColor: "#ffc106" + 14,
          color: "#ffc106",
        },
        {
          id: 3,
          title: "Test3",
          text: "werewrwer",
          bgColor: "#17b8a1" + 14,
          color: "#17b8a1",
        },
        {
          id: 4,
          title: "Test1",
          text: "werewrwer",
          bgColor: "#f79696" + 14,
          color: "#f79696",
        },
        {
          id: 5,
          title: "Test2",
          text: "werewrwer",
          bgColor: "#ffc106" + 14,
          color: "#ffc106",
        },
        {
          id: 6,
          title: "Test3",
          text: "werewrwer",
          bgColor: "#17b8a1" + 14,
          color: "#17b8a1",
        },
        {
          id: 7,
          title: "Test1",
          text: "werewrwer",
          bgColor: "#f79696" + 14,
          color: "#f79696",
        },
        {
          id: 8,
          title: "Test2",
          text: "werewrwer",
          bgColor: "#ffc106" + 14,
          color: "#ffc106",
        },
        {
          id: 9,
          title: "Test3",
          text: "werewrwer",
          bgColor: "#17b8a1" + 14,
          color: "#17b8a1",
        },
      ],
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
    if (!this.shownotify) {
      let noti_item = document.querySelectorAll(".notice_item");
      tl.to(noti_item, { x: 100, opacity: 0, duration: 0.2, stagger: 0.1 });
    }
  },
  methods: {
    notice() {
      const audio = new Audio("static/notify.mp3");
      // if (audio) {
      //     audio.play();
      // }
      // let myNotification = new Notification("Title", {
      //   body: this.username,
      //   timeoutType: 'never',
      //   audio: this.$path.join(__dirname, '/static/notify.mp3'),
      //   hasReply: true
      // });
      // console.log(myNotification)
      // myNotification.onclick = () => {
      //   console.log('Notification clicked')
      //   myNotification.close()
      // }
    },
    closeNotify(e, id) {
      let item = e.target.closest(".notice_item")
      let that = this;
      tl.to(item, {
        x: 100,
        opacity: 0,
        duration: 0.2,
      }).then(res => {
        that.notifyed  = that.notifyed.filter(noti=> {
          return noti.id !== id;
        });
      });
    },
  },
};
</script>