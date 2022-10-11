<template>
  <ul>
    <li
      v-for="(episode, idx) in episodes"
      :key="idx"
      class="text-gray-darkest mb-4 p-6 bg-gray-lightest max-w-2xl rounded"
    >
      <p class="small-caps">Episode {{ episodes.length - idx }}</p>
      <h2 class="h4-uppercase my-2">{{ episode.title }}</h2>
      <div class="prose-sm my-4" v-html="episode.description"></div>
      <roa-audio-player :src="episode.src" />
    </li>
  </ul>
</template>

<script>
import RoaAudioPlayer from "../components/base/RoaAudioPlayer";
export default {
  components: {
    RoaAudioPlayer,
  },
  props: {
    episodes: Array,
  },
};
</script>

<style lang="scss" scoped>
</style>