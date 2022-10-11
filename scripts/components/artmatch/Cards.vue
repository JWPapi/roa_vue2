<template>
  <div class="mt-4 sm:mt-6 mb-8">
    <h2 class="h2 mb-6 hidden sm:block text-center">
      <span class="handwritten">Art match</span>
    </h2>
    <div>
      <vue-swing
        ref="vueswing"
        :config="swingConfig"
        class="h-96 mx-4 relative z-10"
        style="max-height: 24rem"
        @throwout="onThrowout"
        @dragmove="handleDragMove"
        @dragend="handleDragEnd"
      >
        <card
          v-for="(artwork, idx) in artworks"
          :artwork="artwork"
          :key="artwork.id"
          :drag-confidence="idx === artworks.length - 1 ? dragConfidence : 0"
          :likes="likes"
        />
      </vue-swing>
      <div class="text-center mt-4 sm:mt-8 px-4 mx-auto max-w-2xl">
        <p class="h4-uppercase text-gray-darkest">
          {{ currentArtwork.artist.title || currentArtwork.artist }}
        </p>
        <p class="paragraph text-gray-solid">
          {{ currentArtwork.title
          }}<span v-if="currentArtwork.year">, {{ currentArtwork.year }}</span>
        </p>
      </div>
      <controls
        :cards-length="artworks.length + ratings.length"
        :cards-left="ratings.length"
        @like="likeBtnClick"
        @pass="dislikeBtnClick"
      />
    </div>
  </div>
</template>

<script>
import VueSwing from "vue-swing";
import Controls from "./Controls";
import Card from "./Card";

export default {
  props: {
    artworks: { type: Array, required: true },
  },
  components: {
    VueSwing,
    Controls,
    Card,
  },
  data() {
    return {
      swingConfig: {
        allowedDirections: [VueSwing.Direction.LEFT, VueSwing.Direction.RIGHT],
        minThrowOutDistance: 800,
        maxThrowOutDistance: 800,
        isThrowOut: function (xOffset, yOffset, element, throwOutConfidence) {
          return throwOutConfidence >= 0.5;
        },
      },
      ratings: [],
      prevCard: {},
      prevArtwork: {},
      dragConfidence: 0,
      likes: true,
    };
  },
  computed: {
    currentArtwork() {
      return this.artworks[this.artworks.length - 1] || {};
    },
  },
  mounted() {
    this.updateHeight();
    window.addEventListener("resize", this.updateHeight);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateHeight);
  },
  methods: {
    updateHeight() {
      if (!!this.$refs.vueswing?.$el?.firstElementChild)
        this.$refs.vueswing.$el.style.height = `${
          this.$refs.vueswing.$el.firstElementChild.offsetHeight || 384
        }px`;
    },
    likeBtnClick() {
      let cards = this.$refs.vueswing.cards;
      let num = 2;
      if (!this.introCompleted) {
        num = 1;
      }
      cards[cards.length - num].throwOut(400, 100);
    },
    dislikeBtnClick() {
      let cards = this.$refs.vueswing.cards;
      let num = 2;
      if (!this.introCompleted) {
        num = 1;
      }
      cards[cards.length - num].throwOut(-400, 100);
    },
    createRating(artwork_id, like) {
      this.prevArtwork = this.artworks.pop();
      this.ratings.push({
        artwork_id: artwork_id,
        like: like,
        ts: "",
      });
    },
    // Swing Events START
    onThrowout(e) {
      let artworkId = e.target.getAttribute("data-artwork");

      this.prevCard =
        this.$refs.vueswing.cards[this.$refs.vueswing.cards.length - 2];

      if (e.throwDirection.toString() === Symbol("RIGHT").toString()) {
        setTimeout(() => {
          this.createRating(artworkId, true);
          e.target.setAttribute("data-proceed", "true");
        }, 100);
      } else {
        setTimeout(() => {
          this.createRating(artworkId, false);
          e.target.setAttribute("data-proceed", "true");
        }, 100);
      }
    },
    handleDragMove(e) {
      this.dragConfidence = e.throwOutConfidence;
      this.likes = e.throwDirection.toString() === Symbol("RIGHT").toString();
    },
    handleDragEnd(e) {
      this.dragConfidence = 0;
      this.likes = true;
    },
  },
  watch: {
    artworks(value) {
      if (value.length === 0) {
        this.$emit("finish", this.ratings);
      }
    },
  },
};
</script>