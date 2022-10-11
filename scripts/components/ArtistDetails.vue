<template>
  <div class="md:flex items-start">
    <roa-image
      v-if="artist.photo"
      :w="700"
      :h="null"
      sizes="(max-width: 829px) 100vw, 33vw"
      fit="max"
      class="
        w-full
        sm:w-auto
        md:w-1/3
        lg:w-auto lg:max-w-1/3
        max-h-96 max-w-2xl
        lg:h-96
        mb-8
        md:pr-8 md:mb-0
        object-contain
        sm:object-left-top
      "
      :src="artist.photo"
    />
    <div class="lg:flex flex-1 overflow-hidden">
      <div
        v-if="artist.description"
        class="text-gray-darkest flex-1 md:mr-8 mt-8 md:mt-0"
      >
        <h3 class="h3 mb-8">Bio</h3>
        <div
          class="prose-sm-weak max-w-2xl"
          :class="showFullBio || 'max-h-56 sm:max-h-full overflow-hidden'"
          v-html="artist.description"
        />
        <button
          aria-hidden
          class="
            sm:hidden
            paragraph-sm
            underline
            text-gray-solid
            focus:text-gray-darkest
            hover:text-gray-darkest
            focus:outline-none
          "
          @click="showFullBio = !showFullBio"
        >
          Read {{ showFullBio ? "less" : "more" }}
        </button>
        <a
          v-if="artist.artist_spotlight"
          class="flex items-center mt-4 group"
          :href="artist.artist_spotlight"
        >
          <roa-icon
            class="
              inline-block
              transition-colors
              duration-300
              group-hover:text-white group-hover:bg-gray-darkest
              group-focus:text-white group-focus:bg-gray-darkest
              mr-4
              flex-shrink-0
            "
            bordered
            name="arrow-right"
          ></roa-icon>
          <span
            class="
              group-hover:border-current
              transition-colors
              duration-300
              group-focus:border-current
              border-b border-transparent
            "
            >Read the interview</span
          >
        </a>
      </div>
      <div
        v-if="artist.price_increases && artist.price_increases.length"
        class="mt-8 text-gray-darkest lg:mt-0 flex-1 overflow-hidden"
      >
        <h3 class="paragraph">
          Artwork value evolution since joining Return on Art
          <roa-icon-button
            icon="info"
            small
            @click="showChartInfo = true"
            v-cloak
          >
            Show how this is calculated
          </roa-icon-button>
        </h3>
        <artist-appreciation-chart
          class="mt-4 h-64 md:h-96"
          :data="artist.price_increases"
        />
        <roa-modal v-if="showChartInfo" @close="showChartInfo = false" v-cloak>
          <h4 class="h4-uppercase text-gray-darkest mb-8 mr-12">
            Artwork value evolution
          </h4>
          <p class="paragraph text-gray-darkest mb-4">
            This feature aims to provide more insight into artwork pricing. It
            is our vision to create a transparent art market and showing how
            artwork prices have evolved over time is essential.
          </p>
          <p class="paragraph text-gray-darkest mb-4">
            The graph displays the relative change in the artwork value since
            joining Return on Art. This function is only available for artists
            that have seen a change in price. The data points are solely based
            on historic sales on Return on Art and are not gathered by outside
            parties. The shown prices are calculated using a weighted average
            function and hence only represent an estimate of the current price.
          </p>
          <p class="paragraph text-gray-darkest mb-4">
            As such, this feature is not intended to provide investment guidance
            for the artwork being viewed but rather provide insight into how an
            artist has developed so far.
          </p>
          <p class="paragraph text-gray-darkest mb-4">
            If you have feedback or questions
            <a href="mailto:hello@returnonart.com" class="text-gray-dark">
              let us know </a
            >.
          </p>
          <roa-button class="w-full" @click="showChartInfo = false">
            Got it
          </roa-button>
        </roa-modal>
      </div>
    </div>
  </div>
</template>
<script>
import ArtistAppreciationChart from "./ArtistAppreciationChart";
export default {
  components: { ArtistAppreciationChart },
  props: {
    artist: { type: Object, required: true },
  },
  data() {
    return {
      showFullBio: false,
      showChartInfo: false,
    };
  },
};
</script>