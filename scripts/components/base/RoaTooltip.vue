<template>
  <div class="relative">
    <div
      ref="activator"
      class="inline-block"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      @click="clicked = clickable && !clicked"
    >
      <slot name="activator"></slot>
    </div>
    <transition name="fade">
      <div
        ref="content"
        v-show="hover || clicked"
        class="absolute tiny z-10 bg-white rounded shadow w-max max-w-tooltip p-8 transform flex items-center"
        :class="{
          'top-auto': position === 'bottom',
          'bottom-0': position === 'top',
          'bottom-0 right-0': position === 'left',
          'bottom-0': position === 'right',
        }"
        :style="{
          '--transform-translate-x': translateX,
          '--transform-translate-y': translateY,
        }"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
      >
        <div>
          <slot></slot>
        </div>
        <roa-icon-button
          icon="cross"
          small
          class="ml-4"
          type="button"
          @click="
            clicked = false;
            hover = false;
          "
          v-if="clicked"
        >
          Close
        </roa-icon-button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    position: { type: String, default: "bottom" },
    clickable: { type: Boolean, default: true },
  },
  computed: {
    translateX() {
      if (this.position === "bottom" || this.position === "top")
        return `calc(-50% + ${this.activatorWidth / 2}px)`;
      if (this.position === "left") return `${-this.activatorWidth}px`;
      if (this.position === "right") return `${this.activatorWidth}px`;
    },
    translateY() {
      if (this.position === "top")
        return `${-this.activatorHeight - this.contentHeight}px`;
      if (this.position === "left" || this.position === "right")
        return `calc(50% - ${this.activatorHeight / 2}px)`;
    },
  },
  methods: {
    updateRefSizes() {
      this.activatorHeight = this.$refs.activator.offsetHeight;
      this.activatorWidth = this.$refs.activator.offsetWidth;
      if (this.hover || this.clicked) {
        this.contentHeight = this.$refs.content.offsetHeight;
        this.contentWidth = this.$refs.content.offsetWidth;
      }
    },
  },
  watch: {
    hover() {
      this.updateRefSizes();
    },
    clicked() {
      this.updateRefSizes();
    },
  },
  data() {
    return {
      hover: false,
      clicked: false,
      contentHeight: 0,
      contentWidth: 0,
      activatorHeight: 0,
      activatorWidth: 0,
    };
  },
};
</script>
<style lang="scss">
.w-max {
  width: max-content;
}

.max-w-tooltip {
  max-width: 90vw;
}

@screen sm {
  .max-w-tooltip {
    max-width: 40ch;
  }
}
</style>