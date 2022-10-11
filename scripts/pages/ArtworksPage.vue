<template>
  <section class="mt-8 mb-16">
    <div class="lg:hidden mt-10 mb-8">
      <slot name="breadcrumbs"></slot>
    </div>
    <h2 class="h3 mb-8">
      <span class="handwritten">Artworks</span>
    </h2>
    <div class="flex items-center justify-between mb-4 -mr-2">
      <roa-badge :number="filterCount" :show="!!filterCount">
        <roa-button
          secondary
          class="flex-shrink-0"
          icon="sliders"
          @click="showFilters = true"
        >
          Filters
        </roa-button>
      </roa-badge>
      <roa-input
        clearable
        class="flex-1 mx-4 hidden sm:flex justify-center"
        type="search"
        required
        placeholder="Artist, title, style,..."
        novalidate
        label="Search"
        v-model.lazy="queryOptions.search"
        autofocus
      />
      <roa-icon-radio
        :options="[
          { icon: 'grid', value: 'grid', label: 'Show grid layout' },
          { icon: 'masonry', value: 'column', label: 'Show column layout' },
        ]"
        name="view"
        v-model="view"
      />
    </div>
    <roa-input
      clearable
      class="sm:hidden"
      autofocus
      type="search"
      required
      novalidate
      label="Search"
      v-model.lazy="queryOptions.search"
    />

    <the-artfinder
      v-if="showFilters"
      :value="queryOptions"
      @input="submitNewQuery"
      @close="submitNewQuery"
      @reset="resetFilters"
    />
    <transition name="fade" mode="out-in">
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center"
        key="loading"
      >
        <roa-logo type="spinning" class="my-16" />
        <p class="h4-uppercase">Loading...</p>
      </div>
      <div
        v-else-if="filteredArtworks.length === 0"
        key="no_artworks"
        class="text-center text-gray-solid my-16"
      >
        <roa-icon name="search" class="text-6xl mx-auto"></roa-icon>
        <p class="h3 mt-8">No artworks for your selection.</p>
        <roa-button
          v-if="filterCount"
          class="mt-8"
          @click="resetFilters(true)"
          icon="cross"
        >
          Reset filters
        </roa-button>
      </div>
      <div v-else key="artworks">
        <p class="paragraph my-4 text-gray-darkest">
          <span>{{ filteredArtworks.length }}</span>
          <span class="text-gray-solid"> available</span>
          <span>artwork{{ filteredArtworks.length ? "s" : "" }} </span>
          <span class="text-gray-solid" v-if="filterCount">
            for your selection
          </span>
        </p>
        <artwork-list :artworks="displayedArtworks" :view="view" />
      </div>
    </transition>
  </section>
</template>
<script>
import ArtworkMasonryListItem from "../components/ArtworkMasonryListItem";
import ArtworkList from "../components/ArtworkList";
import cloneDeep from "lodash.clonedeep";
import TheArtfinder from "../components/TheArtfinder";
import { db } from "../db";

export default {
  components: { ArtworkMasonryListItem, ArtworkList, TheArtfinder },
  data() {
    const { defaultQueryOptions, options } = window.roa;
    return {
      queryOptions: cloneDeep(defaultQueryOptions),
      defaultQueryOptions,
      options,
      // state
      view: "column",
      artworks: [],
      artists: [],
      urlParams: new URLSearchParams(location.search),
      artworksDisplayed: 60,
      loading: true,
      showFilters: false,
      filteredArtworks: [],
    };
  },
  created() {
    this.getQueryOptionsFromSearchParams();
    this.fetchArtworks();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  watch: {
    "queryOptions.search"(value) {
      this.filterArtworks();
      this.setUrlParameter("q", value);
    },
  },
  computed: {
    filterCount() {
      let count = 0;
      const { artists, prices, sizes, categories, nationalities } =
        this.queryOptions;
      if (artists?.length) count++;
      if (categories?.length) count++;
      if (nationalities?.length) count++;
      if (prices?.length && prices.length !== this.options.price.length)
        count++;
      if (sizes?.length && sizes.length !== this.options.size.length) count++;
      return count;
    },
    displayedArtworks() {
      return this.filteredArtworks.slice(0, this.artworksDisplayed);
    },
    // group artworks for the masonry layout
    groupedArtworks() {
      if (this.view === "grid") return [];
      const groupSize = 60;
      const groupCount = Math.ceil(this.artworksDisplayed / groupSize);
      const groups = new Array(groupCount).fill(1);
      const groupedArtworks = groups.map((_, idx) => {
        return this.displayedArtworks.slice(
          idx * groupSize,
          (idx + 1) * groupSize
        );
      });
      return groupedArtworks;
    },
  },
  methods: {
    resetFilters(queryAfter = false) {
      this.queryOptions = cloneDeep(this.defaultQueryOptions);
      if (queryAfter) this.submitNewQuery();
    },
    updateAllUrlParameters() {
      const { artists, categories, prices, sizes, sort, nationalities } =
        this.queryOptions;
      this.setUrlParameter("artists", !!artists?.length && artists);
      this.setUrlParameter("categories", !!categories?.length && categories);
      const pricesAreNotDefault =
        !!prices?.length && prices.length !== this.options.price.length;
      this.setUrlParameter("prices", pricesAreNotDefault && prices);
      const sizesAreNotDefault =
        !!sizes?.length && sizes.length !== this.options.size.length;
      this.setUrlParameter("sizes", sizesAreNotDefault && sizes);
      this.setUrlParameter(
        "sort",
        sort.value !== this.options.sort[0].value && sort.value
      );
      this.setUrlParameter(
        "nationalities",
        nationalities.length ? nationalities : null
      );
    },
    async submitNewQuery() {
      this.showFilters = false;
      await this.fetchArtworks();
      this.artworksDisplayed = 60;
      this.updateAllUrlParameters();
    },
    buildQuery(options) {
      let query = db
        .collection("artworks")
        .where("unlisted", "==", false)
        .where("available", "==", true);
      switch (options.sort.value) {
        case "price":
          query = query.orderBy("price", "asc");
          break;
        case "price:desc":
          query = query.orderBy("price", "desc");
          break;
        case "size":
          query = query.orderBy("area", "asc");
          break;
        case "size:desc":
          query = query.orderBy("area", "desc");
          break;
        default:
          query = query.orderBy("date", "desc");
      }
      return query;
    },
    filterArtworks() {
      this.filteredArtworks = this.artworks.filter(this.filter);
    },
    filter(artwork) {
      const options = this.queryOptions;
      if (
        options.sizes?.length &&
        options.sizes.length !== this.options.size.length
      ) {
        const size = Math.max(artwork.width, artwork.height);
        const artworkSizeCategory = this.options.size.find(
          ({ min = 0, max = Infinity }) => {
            if (size <= min) return false;
            if (size > max) return false;
            return true;
          }
        );
        if (!options.sizes.includes(artworkSizeCategory)) return false;
      }

      if (
        options.prices?.length &&
        options.prices.length !== this.options.price.length
      ) {
        const artworkPriceCategory = this.options.price.find(
          ({ min = 0, max = Infinity }) => {
            if (artwork.price <= min) return false;
            if (artwork.price > max) return false;
            return true;
          }
        );

        if (!options.prices.includes(artworkPriceCategory)) return false;
      }

      if (options.categories?.length) {
        if (!artwork.categories) return false;
        const matches = artwork.categories
          .map(({ slug }) => slug)
          .filter((category) =>
            options.categories.map(({ value }) => value).includes(category)
          );
        if (matches.length === 0) return false;
      }

      if (options.artists?.length) {
        const match = options.artists.find(
          (searchArtist) => searchArtist === artwork.artist.title
        );
        if (!match) return false;
      }

      if (
        options.nationalities?.length &&
        !options.nationalities.includes(artwork.artist.nationality)
      )
        return false;

      if (this.queryOptions.search.length) {
        // query string search
        const index = `${artwork.artist?.title || ""} ${artwork.title} ${
          artwork.categories
            ? artwork.categories.map(({ title }) => title).join(" ")
            : ""
        }`.toLowerCase();
        const queryTerms = this.queryOptions.search
          .toLowerCase()
          .split(" ")
          .filter(Boolean);
        const results = queryTerms
          .map((term) => {
            return index.indexOf(term) >= 0;
          })
          .filter(Boolean);
        if (!results.length) return false;
      }
      return true;
    },
    async fetchArtworks() {
      this.loading = true;
      const query = this.buildQuery(this.queryOptions);
      await this.$bind("artworks", query, { maxRefDepth: 0 });
      this.filterArtworks();
      this.loading = false;
    },
    getQueryOptionsFromSearchParams() {
      const sort = this.options.sort.find(
          (sorting) => sorting.value === this.urlParams.get("sort")
        ),
        search = this.urlParams.get("q"),
        artists = this.urlParams.getAll("artists"),
        categories = this.urlParams.getAll("categories"),
        nationalities = this.urlParams.getAll("nationalities");
      if (sort) this.queryOptions.sort = sort;
      if (search) this.queryOptions.search = search;
      if (artists?.length) this.queryOptions.artists = artists;
      if (nationalities?.length)
        this.queryOptions.nationalities = nationalities;
      if (categories?.length)
        this.queryOptions.categories = this.options.category.filter(
          ({ value }) => categories.includes(value)
        );
      const sizes = this.urlParams.getAll("sizes");
      if (sizes?.length) {
        this.queryOptions.sizes = this.options.size.filter((option) =>
          sizes.includes(option.value)
        );
      }
      const prices = this.urlParams.getAll("prices");
      if (prices?.length) {
        this.queryOptions.prices = this.options.price.filter((option) =>
          prices.includes(option.value)
        );
      }
    },
    setUrlParameter(key, value) {
      if (!value || String(value).length === 0) {
        this.urlParams.delete(key);
      } else if (value instanceof Array) {
        this.urlParams.delete(key);
        value.forEach((val, idx) => {
          if (val instanceof Object) this.urlParams.append(key, val.value);
          else if (typeof val === "boolean") {
            if (val) this.urlParams.append(key, idx);
          } else this.urlParams.append(key, val);
        });
      } else {
        this.urlParams.set(key, value);
      }
      window.history.replaceState(
        {},
        null,
        `${location.pathname}${this.urlParams.toString() ? "?" : ""}${
          this.urlParams
        }`
      );
    },
    handleScroll() {
      if (this.filteredArtworks.length <= this.artworksDisplayed) return;
      const Offset = this.view === "column" ? 2000 : 500;
      const bottomOfWindow =
        document.documentElement.scrollTop + window.innerHeight >=
        document.documentElement.offsetHeight - Offset;
      if (bottomOfWindow) this.artworksDisplayed = this.artworksDisplayed + 60;
    },
  },
};
</script>