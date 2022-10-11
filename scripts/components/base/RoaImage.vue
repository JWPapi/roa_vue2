<template>
  <div v-if="spotlight" class="h-0 pb-1/1 relative">
    <div
      class="
        absolute
        inset-0
        bg-gray-lightest
        transition-all
        duration-700
        ease-in-out-circ
        artwork-with-shadow-wrapper
        transform
      "
    ></div>
    <img
      v-pswp="
        lightbox === false
          ? false
          : { title: lightbox || '', msrc: url, src: zoomUrl }
      "
      v-bind="{
        src: url,
        srcset,
        sizes,
        class: [
          'absolute inset-0 flex items-stretch justify-center transition-transform duration-700 ease-out-exp artwork-with-shadow-image transform object-contain h-full w-full',
          ...imgClass,
        ],
        style: {
          padding: (windowWidth < breakpoints.sm ? 14 : padding) + 'px',
          filter:
            'drop-shadow(0 8px 7px rgb(0 0 0 / 25%)) drop-shadow(0 2px 1px rgb(0 0 0 / 10%))',
        },
        loading,
        ...$attrs,
      }"
    />
  </div>
  <img
    v-else
    v-bind="{
      src: url,
      srcset,
      sizes,
      style: imgStyle,
      loading,
      ...$attrs,
    }"
    :class="imgClass"
    v-pswp="
      lightbox === false
        ? false
        : { title: lightbox || '', msrc: url, src: zoomUrl }
    "
  />
</template>

<script>
import WindowWidth from "../../mixins/WindowWidth.vue";

export default {
  mixins: [WindowWidth],
  props: {
    src: { type: String, required: true },
    w: { type: Number, default: 500 },
    h: { type: Number, default: 500 },
    padding: { type: Number, default: 29 },
    spotlight: { type: Boolean, default: false },
    fit: { type: String, default: "crop" },
    imgClass: { type: String | Object, default: "" },
    imgStyle: { type: String | Object, default: "" },
    focalpoint: { type: String },
    loading: { type: String, default: "lazy" },
    darken: { type: Boolean, default: false },
    sizes: { type: String },
    responsive: { type: Boolean, default: true },
    quality: { type: Number, default: 50 },
    lightbox: { type: Boolean | String, default: false },
  },
  computed: {
    srcset() {
      if (!this.responsive) return;
      const aspectRatio = this.h ? this.h / this.w : 1;
      const widths = [375, 600, 786, 1080, 1600, 2400];
      return widths
        .map((width) => {
          const paramsClone = new URLSearchParams(this.parameters.toString());
          paramsClone.set("w", width);
          if (this.h) paramsClone.set("h", width * aspectRatio);
          return `${this.baseUrl + paramsClone} ${width}w`;
        })
        .join(", ");
    },
    zoomUrl() {
      const paramsClone = new URLSearchParams(this.parameters.toString());
      paramsClone.set("w", 2400);
      const aspectRatio = this.h ? this.h / this.w : 1;
      if (this.h) paramsClone.set("h", 2400 * aspectRatio);
      return this.baseUrl + paramsClone;
    },
    baseUrl() {
      return (this.src || "")
        .trim()
        .replace("assets.returnonart.com", "returnonart.imgix.net")
        .concat("?");
    },
    parameters() {
      let imgixParams = new URLSearchParams();

      imgixParams.set("auto", "format");
      imgixParams.set("q", this.quality);
      imgixParams.set("fit", this.fit);

      if (this.darken) {
        imgixParams.set("con", "10");
        imgixParams.set("exp", "-2");
      }

      if (this.spotlight) {
        imgixParams.set("fit", "fill");
      } else if (this.focalpoint && this.focalpoint !== "50-50") {
        const [focalX, focalY] = this.focalpoint
          .split("-")
          .map((val) => +val / 100);

        imgixParams.set("crop", "focalpoint");
        imgixParams.set("fp-x", focalX);
        imgixParams.set("fp-y", focalY);
      }
      return imgixParams;
    },
    url() {
      const paramsClone = new URLSearchParams(this.parameters.toString());
      paramsClone.set("w", this.w);
      paramsClone.set("h", this.h);
      return this.baseUrl.concat(paramsClone);
    },
  },
};
</script>
