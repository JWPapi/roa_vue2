<template>
  <li class="list-none">
    <a
      :href="url"
      class="
        focus:outline-none
        group
        focus:outline-black
        block
        relative
        h-0
        pb-ratio
        overflow-hidden
        whitespace-normal
      "
    >
      <div class="absolute inset-0 max-w-full">
        <roa-image
          :src="image"
          :focalpoint="focalpoint"
          sizes="(max-width: 640px) 50vw, (max-width: 820px) 33vw, 25vw"
          :w="1000"
          :h="625"
          :img-class="{
            'w-full object-cover transform transition-transform duration-500 group-hover:scale-105 group-focus:scale-105': true,
          }"
        />
        <div
          class="
            absolute
            px-2
            inset-0
            bg-black
            group-hover:bg-opacity-25
            group-focus:bg-opacity-25
            transition-colors
            duration-500
            bg-opacity-35
            flex flex-col
            items-center
            justify-center
            text-white text-center
          "
        >
          <p
            :class="{
              'paragraph uppercase lg:h3-uppercase': !featured,
              'paragraph uppercase sm:h3-uppercase': featured,
            }"
            v-html="title"
          ></p>
          <p
            class="tiny sm:paragraph"
            v-if="subtitle && featured"
            v-html="subtitle"
          ></p>
        </div>
      </div>
    </a>
  </li>
</template>

<script>
export default {
  props: {
    image: { type: String, required: true },
    url: { type: String, required: true },
    featured: { type: Boolean, default: false },
    title: { type: String, required: true },
    focalpoint: { type: String },
    subtitle: { type: String },
  },
};
</script>