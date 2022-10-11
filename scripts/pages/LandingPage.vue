<template>
  <div v-if="!loading" class="py-8">
    <section-heading
      v-bind="{
        intro: 'Discover',
        muted: 'Newly',
        main: 'added',
        href: '/artworks',
        cta: 'Discover more',
      }"
    />

    <ul class="masonry mt-8 -mx-4">
      <artwork-masonry-list-item
        v-for="artwork in recentArtworks"
        :key="artwork.id"
        :artwork="artwork"
      ></artwork-masonry-list-item>
    </ul>

    <roa-button @click="loadMoreArtworks" secondary class="w-full mx-auto mt-8">
      Load more artworks
    </roa-button>

    <section
      class="
        my-8
        -mx-4
        sm:-mx-8
        xl:-mx-16
        px-4
        sm:px-8
        xl:px-16
        py-8
        bg-gray-lightest
        flex
      "
    >
      <div class="flex flex-col justify-between w-full">
        <h2 class="h2 uppercase">
          <a href="/collections">Curated Collections</a>
        </h2>
        <div class="mt-10 -mx-4 sm:-mx-8 xl:-mx-16">
          <slider-wrapper :controls="false" preset="collections">
            <collection-list-item
              v-for="collection in collections"
              :key="collection.id"
              class="p-2 w-1/2 flex-grow min-w-0"
              :url="collection.url"
              :image="collection.imageUrl"
              :focalpoint="collection.focalpoint"
              :title="collection.title"
            ></collection-list-item>
          </slider-wrapper>
        </div>
        <roa-link-button class="w-full" href="/collections">
          Discover the collections
        </roa-link-button>
      </div>
    </section>

    <artworks-slider
      v-for="{ artist, artworks } in artistsData"
      :key="artist.title"
      class="mt-16"
      :artworks="artworks"
      :heading="{
        intro: 'Featured Artist',
        main: artist.title,
        href: artist.url,
        cta: 'Discover more',
      }"
    />

    <section-heading
      class="mt-16"
      v-bind="{
        intro: 'Discover',
        muted: 'All',
        main: 'artworks',
        href: '/artworks',
        cta: 'Discover more',
      }"
    />

    <div class="-mx-4 mt-4">
      <ul
        class="masonry"
        v-for="(group, idx) in groupedOldestArtworks"
        :key="idx"
      >
        <artwork-masonry-list-item
          v-for="artwork in group"
          :key="artwork.id"
          class="artworks-grid-item"
          :artwork="artwork"
        />
      </ul>
    </div>
  </div>
  <roa-logo v-else type="spinning" class="my-16 mx-auto" />
</template>

<script>
import { db } from "../db";
import SliderWrapper from "../components/SliderWrapper";
import SectionHeading from "../components/SectionHeading.vue";
import ArtworksSlider from "../components/ArtworksSlider.vue";
export default {
  components: { SliderWrapper, SectionHeading, ArtworksSlider },
  props: {
    artists: Array,
    collections: Array,
  },
  data() {
    return {
      allArtworks: [],
      artistsData: [],
      loading: true,
      recentArtworksCount: 24,
      oldestArtworksCount: 24,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  unmounted() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  async created() {
    await Promise.all([
      ...this.artists.map(async (artist) => {
        const artistReference = db.collection("artists").doc(artist.id);
        let artworks = [
          ...(
            await db
              .collection("artworks")
              .where("available", "==", true)
              .where("artistReference", "==", artistReference)
              .get()
          ).docs.map((artworkRef) => ({
            id: artworkRef.id,
            ...artworkRef.data(),
          })),
        ];
        this.artistsData.push({
          artist,
          artworks,
        });
      }),
      this.loadArtworks(),
    ]);
    this.loading = false;
  },
  computed: {
    recentArtworks() {
      return this.allArtworks.slice(0, this.recentArtworksCount);
    },
    oldestArtworks() {
      return [...this.allArtworks].reverse().slice(0, this.oldestArtworksCount);
    },
    groupedOldestArtworks() {
      const groupSize = 24 * 3;
      const groupCount = Math.ceil(this.oldestArtworksCount / groupSize);
      const groupedArtworks = [];
      for (let idx = 0; idx < groupCount; idx++) {
        groupedArtworks.push(
          this.oldestArtworks.slice(idx * groupSize, (idx + 1) * groupSize)
        );
      }
      return groupedArtworks;
    },
  },
  methods: {
    loadMoreArtworks() {
      this.recentArtworksCount += 24;
    },
    loadArtworks() {
      return this.$bind(
        "allArtworks",
        db
          .collection("artworks")
          .where("available", "==", true)
          .where("unlisted", "==", false)
          .orderBy("date", "desc"),
        { maxRefDepth: 0 }
      );
    },
    async handleScroll() {
      const offset = 1000;
      const bottomOfWindow =
        document.documentElement.scrollTop + window.innerHeight >=
        document.documentElement.offsetHeight - offset;
      if (bottomOfWindow) {
        this.oldestArtworksCount = this.oldestArtworksCount + 24;
      }
    },
  },
};
</script>