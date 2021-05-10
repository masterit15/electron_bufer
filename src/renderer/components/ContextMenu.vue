<template>
  <div
    class="context_menu"
    v-click-outside="closeContext"
    v-show="display"
    :style="style"
    ref="context"
    tabindex="0"
    @blur="close"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "CmpContextMenu",
  props: {
    display: Boolean, // prop detect if we should show context menu
    position: Object,
    e: Object
  },
  data(){
    return {
      clickCoords: null,
      clickCoordsX: null,
      clickCoordsY: null,
      menuState: 0,
      menuWidth: null,
      menuHeight: null,
      windowWidth: null,
      windowHeight: null,
      top: '',
      left: '',
    }
  },
  computed: {
    style() {
      return {
        top: this.position.top,
        left: this.position.left,
      };
    },
  },
  methods: {
    closeContext(event) {
      if (!event) {
        this.openDropdown = false;
      }
    },
    close() {
      this.left = 0;
      this.top = 0;
    },
  },
};
</script>