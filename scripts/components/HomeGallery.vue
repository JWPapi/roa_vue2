<template>
  <div
    class="
      -mx-4
      sm:-mx-8
      xl:-mx-16
      relative
      box-border
      bg-white
      overflow-hidden
      border-b border-gray-darkest
    "
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <ul
      class="
        artworks-container
        h-96
        md:h-hero
        flex
        transition-transform
        ease-linear
      "
      :style="{
        transform: `translateX(${-1 * (offset + dragOffset)}px)`,
      }"
      ref="wall"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <li
        v-for="(artwork, idx) in displayArtworks"
        :key="artwork.title + idx"
        class="h-full flex-shrink-0 relative"
        :style="{ marginLeft: artworkMargin + 'px' }"
      >
        <a
          :href="artwork.url"
          class="block relative artworks-container-item max-w-xs flex-shrink-0"
          :style="{
            top: `${mounted ? getTopOffset(idx) : 0}px`,
            width: `${artworkSize}px`,
          }"
          @click="speed = 0"
        >
          <roa-image
            :src="artwork.image"
            :responsive="false"
            :w="artworkSize"
            :h="artworkSize"
            fit="max"
          ></roa-image>
          <div
            class="
              artwork-container-item-text
              opacity-0
              mt-2
              hidden
              sm:block
              bg-gradient-to-r
              from-white
              to-transparent
            "
          >
            <p class="tiny uppercase text-gray-darkest">
              {{ artwork.artist }}
            </p>
            <p class="text-gray-solid tiny">{{ artwork.title }}</p>
          </div>
        </a>
      </li>
    </ul>
    <div
      class="
        floating-hero-overlay
        md:absolute
        left-0
        inset-y-0
        flex flex-col
        justify-center
        items-center
        md:items-start
        px-8
        xl:px-16
        max-w-3xl
        pointer-events-none
        pb-8
      "
    >
      <h1
        class="
          h2
          md:h1
          text-center
          md:text-left
          uppercase
          headline
          transition-opacity
          duration-300
        "
        :class="hovered && width > 640 && 'opacity-10'"
      >
        <span class="pointer-events-auto">{{ options.headline }}</span>
      </h1>
      <div class="max-w-sm mt-8">
        <roa-link-button
          class="w-full pointer-events-auto"
          :href="options.ctaUrl"
        >
          {{ options.ctaText }}
        </roa-link-button>
      </div>
    </div>
  </div>
</template>

<script>
import RoaImage from "./base/RoaImage.vue";
import RoaLinkButton from "./base/RoaLinkButton.vue";
export default {
  components: {
    RoaLinkButton,
    RoaImage,
  },
  props: {
    artworks: {
      type: Array,
      default: [],
    },
    options: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      mounted: false,
      hovered: false,
      offset: 0,
      speed: 0.5,
      height: window.innerHeight,
      width: window.innerWidth,
      artworkMargin: 0,
      artworkSize: 250,
      overlapIndex: 0,
      displayArtworks: [...this.artworks],
      dragOffset: 0,
      dragStartOffset: 0,
    };
  },
  mounted() {
    this.mounted = true;
    this.hovered = false;
    this.offset = this.$refs.wall.scrollWidth / 2;
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
    requestAnimationFrame(this.animate);
  },
  methods: {
    handleTouchStart(event) {
      window.addEventListener("touchmove", this.handleTouchMove);
      this.speed = 0;
      const touch = event.touches[0];
      if (!touch) return;
      this.dragStartOffset = touch.pageX;
    },
    handleTouchEnd() {
      window.removeEventListener("touchmove", this.handleTouchMove);
      this.speed = this.width > 1060 ? 0.75 : 0.5;
      this.offset = this.offset + this.dragOffset;
      this.dragStartOffset = 0;
      this.dragOffset = 0;
    },
    handleTouchMove(event) {
      const touch = event.touches[0];
      if (!touch) return;
      this.dragOffset = this.dragStartOffset - touch.pageX;
    },
    handleResize() {
      this.height = this.$refs.wall.offsetHeight;
      this.width = this.$refs.wall.offsetWidth;
      if (this.width < 640 || this.height < 500) {
        this.artworkMargin = -24;
        this.artworkSize = 100;
      } else if (this.height < 1000) {
        this.artworkMargin = -48;
        this.artworkSize = 175;
      } else {
        this.artworkMargin = -64;
        this.artworkSize = 250;
      }
      this.speed = this.width > 1060 ? 0.75 : 0.5;
    },
    handleMouseLeave(e) {
      if (e.touches) return;
      this.hovered = false;
      this.speed = this.width > 1060 ? 0.75 : 0.5;
    },
    handleMouseEnter(e) {
      if (e.touches) return;
      this.hovered = true;
      this.speed = 0.25;
    },
    animate() {
      this.offset += this.speed;
      if (
        (this.displayArtworks.length - 1) *
          (this.artworkSize + this.artworkMargin) -
          this.offset -
          100 <=
        this.width
      ) {
        this.displayArtworks.push(this.displayArtworks[this.overlapIndex]);
        this.overlapIndex = (this.overlapIndex + 1) % this.artworks.length;
      } else if (this.offset < 0) {
        // load and place new items
      }
      requestAnimationFrame(this.animate);
    },
    getTopOffset(idx) {
      const itemHeight = this.artworkSize + 28 + 32; // image max height + 2x line height + 2x margin

      const offsets3 = [0.25, 1, 0.05, 0.5, 0.95, 0, 0.75];
      const offsets2 = [0, 0.9, 0.1, 1, 0.05, 0.85];
      const factor =
        this.height > itemHeight * 2.8 && this.width > 640
          ? offsets3[idx % offsets3.length]
          : offsets2[idx % offsets2.length];
      return 16 + (this.$refs.wall.offsetHeight - 0 - itemHeight) * factor;
    },
  },
};
</script>
<style lang="scss" scoped>
.floating-hero-overlay {
  background-image: radial-gradient(
    farthest-side at 0% 50%,
    rgba(255, 255, 255, 0.75),
    rgba(255, 255, 255, 0)
  );
}

@media (hover: hover) {
  .artworks-container {
    pointer-events: none;
  }

  .artworks-container-item {
    transition: opacity 300ms ease-in-out;
    pointer-events: auto;
  }

  .artworks-container-item-text {
    transition: opacity 300ms ease-in-out;
  }

  // .artworks-container {
  //  transition: transform 5s linear;
  // }

  .artworks-container:hover {
    .artworks-container-item {
      opacity: 0.5;

      &:hover {
        opacity: 1;

        .artwork-container-item-text {
          opacity: 1;
        }
      }
    }
  }
}
</style>