<template>
  <div class="mx-4 md:mx-8 xl:mx-16 my-16">
    <section class="md:flex items-center mb-8">
      <div class="flex-1">
        <p class="h3-uppercase text-gray-solid">Your personal</p>
        <h2 class="h3 mt-2">
          <span class="handwritten text-gray-darkest">Recommendations</span>
        </h2>
        <p class="paragraph mt-6 text-gray-darkest">
          A curated selection of artworks tailored to your individual taste.
        </p>
      </div>
      <div class="flex items-center justify-between mt-4 md:mt-0">
        <roa-button secondary @click="$emit('restart')">Restart</roa-button>
        <roa-icon-radio
          :options="[
            { icon: 'masonry', value: 'column', label: 'Show column layout' },
            { icon: 'grid', value: 'grid', label: 'Show grid layout' },
          ]"
          name="view"
          v-model="view"
          class="ml-2"
        ></roa-icon-radio>
      </div>
    </section>
    <transition name="fade" mode="out-in">
      <ul class="masonry -mx-4" v-if="view === 'column'">
        <artwork-masonry-list-item
          v-for="artwork in extendedArtworks"
          :key="artwork.id"
          :artwork="artwork"
        />
      </ul>
      <ul class="artworks-grid" v-else-if="view === 'grid'">
        <artwork-list-item
          v-for="artwork in extendedArtworks"
          :key="artwork.id"
          class="artworks-grid-item"
          :artwork="artwork"
        />
      </ul>
    </transition>
  </div>
</template>

<script>
import Vue from "vue";

function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(" ", "-")
    .toLowerCase();
}
window.slugify = slugify;
export default {
  props: ["data"],
  data() {
    return {
      showSubscribeModal: false,
      subscribed: false,
      view: "column",
      macy: null,
    };
  },
  computed: {
    extendedArtworks() {
      return this.data.artworks.map((artwork) => ({
        ...artwork,
        artist:
          typeof artwork.artist === "string"
            ? {
                title: artwork.artist,
                url: `/artists/${slugify(artwork.artist)}`,
              }
            : artwork.artist,
      }));
    },
  },
  updated() {
    Vue.nextTick(() => {
      this.macy?.recalculate(true, true);
    });
  },
  methods: {
    toggleSubscribeModal() {
      this.showSubscribeModal = !this.showSubscribeModal;
    },
    onSuccess() {
      setTimeout(() => {
        this.showSubscribeModal = false;
        this.subscribed = true;
      }, 5000);
    },
    formatPrice(price) {
      return parseFloat(price).toLocaleString("en") + ".00";
    },
  },
};
</script>
<style>
.header .text {
  flex: 1;
  margin-bottom: 1rem;
}

.recommendations ul {
  list-style: none;
  margin: 1em 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
}

.recommendations ul li {
  background: white;
  padding: 15px;
  width: 33.333%;
}

.recommendations ul li:first-child {
  border-top: 0;
}

.recommendations ul li a {
  display: flex;
  text-decoration: none;
  color: black;
  flex-direction: column;
}

.recommendations ul li a img {
  margin-right: 30px;
  max-width: 100%;
  margin-bottom: 15px;
  object-fit: contain;
}

.recommendations ul li a h3 {
  font-weight: 400;
  font-size: 13px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.recommendations ul li a p {
  font-size: 13px;
  margin-bottom: 0;
}

@media (max-width: 767px) {
  .recommendations ul li {
    width: 50%;
  }

  .recommendations ul li a img {
    margin-right: 0;
  }
}
</style>
