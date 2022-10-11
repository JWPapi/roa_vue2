<template>
  <div class="my-8" v-if="user.id">
    <p class="parapraph text-gray-darkest">
      <span class="text-gray-solid">Following:</span>
      {{ artists.length }} {{ artists.length === 1 ? "artist" : "artists" }}
    </p>
    <ul class="artworks-grid w-full" v-if="artists.length">
      <transition name="fade" v-for="artist in artists" :key="artist.id">
        <li
          class="
            relative
            artworks-grid-item
            group
            block
            transition-all
            duration-300
          "
          :class="
            artist.id === unfollowLoading && 'opacity-50  pointer-events-none'
          "
        >
          <a
            :href="artist.url"
            class="focus:outline-none block group max-w-full whitespace-normal"
          >
            <div class="overflow-hidden pb-ratio h-0 relative bg-gray-lightest">
              <roa-image
                :src="
                  (artist.featured_artwork && artist.featured_artwork.image) ||
                  artist.photo
                "
                sizes="(max-width: 640px) 50vw, (max-width: 820px) 33vw, 25vw"
                :w="500"
                :h="330"
                img-class="absolute inset-0 w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105 group-focus:scale-105"
              />
            </div>
            <h4 class="h4-uppercase mt-4">{{ artist.title }}</h4>
          </a>
          <roa-icon-button
            small
            icon="cross"
            class="
              absolute
              right-0
              top-0
              mt-6
              bg-red
              opacity-0
              group-hover:opacity-100
            "
            @click="unfollowArtist(artist)"
          >
            Unfollow artist
          </roa-icon-button>
        </li>
      </transition>
    </ul>
    <div v-else class="flex justify-center my-16">
      <roa-link-button secondary href="/artists">
        Get to know the artists
      </roa-link-button>
    </div>
  </div>
  <roa-logo type="spinning" class="mx-auto my-16" v-else />
</template>

<script>
import { db, PROFILES_REFERENCE } from "../db";
import firebase from "firebase/app";
import "firebase/firestore";
export default {
  data() {
    return {
      user: { followedArtists: [] },
      unfollowLoading: null,
    };
  },
  firestore() {
    return { user: PROFILES_REFERENCE.doc(this.$auth.currentUser.uid) };
  },
  computed: {
    artists() {
      return this.user.followedArtists
        ? this.user.followedArtists
            .filter((artist) => !!artist && !!artist.title)
            .reverse()
        : [];
    },
  },
  methods: {
    async unfollowArtist({ id, title }) {
      this.unfollowLoading = id;
      await PROFILES_REFERENCE.doc(this.$auth.currentUser.uid).update({
        followedArtists: firebase.firestore.FieldValue.arrayRemove(
          db.collection("artists").doc(id)
        ),
      });
      this.$roast.success(`You unfollowed ${title}`);
      this.unfollowLoading = null;
    },
  },
};
</script>