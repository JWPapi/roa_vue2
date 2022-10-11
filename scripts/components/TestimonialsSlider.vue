<template>
  <div class="-mx-4 sm:-mx-8 xl:-mx-16 mb-8">
    <slider-wrapper :options="sliderConfig" auto-height inset-buttons>
      <li
        v-for="(testimonial, idx) in testimonials"
        :key="idx"
        class="flex justify-center items-start w-full"
      >
        <div
          class="py-12 px-8 flex flex-col items-center w-full max-w-lg whitespace-normal text-center"
        >
          <roa-icon name="quotes" class="text-gray-light h3" />
          <h3 class="h3-uppercase my-8 text-gray-darkest">
            <a
              v-if="testimonial.url && testimonial.url.includes('http')"
              :href="testimonial.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ testimonial.title }}
            </a>
            <span v-else>{{ testimonial.title }}</span>
          </h3>
          <p class="h4 text-gray-solid mb-8">{{ testimonial.text }}</p>
          <p>{{ testimonial.name }}</p>
        </div>
      </li>
    </slider-wrapper>
  </div>
</template>

<script>
import SliderWrapper from "./SliderWrapper.vue";

export default {
  props: { testimonials: { type: Array, required: true } },
  components: { SliderWrapper },
  data() {
    return {
      sliderConfig: {
        type: "carousel",
        perView: 1,
      },
    };
  },
};
</script>