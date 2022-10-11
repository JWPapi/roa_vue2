<template>
  <ul>
    <li>
      <button
        @click="share('facebook')"
        class="
          border-b-sm border-gray-dark
          paragraph
          focus:outline-none
          focus:bg-gray-dark
          hover:bg-gray-dark
          p-4
          w-full
          text-left
        "
      >
        Facebook
      </button>
    </li>
    <li>
      <button
        @click="share('twitter')"
        class="
          border-b-sm border-gray-dark
          paragraph
          focus:outline-none
          focus:bg-gray-dark
          hover:bg-gray-dark
          p-4
          w-full
          text-left
        "
      >
        Twitter
      </button>
    </li>
    <li>
      <button
        @click="share('pinterest')"
        class="
          border-b-sm border-gray-dark
          paragraph
          focus:outline-none
          focus:bg-gray-dark
          hover:bg-gray-dark
          p-4
          w-full
          text-left
        "
      >
        Pinterest
      </button>
    </li>
    <li>
      <button
        @click="share('email')"
        class="
          paragraph
          focus:outline-none
          focus:bg-gray-dark
          hover:bg-gray-dark
          p-4
          w-full
          text-left
        "
      >
        Email
      </button>
    </li>
    <li v-if="shareAPISupported">
      <button
        @click="nativeShare"
        class="
          border-t-sm border-gray-dark
          paragraph
          focus:outline-none
          focus:bg-gray-dark
          hover:bg-gray-dark
          p-4
          w-full
          text-left
        "
      >
        Other
      </button>
    </li>
  </ul>
</template>

<script>
import RoaModal from "./base/RoaModal.vue";

const WIDTH = 626;
const HEIGHT = 436;

export default {
  components: { RoaModal },
  props: {
    artwork: { type: Object },
    artist: { type: Object },
  },
  data() {
    return {
      popupLeft: 0,
      popupTop: 0,
      openWindow: null,
      shareAPISupported: !!window.navigator.share,
    };
  },
  methods: {
    nativeShare() {
      if (this.artwork) {
        window.navigator.share({
          title: "Check out this artwork I discovered on Return on Art",
          text: `Check out this artwork I discovered on Return on Art. \n\n${this.artwork.title}, ${this.artwork.year}\n${this.artwork.artist.title}\n${this.artwork.medium}\n\n`,
          url: `https://returnonart.com${this.artwork.url}`,
        });
      } else if (this.artist) {
        window.navigator.share({
          title: "Check out this artist I discovered on Return on Art",
          text: `Check out this artist I discovered on Return on Art. \n\n${this.artist.title}\n${this.artist.nationality}, ${this.artist.birthYear}\n\nDiscover more original artworks by up-and-coming artists on returnonart.com.`,
          url: this.artist.url,
        });
      }
    },
    /**
     * Center the popup on multi-screens
     * http://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen/32261263
     */
    resizePopup() {
      const width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        window.screenX;
      const height =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        window.screenY;
      const systemZoom = width / window.screen.availWidth;

      this.popupLeft =
        (width - WIDTH) / 2 / systemZoom +
        (window.screenLeft !== undefined ? window.screenLeft : window.screenX);
      this.popupTop =
        (height - HEIGHT) / 2 / systemZoom +
        (window.screenTop !== undefined ? window.screenTop : window.screenY);
    },
    share(key) {
      this.resizePopup();
      if (this.openWindow && this.openWindow.close) this.openWindow.close();
      this.openWindow = window.open(
        this[key],
        `sharer-${key}`,
        `,height=${HEIGHT},width=${WIDTH},left=${this.popupLeft},top=${this.popupTop},screenX=${this.popupLeft},screenY=${this.popupTop}`
      );
      if (!this.openWindow) return;
      this.openWindow.focus();
    },
  },
  computed: {
    twitter() {
      if (this.artwork) {
        let body = `Check out this artwork I discovered on Return on Art. \n\n${this.artwork.title}, ${this.artwork.year}\n${this.artwork.artist.title}\n${this.artwork.medium}\n\n`;
        if (body.length <= 280 - 89 - 23 - 76)
          body +=
            "Explore their curated selection of original artworks and support up-and-coming artists.";
        let hashtags =
          "artmadeaccesible,artcurators,investinlivingartists,returnonart,artinspo";
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          body
        )}&url=${encodeURIComponent(
          `https://returnonart.com${this.artwork.url}`
        )}&hashtags=${hashtags}`;
      } else if (this.artist) {
        let body = `Check out this artist I discovered on Return on Art. \n\n${this.artist.title}\n${this.artist.nationality}, ${this.artist.birthYear}\n\n`;
        if (body.length <= 280 - 89 - 23 - 76)
          body +=
            "Explore their curated selection of original artworks and support up-and-coming artists.";
        let hashtags =
          "artmadeaccesible,artcurators,investinlivingartists,returnonart,artinspo";
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          body
        )}&url=${encodeURIComponent(this.artist.url)}&hashtags=${hashtags}`;
      }
      throw new Error("Either provide an artist or an artwork.");
    },
    facebook() {
      if (this.artwork)
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          `https://returnonart.com${this.artwork.url}`
        )}`;
      else if (this.artist)
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          this.artist.url
        )}`;

      throw new Error("Either provide an artist or an artwork.");
    },
    pinterest() {
      if (this.artwork)
        return `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
          `https://returnonart.com${this.artwork.url}`
        )}&media=${encodeURIComponent(
          this.artwork.image
        )}&description=${encodeURIComponent(
          `${this.artwork.title}, ${this.artwork.year}\n${this.artwork.artist.title}\n${this.artwork.medium}\nDiscover more original artworks by up-and-coming artists on returnonart.com.`
        )}`;
      else if (this.artist)
        return `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
          this.artist.url
        )}&media=${encodeURIComponent(
          this.artist.image
        )}&description=${encodeURIComponent(
          `${this.artist.title}\n${this.artist.nationality}, ${this.artist.birthYear}\nDiscover more original artworks by up-and-coming artists on returnonart.com.`
        )}`;
      throw new Error("Either provide an artist or an artwork.");
    },
    email() {
      if (this.artwork)
        return `mailto:?subject=${encodeURIComponent(
          "Check out this artwork I discovered on Return on Art"
        )}&body=${encodeURIComponent(
          `${this.artwork.title}, ${this.artwork.year}\n${
            this.artwork.artist.title
          }\n${
            this.artwork.medium
          }\n\n${`https://returnonart.com${this.artwork.url}`}\n\nDiscover more artworks by up-and-coming artists on returnonart.com.`
        )}`;
      else if (this.artist)
        return `mailto:?subject=${encodeURIComponent(
          "Check out this artist I discovered on Return on Art"
        )}&body=${encodeURIComponent(
          `${this.artist.title}\n${this.artist.nationality}, ${this.artist.birthYear}\n\nDiscover more original artworks by up-and-coming artists on returnonart.com.\n\n${this.artist.url}`
        )}`;
    },
  },
};
</script>