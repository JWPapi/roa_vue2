<template>
  <li
    class="w-full sm:flex my-2 py-2"
    :class="{ 'opacity-50': loading }"
    v-if="item.product"
  >
    <div class="flex justify-between items-start">
      <a :href="item.product.url">
        <roa-image
          :src="item.product.image"
          class="w-24 h-24 flex-shrink-0"
          sizes="96px"
          :w="96"
          :h="96"
          :padding="9"
          :spotlight="item.product.shadow"
        ></roa-image>
      </a>
      <roa-icon-button
        v-if="editable"
        small
        @click="removeFromCart"
        class="text-gray sm:hidden"
        icon="trash"
      >
        Remove from Cart
      </roa-icon-button>
    </div>
    <div class="flex-1 sm:ml-4 flex flex-col">
      <div class="flex-1 items-start flex justify-between py-1">
        <a :href="item.product.url" class="flex-1 paragraph-sm">
          <p class="uppercase">
            {{ artistName }}
          </p>
          <p class="text-gray">
            {{ item.product.title }}
          </p>
        </a>
        <roa-link-button
          v-if="item.certificate_url"
          :href="item.certificate_url"
          target="_blank"
          rel="noopener noreferrer"
          icon="badge"
          plain
          class="-mr-6 hidden sm:flex"
        >
          Certificate of authenticity
        </roa-link-button>
        <roa-icon-link
          v-if="item.certificate_url"
          :href="item.certificate_url"
          target="_blank"
          rel="noopener noreferrer"
          icon="badge"
          plain
          class="sm:hidden"
        >
          Certificate of authenticity
        </roa-icon-link>
        <roa-icon-button
          v-if="editable"
          small
          @click="removeFromCart"
          class="text-gray hidden sm:block"
          icon="trash"
        >
          Remove from Cart
        </roa-icon-button>
      </div>
      <p class="sm:text-right paragraph-sm sm:self-end">
        <span v-if="item.quantity > 1">{{ item.quantity }} &times;</span>
        {{ item.product.price | money(currentCurrency) }}
      </p>
    </div>
  </li>
</template>

<script>
import { mapGetters } from "vuex";
import RoaImage from "./base/RoaImage.vue";
export default {
  components: { RoaImage },
  props: {
    item: Object,
    editable: { type: Boolean, default: true },
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["currentCurrency"]),
    artistName() {
      return typeof this.item.product.artist === "string"
        ? this.item.product.artist
        : this.item.product.artist.title;
    },
  },
  methods: {
    async removeFromCart() {
      this.loading = true;
      await this.$store.dispatch("removeFromCart", this.item);
      this.loading = false;
    },
  },
};
</script>