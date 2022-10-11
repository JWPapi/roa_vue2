<template>
  <section class="text-sm mb-16">
    <!-- MOBILE HEADER START -->
    <div class="md:hidden mt-8 flex items-start justify-between">
      <slot name="breadcrumbs" />
      <div class="flex-shrink-0">
        <roa-popup label="Share artist" class="inline-block">
          <template #activator="{ toggle }">
            <roa-icon-button icon="share" round @click="toggle">
              Share
            </roa-icon-button>
          </template>
          <social-media-links :artwork="artwork" />
        </roa-popup>
        <roa-icon-button
          :icon="userLikesArtwork ? 'heart-solid' : 'heart'"
          @click="toggleArtworkLike()"
          class="mr-2"
          :class="userLikesArtwork && 'text-red'"
          round
          :disabled="likeLoading || $auth.loading"
        >
          {{
            userLikesArtwork ? "Add to favourites" : "Remove from favourites"
          }}
        </roa-icon-button>
      </div>
    </div>
    <!-- MOBILE HEADER END -->

    <!-- ARTWORK DETAILS START -->
    <div class="md:flex items-start md:mt-8 mb-16 flex-wrap">
      <!-- MOBILE ARTWORK TITLE START -->
      <div
        class="
          md:hidden
          text-gray-darkest
          flex-grow
          pb-4
          mb-4
          border-b-sm border-gray-darkest
        "
      >
        <h3 class="h4-uppercase">
          <a :href="artwork.artist.url">{{ artwork.artist.title }}</a>
        </h3>
        <h2 class="paragraph">
          {{ artwork.title
          }}<span v-if="artwork.year">, {{ artwork.year }}</span>
        </h2>
      </div>
      <!-- MOBILE ARTWORK TITLE END -->

      <!-- ARTWORK IMAGES START -->
      <div class="w-full md:w-1/2 max-w-2xl mb-8">
        <photoswipe>
          <slider-wrapper
            v-if="artwork.gallery && artwork.gallery.length"
            :options="{ perView: 1, type: 'carousel' }"
            class="w-full"
            v-cloak
          >
            <li
              v-for="(galleryImage, idx) in [artwork.image, ...artwork.gallery]"
              :key="idx"
              class="bg-gray-lightest w-full"
            >
              <roa-image
                sizes="(max-width: 640px) 100vw, 896px"
                :w="1000"
                :h="1000"
                :spotlight="idx === 0 && !!artwork.shadow"
                :src="galleryImage"
                lightbox
              ></roa-image>
            </li>
          </slider-wrapper>
          <roa-image
            v-else
            lightbox
            :spotlight="artwork.shadow"
            :src="artwork.image"
          ></roa-image>
          <p class="small-caps text-center text-gray-darkest mt-1">
            Click image to expand
          </p>
        </photoswipe>
      </div>
      <!-- ARTWORK IMAGES END -->
      <!-- ARTWORK INFORMATION START -->
      <div class="w-full md:w-1/2 max-w-2xl md:pl-8 flex-grow">
        <div
          class="
            hidden
            md:flex
            items-start
            pb-4
            mb-4
            border-b-sm border-gray-darkest
          "
          v-cloak
        >
          <div class="text-gray-darkest flex-grow">
            <h3 class="h4-uppercase">
              <a :href="artwork.artist.url">{{ artwork.artist.title }}</a>
            </h3>
            <h2 class="paragraph">
              {{ artwork.title
              }}<span v-if="artwork.year">, {{ artwork.year }}</span>
            </h2>
          </div>
          <a style='cursor:pointer' class="p-2" v-if="artwork.special_coupon" @click="showSpecialCoupon = true">
            <img id='EasterEggImg' width="20"
              height="20"
              :src="artwork.easter_img">
          </a>
          <roa-modal
            v-if="showSpecialCoupon"
            @close="showSpecialCoupon = false"
            v-cloak>
            <span class="handwritten text-gray-darkest mb-8 md:block">
              Congratulations
            </span>
              You have found an Easter egg! This one contains a coupon code for 
              15% off your purchase. But act fast, before someone else finds it! Just use:
              {{ artwork.special_coupon}} at check out and celebrate Easter with some fresh art.
              <br>
          </roa-modal>
          <roa-popup label="Share artist" class="hidden md:block">
            <template #activator="{ toggle }">
              <roa-icon-button icon="share" round @click="toggle">
                Share
              </roa-icon-button>
            </template>
            <social-media-links :artwork="artwork" />
          </roa-popup>
          <roa-icon-button
            :icon="userLikesArtwork ? 'heart-solid' : 'heart'"
            @click="toggleArtworkLike()"
            class="ml-2"
            :class="userLikesArtwork && 'text-red'"
            round
            :disabled="likeLoading || $auth.loading"
          >
            {{
              userLikesArtwork ? "Add to favourites" : "Remove from favourites"
            }}
          </roa-icon-button>
        </div>
        <div
          v-if="artwork.description"
          v-html="artwork.description"
          class="prose-sm mb-6"
        ></div>
        <div>
          <p class="paragraph-sm text-gray-darkest">
            {{ artwork.medium }}
          </p>
          <p class="paragraph-sm text-gray-darkest">
            {{ artwork.width }} &times; {{ artwork.height }}
            <span v-if="artwork.depth">&times; {{ artwork.depth }}</span>
            cm
          </p>
          <p class="paragraph-sm text-gray-darkest">
            {{ artwork.width | cm2inch }} &times;
            {{ artwork.height | cm2inch }}
            <span v-if="artwork.depth"
              >&times; {{ artwork.depth | cm2inch }}</span
            >
            in
          </p>
          <p
            v-if="artwork.edition_count"
            class="paragraph-sm text-gray-darkest"
          >
            Edition of {{ artwork.edition_count }}
          </p>
        </div>
        <div v-if="artwork.inventory">
          <div class="flex items-center mt-6">
            <div class="flex-1">
              <p class="paragraph">
                {{ artwork.price | money(currentCurrency) }}
              </p>
              <p v-if="artwork.shipping_country" class="small-caps">
                Shipping from {{ artwork.shipping_country }} included
              </p>
              <p v-else class="small-caps">Shipping included</p>
            </div>
            <currency-switcher class="ml-6"></currency-switcher>
          </div>
          <div class="flex mt-6">
            <roa-link-button
              class="block w-full"
              :href="`${artwork.url}/buy`"
              icon="lightning"
              rel="nofollow"
            >
              Buy now
            </roa-link-button>
            <roa-button
              class="block w-full ml-6"
              secondary
              :loading="loading"
              :success="success"
              icon="bag"
              @reset="success = false"
              @click="addToCart(artwork)"
            >
              Add to Cart
            </roa-button>
          </div>
          <roa-button
            class="mt-6 w-full"
            secondary
            @click="showContactForm = true"
          >
            Request more Information
          </roa-button>
          <roa-modal
            v-if="showContactForm"
            @close="showContactForm = false"
            v-cloak
          >
            <slot name="contact-form"></slot>
          </roa-modal>
        </div>
        <p v-else class="pill-sold mt-6">Sold</p>
      </div>
      <!-- ARTWORK INFORMATION END -->

      <div class="flex items-center my-3 w-full">
        <roa-icon
          class="text-gray-light my-4 mr-4 h4 flex-shrink-0 hidden sm:block"
          name="info"
        />
        <div>
          <p v-if="artwork.exclude_returns" class="tiny text-gray-darkest">
            Limited Edition prints are excluded from our regular return policy.
            Each purchase of a printed artwork is final.
          </p>
          <p
            v-if="!artwork.artist.allow_coupon_codes"
            class="tiny text-gray-darkest"
          >
            This artist doesn't allow coupon codes on their artworks.
          </p>
          <p
            v-if="artwork.artist.shipping_notice"
            class="tiny text-gray-darkest"
          >
            {{ artwork.artist.shipping_notice }}
          </p>
          <p class="tiny text-gray-darkest">
            Note that artworks are shipped from the artist directly. Any
            international shipment may be liable to Customs and Excise Duty as
            well as Value Added Tax payments.
          </p>
        </div>
      </div>
    </div>
    <!-- ARTWORK DETAILS END -->

    <!-- ROOM VIEW START -->
    <div v-if="artwork.shadow" class="-mx-16 sm:-mx-8 xl:mx-16 xl:mb-32">
      <room-view :artwork="artwork" class="w-full"></room-view>
    </div>
    <!-- ROOM VIEW END -->

    <!-- ARTIST BIO START -->
    <div
      class="
        p-4
        sm:p-8
        pt-16
        xl:p-16
        bg-gray-lightest
        mb-16
        -mx-4
        sm:-mx-8
        xl:-mx-16
        text-gray-darkest
      "
    >
      <section-heading
        v-bind="{
          intro: 'Get to know',
          muted: artwork.artist.title.split(' ').slice(0, -1).join(' '),
          main: artwork.artist.title.split(' ').pop(),
          href: artwork.artist.url,
          cta: 'Artist Profile',
        }"
      />
      <artist-details class="mt-8" :artist="artwork.artist"></artist-details>
      <roa-link-button
        secondary
        :href="artwork.artist.url"
        class="w-full sm:hidden mt-8"
      >
        Artist Profile
      </roa-link-button>
    </div>
    <!-- ARTIST BIO END -->

    <media-gallery
      v-if="mediaGallery.length"
      :media="mediaGallery"
      :heading="{
        intro: 'take a look',
        muted: 'Into the',
        main: 'studio',
      }"
    />

    <!-- RECOMMENDATIONS START -->
    <recommendations
      class="my-8"
      :id="artwork.id"
      :artist="artwork.artist"
    ></recommendations>
    <!-- RECOMMENDATIONS END -->
  </section>
</template>
<script>
import "firebase/firestore";
import ArtistDetails from "../components/ArtistDetails";
import MediaGallery from "../components/MediaGallery";
import RoomView from "../components/RoomView";
import SectionHeading from "../components/SectionHeading.vue";
import SliderWrapper from "../components/SliderWrapper";
import firebase from "firebase/app";
import { db, PROFILES_REFERENCE } from "../db";
import { mapGetters } from "vuex";

export default {
  components: {
    ArtistDetails,
    MediaGallery,
    RoomView,
    SectionHeading,
    SliderWrapper,
  },
  props: {
    artwork: { type: Object },
  },
  data() {
    return {
      image: null,
      images: [],
      loading: false,
      success: false,
      showContactForm: false,
      showSpecialCoupon: false,
      likeLoading: false,
      showFullBio: false,
    };
  },
  computed: {
    ...mapGetters(["currentCurrency"]),
    userLikesArtwork() {
      if (!this.$auth.currentUser?.likedArtworks) return false;
      return !!this.$auth.currentUser.likedArtworks.find(
        (artwork) => artwork.id === this.artwork.id
      );
    },
    mediaGallery() {
      return [
        ...this.artwork.artist.videos.map((src) => ({ src, _video: true })),
        ...this.artwork.artist.images.map((src) => ({ src })),
      ];
    },
  },
  mounted() {
    this.$analytics.dispatchEcommerceEvent("view_item", this.artwork);
  },
  methods: {
    async toggleArtworkLike() {
      if (!this.$auth.loggedIn) {
        try {
          await this.$auth.showLogin();
        } catch (error) {
          console.error(error);
          return;
        }
      }
      this.likeLoading = true;
      try {
        const userReference = PROFILES_REFERENCE.doc(
          this.$auth.currentUser.uid
        );
        if (this.userLikesArtwork) {
          await userReference.update({
            likedArtworks: firebase.firestore.FieldValue.arrayRemove(
              db.collection("artworks").doc(this.artwork.id)
            ),
          });
        } else {
          await userReference.update({
            likedArtworks: firebase.firestore.FieldValue.arrayUnion(
              db.collection("artworks").doc(this.artwork.id)
            ),
          });
          this.$roast.success("Added to favorites on your profile page.");
        }
      } catch (error) {
        this.$roast.error(error.message);
      }
      this.likeLoading = false;
    },

    async addToCart(item) {
      this.loading = true;
      try {
        await this.$store.dispatch("addToCart", item);
        this.success = true;
        this.loading = false;
      } catch {
        this.loading = false;
      }
    },
  },
};
</script>
<style>
#EasterEggImg {
  /* Start the shake animation and make the animation last for 5 seconds */
  animation: shake 5s;

  /* When the animation is finished, start again */
  animation-iteration-count: infinite;
}
@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  2% { transform: translate(-1px, -2px) rotate(-1deg); }
  4% { transform: translate(-3px, 0px) rotate(1deg); }
  6% { transform: translate(3px, 2px) rotate(0deg); }
  8% { transform: translate(1px, -1px) rotate(1deg); }
  10% { transform: translate(-1px, 2px) rotate(-1deg); }
  12% { transform: translate(-3px, 1px) rotate(0deg); }
  14% { transform: translate(3px, 1px) rotate(-1deg); }
  16% { transform: translate(-1px, -1px) rotate(1deg); }
  18% { transform: translate(1px, 2px) rotate(0deg); }
  20% { transform: translate(1px, -2px) rotate(-1deg); }
}
</style>