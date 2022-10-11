<template>
  <div
    :data-artwork="artwork.id"
    class="card"
    :style="{ boxShadow: `0 0 ${opacity * 2}em #0003` }"
  >
    <div
      class="z-10 text-5xl uppercase origin-center h-full w-full absolute inset-0 text-center self-end flex justify-center items-center"
      :style="{ opacity, background: '#fffa' }"
    >
      <p v-if="likes">
        <span class="handwritten">Like</span> <span class="arrow">→</span>
      </p>
      <p v-else>
        <span class="arrow">←</span> <span class="handwritten">Pass</span>
      </p>
    </div>
    <roa-image
      :spotlight="artwork.shadow"
      img-class="pointer-events-none"
      class="w-full"
      sizes="(max-width: 384px) 100vw, 384px"
      :src="artwork.image"
      :w="500"
    />
  </div>
</template>

<script>
export default {
  props: {
    artwork: { type: Object, required: true },
    dragConfidence: { type: Number, required: true },
    likes: { type: Boolean, required: false },
  },
  computed: {
    opacity() {
      const threshold = 0.1;
      const value = (this.dragConfidence - threshold) * 3;
      return this.dragConfidence < threshold ? 0 : value;
    },
  },
};
</script>

<style>
.card {
  @apply w-full max-w-sm mx-auto bg-white absolute inset-0 overflow-hidden;

  filter: brightness(0.9);
  height: fit-content;
  transition: filter 100ms ease-out;
}

.card[data-proceed="true"] {
  display: none;
}

.card:last-of-type {
  filter: brightness(1);
}
</style>
