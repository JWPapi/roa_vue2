<template>
  <li class="m-4">
    <a
      :href="artwork.url"
      :style="imageLoaded || { minHeight: `${imageHeight}px` }"
      class="block bg-gray-lightest"
    >
      <roa-image
        :w="800"
        :h="null"
        class="w-full"
        :class="{ 'drop-shadow-sm': artwork.shadow }"
        img-class="w-full"
        sizes="(max-width: 1000px) 50vw, (max-width: 1600px) 33vw, 25vw"
        :src="artwork.image"
      />
    </a>
    <div ref="details">
      <p class="h4-uppercase mt-4">
        <a v-if="artwork.artist" :href="artwork.artist.url">
          {{ artwork.artist.title }}
        </a>
      </p>
      <p class="paragraph text-gray-solid mt-1">
        <a :href="artwork.url">
          {{ artwork.title
          }}<span v-if="artwork.year">, {{ artwork.year }}</span>
        </a>
      </p>
      <p class="paragraph text-gray-solid mt-1" v-if="artwork.edition">
        Edition of {{ artwork.edition }}
      </p>
      <p
        class="paragraph text-gray-solid mt-1"
        v-if="artwork.price && artwork.available"
      >
        {{ artwork.price | money(currentCurrency) }}
      </p>
      <p v-if="artwork.available === false" class="mt-2 pill-sold">Sold</p>
    </div>
  </li>
</template>

<script>
import { mapGetters } from "vuex";
import Vue from "vue";
import debounce from "lodash/debounce";
export default {
  props: {
    artwork: { type: Object, required: true },
  },
  data() {
    return {
      rowGap: 0,
      rowHeight: 0,
      imageHeight: 0,
      detailsHeight: 0,
      imageLoaded: false,
      imageElement: null,
    };
  },
  computed: {
    ...mapGetters(["currentCurrency"]),
  },
  mounted() {
    this.imageElement = this.$el.querySelector("img");
    if (this.imageElement) {
      if (this.imageElement.complete) this.imageLoaded = true;
      else
        this.imageElement.addEventListener("load", () => {
          this.imageLoaded = true;
          this.resizeSelf();
        });
    }
    const parent = this.$el.parentElement;
    this.rowGap =
      parseInt(
        window.getComputedStyle(parent).getPropertyValue("grid-row-gap")
      ) || 0;
    this.rowHeight =
      parseInt(
        window.getComputedStyle(parent).getPropertyValue("grid-auto-rows")
      ) || 0;
    this.resizeSelf();
    window.addEventListener(
      "resize",
      debounce(() => this.resizeSelf(), 500)
    );
  },
  methods: {
    resizeSelf() {
      this.detailsHeight = this.$refs.details?.offsetHeight || 94;
      if (this.imageLoaded) {
        this.imageHeight = this.imageElement.getBoundingClientRect().height;
      } else {
        const aspectRatio = this.artwork.shadow
          ? this.artwork.height / this.artwork.width
          : 1;
        this.imageHeight = this.$el.getBoundingClientRect().width * aspectRatio;
      }
      const contentHeight = this.detailsHeight + this.imageHeight;
      const rowSpan = Math.ceil(
        (contentHeight + this.rowGap) / (this.rowHeight + this.rowGap)
      );
      this.$el.style.gridRowEnd = "span " + rowSpan;
      this.$el.style.height = rowSpan * 10 + "px";
    },
  },
};
</script>