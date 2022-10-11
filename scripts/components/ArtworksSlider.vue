<template>
  <div>
    <section-heading v-if="heading" class="mb-8" v-bind="heading" />
    <div v-if="artworks.length > 4" class="-mx-4 sm:-mx-8 xl:-mx-16">
      <slider-wrapper preset="artworks" inset-buttons>
        <artwork-list-item
          v-for="(artwork, idx) in artworks"
          :key="artwork.id + idx"
          :artwork="artwork"
        />
      </slider-wrapper>
    </div>
    <div v-else>
      <ul class="artworks-grid">
        <artwork-list-item
          v-for="(artwork, idx) in artworks"
          :key="artwork.id + idx"
          class="artworks-grid-item"
          :artwork="artwork"
        />
      </ul>
    </div>
    <roa-link-button
      v-if="heading.href && heading.cta"
      href="/artworks"
      class="w-full mt-8 sm:hidden"
    >
      {{ heading.cta }}
    </roa-link-button>
  </div>
</template>

<script>
import SliderWrapper from "./SliderWrapper.vue";
import SectionHeading from "./SectionHeading.vue";
export default {
  components: { SliderWrapper, SectionHeading },
  props: {
    artworks: { type: Array, required: true },
    heading: { type: Object },
  },
};
</script>