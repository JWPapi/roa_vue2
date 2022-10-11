<template>
  <li class="flex h-full items-center justify-center" @click="$emit('click')">
    <div
      class="
        flex flex-col
        items-center
        h-full
        flex-grow-0
        justify-center
        max-w-xl max-h-full
      "
    >
      <roa-image
        :src="image"
        :w="1000"
        :h="1000"
        sizes="(min-width: 1600px) 25vw, (min-width: 1200px) 33vw, 50vw"
        loading="eager"
        fit="max"
        class="
          flex
          items-stretch
          justify-center
          overflow-hidden
          image
          cursor-pointer
        "
        :class="
          white ? 'opacity-25 hover:opacity-50' : 'opacity-50 hover:opacity-75'
        "
        img-class="object-contain max-w-full max-h-full flex-1"
      ></roa-image>
      <div
        class="
          flex-shrink-0 flex flex-col
          sm:flex-row
          justify-between
          items-center
          sm:items-start
          mt-8
          details
          opacity-0
          w-full
        "
      >
        <div>
          <p
            class="paragraph-sm uppercase"
            :class="white ? 'text-white' : 'text-gray-darkest'"
          >
            {{ artist.title }}
          </p>
          <p class="paragraph whitespace-normal text-gray-solid">
            {{ title }}<span v-if="year">, {{ year }}</span>
          </p>
        </div>
        <roa-link-button
          class="mt-2 sm:mt-0"
          secondary
          :white="white"
          :href="url"
          icon="bag"
        >
          Details
        </roa-link-button>
      </div>
    </div>
  </li>
</template>

<script>
import RoaImage from "./base/RoaImage.vue";
export default {
  props: {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    url: { type: String, required: true },
    image: { type: String, required: true },
    white: { type: Boolean, default: false },
    year: { type: String | Number },
  },
  components: { RoaImage },
};
</script>

<style lang="scss" scoped>
li {
  transition: transform 200ms ease-out;
  transform: scale(0.75);

  .image {
    transition: opacity 200ms ease, transform 200ms ease-in;

    &:hover {
      transform: scale(1.01);
    }
  }

  &.is-active {
    z-index: 1;
    transform: scale(1);

    .image {
      opacity: 1;

      &:hover {
        transform: none;
        cursor: unset;
      }
    }

    .details {
      opacity: 1;
    }
  }
}
</style>