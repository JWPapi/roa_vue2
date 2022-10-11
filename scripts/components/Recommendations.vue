<template>
  <div v-if="loaded">
    <transition
      appear
      name="fade"
      v-for="{ title, kind, url, verb } in kinds"
      :key="kind"
    >
      <section
        v-if="(recommendations[kind] || []).length > 0"
        class="mb-16 mt-8"
      >
        <section-heading
          class="mb-8"
          v-bind="{
            intro: verb,
            href: url,
            muted: title.split(' ').slice(0, -1).join(' '),
            main: title.split(' ').pop(),
            cta: 'Discover more',
          }"
        />
        <div
          v-if="recommendations[kind].length > 4"
          class="-mx-4 sm:-mx-8 xl:-mx-16"
        >
          <slider-wrapper preset="artworks" inset-buttons>
            <artwork-list-item
              v-for="(recommendation, idx) in recommendations[kind]"
              :key="recommendation.id + idx"
              :artwork="recommendation"
            ></artwork-list-item>
          </slider-wrapper>
        </div>
        <div v-else>
          <ul class="artworks-grid">
            <artwork-list-item
              v-for="(recommendation, idx) in recommendations[kind]"
              :key="recommendation.id + idx"
              class="artworks-grid-item"
              :artwork="recommendation"
            ></artwork-list-item>
          </ul>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import SliderWrapper from "./SliderWrapper.vue";
import { db } from "../db";
import SectionHeading from "./SectionHeading.vue";

export default {
  props: {
    id: { type: String, required: true },
    artist: { type: Object, default: undefined },
  },
  components: {
    SliderWrapper,
    SectionHeading,
  },
  data() {
    return {
      loaded: false,
      recommendations: {},
      kinds: [
        {
          kind: "artwork_ids",
          title: "Similar artworks",
          url: "/artworks",
          verb: "collect",
        },
      ],
    };
  },
  created() {
    if (this.artist) {
      this.kinds.unshift({
        kind: "same_artist_artwork_ids",
        title: `by ${this.artist.title}`,
        verb: "Other works",
        url: this.artist.url,
      });
    }
    this.$bind(
      "recommendations",
      db.collection("recommendations").doc(this.id)
    ).then((recommendations) => {
      this.loaded = !!recommendations;
      this.$unbind("recommendations", false);
    });
  },
};
</script>