<template>
  <ul :class="active ? 'masonry' : 'artworks-grid'">
    <slot />
  </ul>
</template>

<script>
import Vue from "vue";
export default {
  props: {
    active: { type: Boolean, default: true },
    preset: { type: String, default: "artworks" },
  },
  data() {
    return {
      rowGap: 0,
      rowHeight: 0,
      children: [],
      mutationObserver: null,
    };
  },
  mounted() {
    this.init();
    this.waitForImages();
  },
  unmounted() {
    this.mutationObserver.disconnect();
  },
  methods: {
    init() {
      [("load", "resize")].forEach((event) => {
        window.addEventListener(event, () => this.resizeAllMasonryItems());
      });
      this.children = [...this.$el.querySelectorAll("li")];
      this.rowGap = parseInt(
        window.getComputedStyle(this.$el).getPropertyValue("grid-row-gap")
      );
      this.rowHeight = parseInt(
        window.getComputedStyle(this.$el).getPropertyValue("grid-auto-rows")
      );
      this.mutationObserver = new MutationObserver(() => {
        Vue.nextTick(() => {
          this.children = [...this.$el.querySelectorAll("li")];
          this.waitForImages();
        });
      });
      this.mutationObserver.observe(this.$el, {
        childList: true,
      });
    },
    resizeMasonryItem(item) {
      const contentHeight = [...item.children].reduce((sum, child) => {
        const itemHeight = child.getBoundingClientRect().height;
        return sum + itemHeight;
      }, 0);
      const rowSpan = Math.ceil(
        (contentHeight + this.rowGap) / (this.rowHeight + this.rowGap)
      );
      item.style.gridRowEnd = "span " + rowSpan;
      item.style.height = rowSpan * 10 + "px";
    },
    resizeAllMasonryItems() {
      this.children.forEach(this.resizeMasonryItem);
    },
    waitForImages() {
      this.images.forEach((img, idx) => {
        if (img.complete) this.resizeMasonryItem(this.children[idx]);
        else
          img.addEventListener("load", () => {
            this.resizeMasonryItem(this.children[idx]);
          });
      });
    },
  },
  computed: {
    images() {
      return this.children.map((child) => child.querySelector("img"));
    },
  },
};
</script>