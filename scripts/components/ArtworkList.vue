<template>
  <div v-if="view === 'column'" key="column">
    <ul
      v-for="(group, idx) in groupedArtworks"
      :key="idx"
      class="mt-4 masonry -mx-4"
    >
      <artwork-masonry-list-item
        v-for="artwork in group"
        :key="artwork.id"
        :artwork="artwork"
      />
    </ul>
  </div>
  <ul v-else class="mt-4 artworks-grid" key="grid">
    <artwork-list-item
      v-for="artwork in artworks"
      :key="artwork.id"
      class="artworks-grid-item"
      :artwork="artwork"
    />
  </ul>
</template>

<script>
export default {
  props: {
    artworks: { type: Array, required: true },
    view: { type: String, default: "column" },
  },
  computed: {
    groupedArtworks() {
      if (this.view === "grid") return [];
      const groupSize = 60;
      const groupCount = Math.ceil(this.artworks.length / groupSize);
      const groups = new Array(groupCount).fill(1);
      const groupedArtworks = groups.map((_, idx) => {
        return this.artworks.slice(idx * groupSize, (idx + 1) * groupSize);
      });
      return groupedArtworks;
    },
  },
};
</script>