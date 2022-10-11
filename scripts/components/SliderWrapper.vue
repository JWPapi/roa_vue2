<template>
  <div class="glide">
    <div class="glide__track mb-8 h-full" data-glide-el="track">
      <ul class="glide__slides h-full">
        <slot v-bind="{ sliderLength, glide }"></slot>
      </ul>
    </div>
    <div
      v-if="controls"
      class="flex justify-between items-center w-full mt-4"
      :class="{ 'px-4 sm:px-8 xl:px-16': insetButtons }"
    >
      <roa-icon-button
        :disabled="
          glide && glide.settings.type === 'slider' && glide.index === 0
        "
        @click="glide.go(`<`)"
        class="hidden sm:block"
        solid
        icon="arrow-left"
      >
        Previous
      </roa-icon-button>
      <div class="w-full max-w-sm flex mx-16 sm:mx-4">
        <button
          @click="glide.go(`=${item - 1}`)"
          v-for="item in sliderLength"
          :key="item"
          class="
            flex-1
            border-b border-gray-darkest
            bg-transparent
            h-1
            focus:outline-none
          "
          :class="{
            'bg-gray-darkest': isVisible(item - 1),
          }"
        >
          <span class="sr-only">Slide {{ item }}</span>
        </button>
      </div>
      <roa-icon-button
        :disabled="
          glide &&
          glide.settings.type === 'slider' &&
          glide.index === sliderLength - 1
        "
        @click="glide.go(`>`)"
        class="hidden sm:block"
        solid
        icon="arrow-right"
      >
        Next
      </roa-icon-button>
    </div>
  </div>
</template>

<script>
import Glide from "@glidejs/glide";
import debounce from "lodash.debounce";
import { siblings } from "@glidejs/glide/src/utils/dom";

function Length(Glide, Components, Events) {
  return {
    mount() {
      Events.emit("length.change", Components.Sizes.length);
    },
  };
}
function Autoheight(Glide, Components, Events) {
  const AUTOHEIGHT = {
    mount() {
      Components.Html.track.style.transition = "height 0.2s ease-in-out";
      AUTOHEIGHT.set();
    },

    set() {
      Components.Html.track.style.height = `${
        Components.Html.slides[Glide.index].children[0].offsetHeight
      }px`;
    },
  };

  Events.on(["run", "resize"], () => {
    AUTOHEIGHT.set();
  });

  return AUTOHEIGHT;
}
function CustomActiveClass(Glide, Components, Events) {
  var Component = {
    mount() {
      this.changeActiveSlide();
    },

    changeActiveSlide() {
      let slide = Components.Html.slides[Glide.index];

      if (slide) {
        slide.classList.remove("is-next", "is-prev");
        slide.classList.add("is-active");

        siblings(slide).forEach((sibling) => {
          sibling.classList.remove("is-active", "is-next", "is-prev");
        });

        if (slide.nextElementSibling) {
          slide.nextElementSibling.classList.add("is-next");
        }

        if (slide.previousElementSibling) {
          slide.previousElementSibling.classList.add("is-prev");
        }
      }
    },
  };

  Events.on("run", () => {
    Component.changeActiveSlide();
  });

  return Component;
}

const globalSettings = {
  touchRatio: 0.9,
  touchAngle: 65,
  animationDuration: 300,
  swipeThreshold: 50,
};

const presets = {
  feature: {
    type: "slider",
    startAt: 0,
    perView: 3,
    bound: true,
    gap: 27,
    rewind: false,
    peek: { before: 64, after: 200 },
    breakpoints: {
      1279: {
        perView: 2,
        peek: { before: 32, after: 200 },
      },
      770: {
        perView: 1,
        peek: { before: 32, after: 200 },
      },
      639: {
        perView: 1,
        peek: { before: 16, after: 64 },
      },
    },
  },
  artworks: {
    type: "carousel",
    startAt: 0,
    perView: 5,
    peek: { before: 64, after: 64 },
    breakpoints: {
      2000: {
        peek: { before: 64, after: 64 },
        perView: 4,
      },
      1279: {
        perView: 3,
        peek: { before: 32, after: 32 },
      },
      1000: {
        perView: 2,
        peek: { before: 32, after: 32 },
      },
      770: {
        perView: 2,
        peek: { before: 32, after: 32 },
      },
      639: {
        perView: 1,
        peek: { before: 16, after: 96 },
      },
    },
  },
  hero: {
    type: "carousel",
    autoplay: 5000,
    gap: 0,
    hoverpause: false,
  },
  collections: {
    type: "slider",
    bound: true,
    perView: 2,
    peek: { before: 32, after: 100 },
    breakpoints: {
      770: {
        perView: 1,
      },
      639: {
        perView: 1,
        peek: { before: 16, after: 64 },
      },
    },
  },
};

export default {
  props: {
    preset: { type: String },
    options: {
      type: Object,
    },
    controls: { type: Boolean, default: true },
    autoHeight: { type: Boolean, default: false },
    scrollControl: { type: Boolean, default: false },
    insetButtons: { type: Boolean, default: false },
  },
  data() {
    return { glide: null, sliderLength: 0, dataOptions: undefined };
  },
  created() {
    this.dataOptions = this.preset
      ? { ...globalSettings, ...presets[this.preset], ...this.options }
      : { ...globalSettings, ...this.options };

    if (this.scrollControl) {
      window.addEventListener(
        "wheel",
        debounce(this.onScroll, 100, { leading: true })
      );
    }
  },
  beforeDestroy() {
    window.removeEventListener(
      "wheel",
      debounce(this.onScroll, 100, { leading: true })
    );
  },
  mounted() {
    this.glide = new Glide(this.$el, this.dataOptions);
    this.glide.on("length.change", (value) => (this.sliderLength = value));
    if (this.autoHeight)
      this.glide.mount({ Autoheight, Length, CustomActiveClass });
    else this.glide.mount({ Length, CustomActiveClass });
    this.$emit("init", this.glide);
  },
  methods: {
    onScroll(e) {
      if (e.deltaY > 0) this.glide.go(">");
      else this.glide.go("<");
    },
    isVisible(index) {
      return (
        (index >= this.glide.index &&
          index < this.glide.index + this.glide.settings.perView) ||
        (this.glide.index + this.glide.settings.perView > this.sliderLength &&
          index <
            (this.glide.index + this.glide.settings.perView) %
              this.sliderLength &&
          this.glide.settings.type === "carousel")
      );
    },
  },
};
</script>

<style lang="scss">
@import "node_modules/@glidejs/glide/src/assets/sass/glide.core";
</style>