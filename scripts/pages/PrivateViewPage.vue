<template>
  <section v-cloak class="mb-16 mt-8">
    <h1 class="h3 mb-16">
      <span class="handwritten">Private View</span>
    </h1>
    <roa-logo v-if="$auth.loading" type="spinning" class="mx-auto my-16" />
    <div v-else-if="!$auth.loggedIn" class="max-w-xl mx-auto mb-16">
      <p class="my-8 h4">
        There {{ startTime ? "will be" : artworksCount === 1 ? "is" : "are" }}
        {{ artworksCount }} artwork{{ artworksCount === 1 ? "" : "s" }}
        exclusively available. Login or create an account to gain early access
        and much more.
      </p>
      <auth-form />
    </div>
    <h3 v-else-if="startTime" class="h4 mb-8">
      New artworks are coming {{ formatDate(startTime) }}.
    </h3>
    <div
      v-for="({ artist, artworks }, idx) in data"
      :key="idx"
      class="w-full"
      :id="artist.slug"
    >
      <!-- artist info start -->
      <div
        v-if="artist"
        :key="idx"
        class="
          p-4
          sm:p-8
          xl:px-16
          bg-gray-lightest
          -mx-4
          sm:-mx-8
          xl:-mx-16
          text-gray-darkest
        "
      >
        <section-heading
          v-bind="{
            intro: 'Get to know',
            muted: 'featured artist',
            main: artist.title,
            href: artist.url,
            cta: 'Artist Profile',
          }"
        />
        <artist-details class="mt-8" :artist="artist"></artist-details>
        <roa-link-button
          secondary
          :href="artist.url"
          class="w-full sm:hidden mt-8"
        >
          Artist Profile
        </roa-link-button>
      </div>
      <!-- artist info end -->
      <div v-if="$auth.loggedIn && !startTime" class="my-16">
        <ul class="masonry -mx-4" v-if="artworks && artworks.length">
          <artwork-masonry-list-item
            v-for="artwork in artworks"
            :key="artwork.id"
            :artwork="artwork"
          />
        </ul>
      </div>
    </div>
  </section>
</template>
<script>
import ArtistDetails from "../components/ArtistDetails";
import AuthForm from "../components/AuthForm";
import SectionHeading from "../components/SectionHeading";
import Vue from "vue";
import axios from "axios";
import { formatRelative, parseISO } from "date-fns";
import { mapGetters } from "vuex";
export default {
  components: { AuthForm, ArtistDetails, SectionHeading },
  props: {
    data: { type: Array },
    startTime: { type: String },
  },
  data() {
    return {
      email: "",
      form: null,
      errors: [],
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["currentCurrency"]),
    artworksCount() {
      return this.data.map((artist) => artist.artworks).flat().length;
    },
  },
  methods: {
    formatDate(date) {
      return formatRelative(parseISO(date), new Date());
    },
    async onSubmit() {
      this.loading = true;
      const formData = new FormData(this.$refs.form);
      formData.delete("_token");
      try {
        const response = await axios.post(this.$refs.form.action, formData);
        Vue.roast.success("Thank you for signing up.");
        this.hasAccess = true;
        localStorage.setItem("hasPrivateViewAccess", true);
      } catch (e) {
        this.errors = e.response.data.errors;
      }
      this.loading = false;
    },
  },
};
</script>