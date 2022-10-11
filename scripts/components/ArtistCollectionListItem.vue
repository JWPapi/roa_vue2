<template>
  <li class="list-none">
    <a
      :href="url"
      class="focus:outline-none block group max-w-full whitespace-normal"
    >
      <div class="overflow-hidden pb-ratio h-0 relative">
        <roa-image
          :src="image"
          sizes="(max-width: 640px) 50vw, (max-width: 820px) 33vw, 25vw"
          :w="800"
          :h="500"
          :focalpoint="focalpoint"
          img-class="absolute inset-0 w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105 group-focus:scale-105"
        />
      </div>
      <h4 class="h4-uppercase mt-4">{{ artist }}</h4>
      <p class="paragraph text-gray mt-1" v-if="nationality || birthYear">
        {{ nationality }}<span v-if="birthYear">, {{ birthYear }}</span>
      </p>
    </a>
  </li>
</template>

<script>
export default {
  props: {
    image: { type: String, required: true },
    url: { type: String, required: true },
    artist: { type: String, required: true },
    nationality: { type: String },
    focalpoint: { type: String },
    birthYear: { type: String | Number },
  },
};
</script>

<style>
</style>