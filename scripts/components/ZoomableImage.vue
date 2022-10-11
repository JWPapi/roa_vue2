<template>
  <div class="relative w-full h-0 overflow-visible pb-1/1">
    <div
      class="absolute inset-0 overflow-hidden h-full w-full"
      :class="[hovered ? 'cursor-cell' : '']"
      @mouseenter="hovered = windowWidth > breakpoints.md"
      @mouseleave="hovered = false"
      @mousemove="updateMouse"
    >
      <roa-image
        :w="800"
        :h="800"
        sizes="(max-width: 640px) 100vw, 896px"
        :src="src"
        :spotlight="!noPadding"
        :padding="windowWidth > breakpoints.md ? 60 : 30"
        focalpoint="51-50"
        :img-class="[
          'transition-opacity duration-500 delay-100',
          hovered ? 'opacity-0' : 'opacity-100',
          noPadding && 'w-full',
        ]"
      ></roa-image>
      <roa-image
        :w="1500"
        :h="1500"
        sizes="(max-width: 640px) 1000px, 1500px"
        fit="fill"
        :class="[
          'transition-all duration-500 pointer-events-none',
          hovered ? 'opacity-100' : 'opacity-0',
        ]"
        img-class="max-w-none absolute inset-0"
        :img-style="{
          width: '200%',
          'object-fit': 'contain',
          height: '200%',
          transform: `translateX(${-relX * 50}%) translateY(${-relY * 50}%)`,
        }"
        :src="src"
      ></roa-image>
    </div>
  </div>
</template>

<script>
import WindowWidth from "../mixins/WindowWidth.vue";
import debounce from "lodash.debounce";
export default {
  props: {
    src: { type: String, required: true },
    noPadding: { type: Boolean, default: false },
  },
  mixins: [WindowWidth],
  data() {
    return {
      hovered: false,
      relX: 0,
      relY: 0,
    };
  },
  methods: {
    updateMouse: debounce(
      function (event) {
        this.relX = Math.max(
          0,
          Math.min(1, event.offsetX / this.$el.offsetWidth)
        );
        this.relY = Math.max(
          0,
          Math.min(1, event.offsetY / this.$el.offsetHeight)
        );
      },
      100,
      { leading: false, maxWait: 100 }
    ),
  },
};
</script>