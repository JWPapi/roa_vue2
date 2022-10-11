<template>
  <portal to="modal">
    <transition name="fade">
      <div v-if="show">
        <focus-trap initial-focus="#closeButton" :active="show">
          <section
            class="
              fixed
              inset-0
              w-screen
              h-full
              bg-white
              p-8
              z-50
              flex flex-col
              transition-colors
              duration-300
            "
            :class="[background === 'light' ? 'bg-white' : 'bg-gray-darkest']"
            role="dialog"
            v-scroll-lock="true"
          >
            <div class="flex justify-end">
              <roa-icon-button
                @click="$emit('close')"
                icon="cross"
                id="closeButton"
                solid
                >Close Gallery View</roa-icon-button
              >
            </div>
            <div class="flex-1 -mx-4 sm:-mx-8 xl:-mx-16 overflow-hidden">
              <slider-wrapper
                scroll-control
                :controls="false"
                :options="sliderOptions"
                class="h-full"
              >
                <template #default="{ glide }">
                  <gallery-view-item
                    :white="background === 'dark'"
                    v-for="(artwork, idx) in artworks"
                    v-bind="{
                      ...artwork,
                      url: artwork.url || `/artworks/${artwork.id}`,
                      image: artwork.image,
                    }"
                    :key="idx"
                    @click="glide.go(`=${idx}`)"
                  ></gallery-view-item>
                </template>
              </slider-wrapper>
            </div>
            <div class="flex justify-end small-caps">
              <div
                class="flex"
                :class="[
                  background === 'light' ? 'text-gray-darkest' : 'text-white',
                ]"
              >
                Gallery Wall
                <button
                  @click="background = 'dark'"
                  class="pb-2 mx-2 focus:outline-none"
                  :class="{ 'border-b border-current': background === 'dark' }"
                >
                  <span
                    class="
                      block
                      bg-gray-darkest
                      w-4
                      h-4
                      border
                      rounded-full
                      border-current
                    "
                  ></span>
                </button>
                <button
                  @click="background = 'light'"
                  class="pb-2 focus:outline-none"
                  :class="{ 'border-b border-current': background === 'light' }"
                >
                  <span
                    class="
                      block
                      bg-white
                      w-4
                      h-4
                      border
                      rounded-full
                      border-current
                    "
                  ></span>
                </button>
              </div>
            </div>
          </section>
        </focus-trap>
      </div>
    </transition>
  </portal>
</template>

<script>
import SliderWrapper from "./SliderWrapper.vue";
import GalleryViewItem from "./GalleryViewItem.vue";
import { FocusTrap } from "focus-trap-vue";

export default {
  components: { SliderWrapper, FocusTrap, GalleryViewItem },
  props: {
    show: { type: Boolean, required: true },
    artworks: { type: Array, required: true },
  },
  data() {
    return {
      sliderOptions: {
        perView: 1,
        type: "carousel",
        focusAt: "center",
        gap: 50,
        peek: 600,
        breakpoints: {
          1600: {
            peek: 450,
          },
          1400: {
            peek: 350,
          },
          1100: {
            peek: 200,
          },
          800: {
            gap: 30,
            peek: 125,
          },
          700: {
            gap: 10,
            peek: 75,
          },
        },
      },
      background: "light",
    };
  },
};
</script>