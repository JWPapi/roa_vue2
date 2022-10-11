<template>
  <div class="my-8" v-if="user.id">
    <p class="parapraph text-gray-darkest">
      <span class="text-gray-solid">Favorites:</span>
      {{ artworks.length }} {{ artworks.length === 1 ? "artwork" : "artworks" }}
    </p>
    <ul class="masonry -mx-4 w-full" v-if="artworks.length">
      <transition name="fade" v-for="artwork in artworks" :key="artwork.id">
        <artwork-masonry-list-item :artwork="artwork" />
      </transition>
    </ul>
    <div v-else class="flex justify-center my-16">
      <roa-link-button secondary href="/artworks">
        Browse our artworks
      </roa-link-button>
    </div>
  </div>
  <roa-logo type="spinning" class="mx-auto my-16" v-else />
</template>

<script>
import { db, PROFILES_REFERENCE } from "../db";
import firebase from "firebase/app";
import "firebase/firestore";
import RoaLinkButton from "./base/RoaLinkButton.vue";
export default {
  components: { RoaLinkButton },
  data() {
    return {
      user: { likedArtworks: [] },
      removeLikeLoading: null,
    };
  },
  firestore() {
    return { user: PROFILES_REFERENCE.doc(this.$auth.currentUser.uid) };
  },
  computed: {
    artworks() {
      return this.user.likedArtworks
        ? this.user.likedArtworks
            .filter((artwork) => !!artwork && !!artwork.title)
            .reverse()
        : [];
    },
  },
  methods: {
    async removeLike({ id }) {
      this.removeLikeLoading = id;
      await PROFILES_REFERENCE.doc(this.$auth.currentUser.uid).update({
        likedArtworks: firebase.firestore.FieldValue.arrayRemove(
          db.collection("artworks").doc(id)
        ),
      });
      this.removeLikeLoading = null;
    },
  },
};
</script>