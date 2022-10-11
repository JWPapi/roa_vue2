<template>
  <portal to="search">
    <transition name="slide-up" appear>
      <focus-trap>
        <div
        ref="scrollWindow"
          class="
            bg-gray-lightest
            fixed
            inset-0
            z-50
            overflow-y-auto
            p-4
            sm:p-8
            pb-16
          "
          v-scroll-lock="true"
          @keydown.esc="$emit('close')"
        >
          <div class="flex items-center justify-end">
            <roa-icon-button
              icon="cross"
              solid
              class="bg-white"
              @click="$emit('close')"
            >
              Close
            </roa-icon-button>
          </div>
          <div class="flex items-center justify-start overflow-hidden">
            <roa-icon-button
              v-if="query.length"
              @click="query = ''"
              icon="cross"
            >
              Clear search
            </roa-icon-button>
            <roa-icon-button v-else @click="focusSearchInput()" icon="search">
              Focus search
            </roa-icon-button>
            <input
              v-model="query"
              type="search"
              ref="searchInput"
              autocomplete="off"
              spellcheck="false"
              autocorrect="off"
              class="w-full h2 bg-transparent focus:outline-none sm:ml-4 h-16"
              placeholder="Artist, title, style,..."
            />
          </div>
          <p v-if="loading" class="paragraph sm:ml-16 mt-1">
            <roa-icon name="spinner" class="inline-block" /> Loading...
          </p>
          <div v-else-if="query.length > 0">
            <p class="paragraph mb-2 mt-8">Artists found ({{ filteredArtists.length || 0 }})</p>
            <ul v-if="filteredArtists.length" class="artworks-grid" ref="grid">
              <artist-collection-list-item
                v-for="artist in extendedArtists"
                :key="artist.id"
                data-aos="appear"
                class="p-2 w-1/2 md:w-1/3 lg:w-1/4"
                :image="artist.image || ''"
                :focalpoint="artist.focalpoint"
                :url="artist.url"
                :artist="artist.title"
                :nationality="artist.nationality"
                :birth-year="artist.birth_year"
              ></artist-collection-list-item>
            </ul>
            <div class="sm:flex mb-2 mt-8 items-center justify-between">
              <p class="paragraph">Artworks found ({{ filteredArtworks.length || 0 }})</p>
              <roa-icon-radio
                v-if="filteredArtworks.length"
                :options="[
                  { icon: 'grid', value: 'grid', label: 'Show grid layout' },
                  {
                    icon: 'masonry',
                    value: 'column',
                    label: 'Show column layout',
                  },
                ]"
                name="view"
                v-model="view"
              />
            </div>
            <artwork-list
              v-if="filteredArtworks.length"
              :artworks="displayedArtworks"
              :view="view"
            />
            <div v-else class="text-center my-16">
              <p class="paragraph mx-auto mb-4">No available artworks could be found</p>
              <roa-link-button secondary href="/artworks">
                Browse artworks
              </roa-link-button>
            </div>
          </div>
          <p v-else class="paragraph sm:ml-16 mt-2 text-gray">
            Find artworks suited to your taste.
          </p>
        </div>
      </focus-trap>
    </transition>
  </portal>
</template>

<script>
import { FocusTrap } from "focus-trap-vue";
import { db } from "../db";
import debounce from "lodash.debounce";
import ArtworkList from "./ArtworkList";
import Vue from "vue";

export default {
  components: { FocusTrap, ArtworkList },
  data() {
    return {
      query: "",
      artworks: [],
      artists: [],
      filteredArtworks: false,
      filteredArtists: false,
      loading: false,
      view: "column",
      artworksDisplayed: 60,
    };
  },
  computed: {
    displayedArtworks() {
      if (!this.filteredArtworks) return [];
      return this.filteredArtworks.slice(0, this.artworksDisplayed);
    },
    extendedArtists() {
      return this.filteredArtists.map((artist) => {
        const extendedArtist = { ...artist };
        extendedArtist["image"] = artist.photo;
        if (artist.cover_image) {
          extendedArtist["image"] = artist.cover_image;
          extendedArtist["focalpoint"] = artist.cover_image_focus;
        } else if (artist.featured_artwork) {
          extendedArtist["image"] = artist.featured_artwork.image;
          extendedArtist["focalpoint"] = artist.featured_artwork.image_focus;
        }
        return extendedArtist;
      });
    },
  },
  watch: {
    query(value) {
      if (value && value.length === 0) return;
      this.loading = true;
      this.filterResults();
    },
  },
  async created() {
    await this.$bind(
      "artworks",
      db
        .collection("artworks")
        .where("unlisted", "==", false)
        .where("available", "==", true)
        .orderBy("date", "desc"),
      { maxRefDepth: 0 }
    );
    await this.$bind(
      "artists",
      db
        .collection("artists")
        .orderBy("date", "desc"),
      { maxRefDepth: 1 }
    );
  },
  beforeDestroy() {
    this.$refs.scrollWindow.removeEventListener("scroll", this.handleScroll);
  },
  mounted() {
    Vue.nextTick(this.focusSearchInput);
    Vue.nextTick(() => {
      this.$refs.scrollWindow.addEventListener("scroll", this.handleScroll)});
  },
  methods: {
    filterResults: debounce(function () {
      this.filteredArtworks = this.artworks.filter(this.filterArtwork);
      this.filteredArtists = this.artists.filter(this.filterArtist);
      this.loading = false;
    }, 1000),
    filterArtwork(artwork) {
      if (this.query) {
        const index = `${artwork.artist?.title || ""} ${artwork.title} ${
          artwork.categories
            ? artwork.categories.map(({ title }) => title).join(" ")
            : ""
        }`.toLowerCase();
        const queryTerms = this.query.toLowerCase().split(" ").filter(Boolean);
        const result = queryTerms
          .map((term) => { // for each term
            return index.indexOf(term) >= 0; // add to new array 'true'/'false' if it exists
          })
          .every(Boolean); // if all values are true
        return result;
      }
    },
    filterArtist(artist) {
      if (this.query) {
        const index = artist.title.toLowerCase();
        const queryTerms = this.query.toLowerCase().split(" ").filter(Boolean);
        const result = queryTerms
          .map((term) => { // for each term
            return index.indexOf(term) >= 0; // add to new array 'true'/'false' if it exists
          })
          .every(Boolean); // if all values are true
        return result;
      }
    },
    focusSearchInput() {
      this.$refs.searchInput?.focus();
    },
    handleScroll() {
      console.log('handle scroll ', );
      if (this.filteredArtworks.length <= this.artworksDisplayed) return;
      const offset = 500;
      const bottomOfWindow =
        this.$refs.scrollWindow.scrollTop + window.innerHeight >=
        this.$refs.scrollWindow.scrollHeight - offset;
      if (bottomOfWindow) this.artworksDisplayed = this.artworksDisplayed + 60;
    },
  },
};
</script>

<style scoped>
input::placeholder {
  @apply text-gray-light;
}

input:invalid {
  box-shadow: none;
}

input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  -webkit-appearance: none;
}
</style>