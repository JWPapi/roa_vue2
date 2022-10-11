<template>
  <div>
    <section-heading v-if="heading" v-bind="heading" />
    <p class="small-caps text-left mb-8 mt-4 text-gray-darkest">
      Click images to expand
    </p>
    <photoswipe>
      <ul class="flex flex-wrap -m-4">
        <li
          v-for="(media, idx) in media"
          :key="idx"
          class="p-4 sm:h-72 sm:w-1/2 w-full"
          :class="media._video ? 'md:w-96' : 'md:w-72'"
        >
          <iframe
            v-if="media._video"
            :src="`${media.src}?modestbranding=1`"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen
            loading="lazy"
            class="w-full h-72 sm:h-full border-none"
          ></iframe>
          <roa-image
            v-else
            :src="media.src"
            lightbox
            :w="null"
            :h="null"
            class="w-full h-full object-cover"
          ></roa-image>
        </li>
      </ul>
    </photoswipe>
  </div>
</template>

<script>
import SectionHeading from "./SectionHeading.vue";
export default {
  components: { SectionHeading },
  props: {
    media: { type: Array, required: true },
    heading: { type: Object },
  },
};
</script>