<template>
  <div class="context_menu" v-click-outside="closeContext" v-show="display" :style="style" ref="context" tabindex="0" @blur="close">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "CmpContextMenu",
  props: {
    display: Boolean, // prop detect if we should show context menu
    position: Object
  },
  computed: {
    style() {
      return {
          top: this.position.top + 'px',
          left: this.position.left + 'px',
      };
    },
  },
  methods: {
    closeContext(event){
      if(!event){
        this.openDropdown = false
      }
    },
    close() {
      this.left = 0;
      this.top = 0;
    },
  },
};
</script>
<style lang="sass">
.context_menu
  position: fixed
  list-style: none
  width: 150px
  height: auto
  outline: none
  background-color: #fff
  border-radius: 5px
  box-shadow: 0 3px 5px #333
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  z-index: 9999
  ul
    list-style: none
    li
      cursor: pointer
      padding: 10px 15px
      border-bottom: 1px solid #ddd
      transition: all .3s ease
      &:hover
        background-color: #ddd
        transition: all .3s ease
</style>