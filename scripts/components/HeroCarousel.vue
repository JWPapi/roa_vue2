<template>
  <div
    class="-mx-4 sm:-mx-8 xl:-mx-16 relative h-96 sm:h-128 md:h-hero bg-black"
  >
    <slider-wrapper :controls="false" preset="hero" @init="glide = $event">
      <li v-for="(slide, idx) in slides" :key="idx">
        <a
          :href="slide.url"
          class="h-96 sm:h-128 md:h-hero flex relative w-full"
        >
          <roa-image
            :src="slide.image"
            :w="1500"
            :h="null"
            loading="eager"
            darken
            img-class="hero-carousel-image absolute inset-0 object-cover w-full h-full"
            :img-style="{ objectPosition: slide.focalpoint }"
          ></roa-image>
        </a>
      </li>
    </slider-wrapper>
    <div
      class="z-10 px-8 pb-8 xl:px-16 pt-0 absolute w-full right-0 bottom-0 pointer-events-none"
    >
      <div class="flex justify-between items-end">
        <transition name="fade" mode="out-in">
          <a
            :href="currentSlide.url"
            class="text-white flex-1 text-center sm:text-left"
            :key="currentSlide.title"
          >
            <h2 class="h2 uppercase pointer-events-auto">
              {{ currentSlide.title }}
            </h2>
            <p class="h4 mt-2 pointer-events-auto">
              {{ currentSlide.subtitle }}
            </p>
          </a>
        </transition>
        <div
          class="hidden sm:flex flex-shrink-0 items-center text-white pointer-events-auto"
        >
          <roa-icon-button
            solid
            class="mr-4"
            icon="arrow-left"
            @click="showPrevious"
          ></roa-icon-button>
          <roa-icon-button
            solid
            icon="arrow-right"
            @click="showNext"
          ></roa-icon-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SliderWrapper from "../components/SliderWrapper";
export default {
  components: {
    SliderWrapper,
  },
  props: { slides: { type: Array, required: true } },
  data() {
    return {
      glide: null,
    };
  },
  computed: {
    currentSlide() {
      const index = this.glide?.index || 0;
      return this.slides[index];
    },
  },
  methods: {
    showPrevious() {
      this.glide?.go("<");
    },
    showNext() {
      this.glide?.go(">");
    },
  },
};
</script>