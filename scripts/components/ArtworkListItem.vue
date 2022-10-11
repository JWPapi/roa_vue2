<template>
  <li class="list-none relative p-1">
    <a
      :href="artwork.url"
      class="
        relative
        block
        group
        focus:outline-none
        max-w-full
        whitespace-normal
      "
    >
      <p
        v-if="!artwork.available"
        class="pill-sold z-10 absolute top-0 right-0 m-4"
      >
        Sold
      </p>
      <div
        v-if="!artwork.shadow"
        class="
          relative
          bg-gray-lightest
          artwork-without-shadow-wrapper
          pb-1/1
          h-0
          overflow-hidden
        "
      >
        <roa-image
          :src="artwork.image"
          :focalpoint="artwork.focalpoint"
          sizes="(max-width: 640px) 50vw, (max-width: 820px) 33vw, 25vw"
          img-class="absolute inset-0 transition-transform artwork-without-shadow-image duration-700 ease-out-exp transform w-full h-full"
        />
      </div>
      <roa-image
        v-else
        :src="artwork.image"
        spotlight
        sizes="(max-width: 640px) 50vw, (max-width: 820px) 33vw, 25vw"
      />
      <p class="h4-uppercase mt-4" v-if="artwork.artist">
        {{ artwork.artist.title }}
      </p>
      <p
        class="paragraph text-gray-solid mt-1"
      >
        {{ artwork.title }}<span v-if="artwork.year">, {{ artwork.year }}</span>
      </p>
      <p class="paragraph text-gray-solid mt-1" v-if="artwork.edition">
        Edition of {{ artwork.edition }}
      </p>
      <p
        class="paragraph text-gray-solid mt-5 artwork-list-item-price"
        v-if="artwork.price"
      >
        {{ artwork.price | money(currentCurrency) }}
      </p>
    </a>
  </li>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    artwork: { type: Object, required: true },
  },
  computed: {
    ...mapGetters(["currentCurrency"]),
  },
};
</script>

<style lang="scss">
@media (hover: hover) {
  .artwork-without-shadow-wrapper {
    clip-path: inset(0);
    transition: clip-path 700ms cubic-bezier(0.5, 0, 0.15, 1);
  }

  .group:hover,
  .group:focus {
    .artwork-without-shadow-wrapper {
      clip-path: inset(3px);
    }

    .artwork-without-shadow-image {
      @apply scale-102;
    }

    .artwork-with-shadow-wrapper {
      @apply scale-98 opacity-75;
    }

    .artwork-with-shadow-image {
      @apply scale-102;
    }
  }
}
</style>