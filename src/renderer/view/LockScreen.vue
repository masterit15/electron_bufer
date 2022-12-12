<template>
  <div
    id="lock_screen"
    class="content lock_screen"
    :style="{ backgroundImage: `url(${bgImage})` }"
  >
    <div class="lock_screen_block">
      <div class="lock_screen_block_dots">
        <svg>
          <g>
            <circle class="pin-circle" cx="12" cy="12" r="10"></circle>
            <circle class="pin-circle" cx="52" cy="12" r="10"></circle>
            <circle class="pin-circle" cx="92" cy="12" r="10"></circle>
            <circle class="pin-circle" cx="132" cy="12" r="10"></circle>
          </g>
        </svg>
      </div>
      <table class="lock_screen_block_table" border="1">
        <tr>
          <td><span @click="tapPad($event)" class="number n_1">1</span></td>
          <td><span @click="tapPad($event)" class="number n_2">2</span></td>
          <td><span @click="tapPad($event)" class="number n_3">3</span></td>
        </tr>
        <tr>
          <td><span @click="tapPad($event)" class="number n_4">4</span></td>
          <td><span @click="tapPad($event)" class="number n_5">5</span></td>
          <td><span @click="tapPad($event)" class="number n_6">6</span></td>
        </tr>
        <tr>
          <td><span @click="tapPad($event)" class="number n_7">7</span></td>
          <td><span @click="tapPad($event)" class="number n_8">8</span></td>
          <td><span @click="tapPad($event)" class="number n_9">9</span></td>
        </tr>
        <tr>
          <td><span @click="deleteNum($event)" class="number"><i class="fa fa-arrow-left"></i></span></td>
          <td><span @click="tapPad($event)" class="number n_0">0</span></td>
          <td><span @click="resetNum($event)" class="number"><i class="fa fa-times"></i></span></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      numberArr: [],
      password: null,
      correctPin: "0000",
      disableInput: false,
      bgImage: `static/img/5.jpg`,
    };
  },
  mounted(){
    const _this = this
    document.addEventListener('keypress', (e)=>{
      _this.tapPadNum(e.key)
    })
  },
  methods: {
    ...mapActions(["unLockScreen"]),
    resetNum(){
      this.numberArr = []
      this.bindPinToDisplay(this.numberArr)
    },
    deleteNum(){
      let oldArr = [...this.numberArr]
      let newArr = oldArr.slice(0, -1)
      this.numberArr = newArr
      this.bindPinToDisplay(this.numberArr)
    },
    bindPinToDisplay(pinArray, pinStatus) {
      document.querySelectorAll(".pin-circle").forEach((el, index) => {
        if (pinStatus === "success") {
          el.classList.add("success");
        } else if (pinStatus === "error") {
          el.classList.add("error");
        } else if (index > pinArray.length - 1) {
          el.classList.remove("entered");
          el.classList.remove("success");
          el.classList.remove("error");
        } else {
          el.classList.add("entered");
        }
      });

      if (pinStatus === "error") {
        document.querySelector(".lock_screen_block_dots").classList.add("error");
      } else {
        document.querySelector(".lock_screen_block_dots").classList.remove("error");
      }
    },
    evaluatePin(pinArray) {
      const enteredPin = pinArray.join("");
      if (enteredPin === this.correctPin) {
        this.disableInput = true;
        setTimeout(() => {
          this.bindPinToDisplay(pinArray, "success");
          setTimeout(() => {
            this.unLockScreen(enteredPin)
            this.numberArr = []
            this.bindPinToDisplay(this.numberArr);
          }, 500);
        }, 250);
        
      } else {
        this.disableInput = true;
        setTimeout(() => {
          this.bindPinToDisplay(pinArray, "error");
          setTimeout(() => {
            this.numberArr = [];
            this.bindPinToDisplay(this.numberArr);
            this.disableInput = false;
          }, 350);
        }, 250);
      }
    },
    tapPadNum(key){
      if (this.disableInput) {
          return;
      }
      let num = Number(key);
      if (this.numberArr.length < 4) {
        let active = document.querySelector(
          `.lock_screen_block_table .n_${num}`
        );
        active.classList.add("active");
        setTimeout(() => {
          active.classList.remove("active");
        }, 90);
        this.numberArr.push(num);
          this.bindPinToDisplay(this.numberArr);
          if (this.numberArr.length === 4) {
            this.evaluatePin(this.numberArr);
          }
        }
    },
    tapPad(e){
      this.tapPadNum(e.target.innerText)
    },
  },
};
</script>