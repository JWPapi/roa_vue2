<template>
  <div>
    <div class="my-8" v-if="!$auth.loading">
      <p class="parapraph text-gray-darkest mb-8">
        <span class="text-gray-solid">Collection:</span>
        {{ artworks.length }}
        {{ artworks.length === 1 ? "artwork" : "artworks" }}
      </p>

      <p v-if="total" class="h3 pb-4 border-b border-gray mb-4">
        {{ total | money(currentCurrency) }}
      </p>
      <ul class="masonry -mx-4 w-full" v-if="artworks.length">
        <transition name="fade" v-for="artwork in artworks" :key="artwork.id">
          <artwork-masonry-list-item
            :artwork="{ ...artwork, available: true }"
          />
        </transition>
      </ul>
      <div v-else class="flex justify-center my-16">
        <roa-link-button secondary href="/artworks">
          Browse our artworks
        </roa-link-button>
      </div>
    </div>
    <roa-logo type="spinning" class="mx-auto my-16" v-else />
  </div>
</template>

<script>
import { db } from "../db";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      orders: [],
    };
  },
  firestore() {
    return {
      orders: db
        .collection("orders")
        .where("user", "==", this.$auth.currentUser.uid),
    };
  },
  computed: {
    ...mapGetters(["currentCurrency"]),
    artworks() {
      return this.orders
        .filter((order) => order.status === "completed")
        .map((order) => order.items.map((item) => item.product))
        .flat()
        .filter((artwork) => artwork && typeof artwork === "object");
    },
    total() {
      return this.artworks.reduce((sum, artwork) => sum + artwork.price, 0);
    },
  },
};
</script>