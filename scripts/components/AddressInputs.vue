<template>
  <div>
    <roa-input
      v-if="!addressOnly"
      label="First name"
      required
      type="text"
      :name="`${prefix}[first_name]`"
      autocomplete="given-name"
      v-model="value.firstName"
      class="w-full"
    ></roa-input>
    <roa-input
      v-if="!addressOnly"
      label="Last name"
      required
      type="text"
      :name="`${prefix}[last_name]`"
      autocomplete="family-name"
      v-model="value.lastName"
      class="w-full"
    ></roa-input>
    <roa-input
      v-if="!addressOnly"
      label="Phone"
      required
      :name="`${prefix}[phone]`"
      type="tel"
      autocomplete="tel"
      v-model="value.phone"
      class="w-full"
    ></roa-input>
    <div class="w-full relative z-30">
      <roa-input
        label="Address"
        required
        :name="`${prefix}[address]`"
        autocomplete="address-line1"
        type="text"
        v-model="value.addr1"
        class="w-full relative z-10"
        @input="fetchSuggestions()"
        @keydown.esc="suggestions = []"
        @keydown.down.prevent="selectSuggestionFromIndex(true)"
        @keydown.up.prevent="selectSuggestionFromIndex()"
        @keydown.enter.prevent="
          selectSuggestion(suggestions[suggestionIndex], true)
        "
      ></roa-input>
      <div
        v-if="suggestions.length"
        class="fixed inset-0 w-full h-full"
        @click="suggestions = []"
      ></div>
      <ul
        v-if="suggestions.length"
        class="
          absolute
          top-auto
          -mt-2
          pt-2
          w-full
          bg-gray-lightest
          rounded-b
          shadow
          max-h-72
          overflow-y-auto
        "
      >
        <li
          v-for="(suggestion, idx) in suggestions"
          :key="suggestion.id"
          class="block"
        >
          <button
            type="button"
            class="
              w-full
              paragraph
              px-4
              py-2
              text-left
              hover:bg-gray-light
              focus:outline-none
              focus:bg-gray-light
            "
            :class="{
              'rounded-b': idx === suggestions.length - 1,
              'bg-gray-light': idx === suggestionIndex,
            }"
            @click="selectSuggestion(suggestion, true)"
          >
            {{ suggestion.title }}
          </button>
        </li>
      </ul>
    </div>
    <roa-input
      label="Address line 2"
      autocomplete="address-line2"
      :name="`${prefix}[address_2]`"
      type="text"
      v-model="value.addr2"
      class="w-full"
      @focus.native="suggestions = []"
    ></roa-input>
    <roa-input
      label="Company"
      :name="`${prefix}[company]`"
      type="text"
      v-model="value.company"
      class="w-full"
    ></roa-input>
    <roa-input
      label="City"
      required
      autocomplete="address-level2"
      :name="`${prefix}[city]`"
      type="text"
      v-model="value.city"
      class="w-full"
    ></roa-input>
    <roa-input
      label="Postal code"
      required
      autocomplete="postal-code"
      type="text"
      :name="`${prefix}[postal]`"
      v-model="value.zip"
      class="w-full"
    ></roa-input>
    <roa-select
      label="Country"
      v-model="value.country"
      :name="`${prefix}[country]`"
      required
      autocomplete="country"
      class="w-full"
    >
      <option
        v-for="(details, code) in countries"
        :key="code"
        :value="details.code"
      >
        {{ details.name }}
      </option>
    </roa-select>
    <roa-input
      label="Region"
      :name="`${prefix}[region]`"
      autocomplete="address-level1"
      type="text"
      v-model="value.state"
      class="w-full"
    ></roa-input>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import debounce from "lodash.debounce";
import axios from "axios";
import countries from "../countries";
export default {
  props: {
    value: { type: Object, required: true },
    prefix: { type: String, required: true },
    addressOnly: { type: Boolean, default: false },
  },
  data() {
    return {
      suggestions: [],
      suggestionIndex: -1,
      countries,
    };
  },
  computed: {
    ...mapGetters(["regions"]),
  },
  methods: {
    fetchSuggestions: debounce(async function () {
      if (this.value.addr1.length < 2) return;

      const BASE_URL = "https://geocode.search.hereapi.com/v1/geocode";
      const API_KEY = "5GaQJ4pgR_BuzmjiYkO9WWzfuoNm1q-QbiG4UI1ZiXQ";
      try {
        const { data } = await axios.get(BASE_URL, {
          params: {
            qq: `street=${this.value.addr1}`,
            apiKey: API_KEY,
            limit: 5,
          },
          transformRequest: (data, headers) => {
            delete headers.common["X-Requested-With"];
          },
        });
        this.suggestions = data.items;
      } catch (error) {
        console.error(error);
      }
    }, 250),
    selectSuggestion({ address }, closeAfter) {
      this.$emit("input", {
        ...this.value,
        addr1: `${address.street} ${address.houseNumber || ""}`,
        city: address.city || "",
        country: countries[address.countryCode].code || "",
        zip: address.postalCode || "",
        state: address.stateCode || "",
      });
      if (closeAfter) this.suggestions = [];
    },
    selectSuggestionFromIndex(down) {
      if (
        !this.suggestions.length ||
        (this.suggestionIndex === 0 && !down) ||
        (this.suggestionIndex === this.suggestions.length - 1 && down)
      )
        return;
      this.suggestionIndex += down ? 1 : -1;
      this.selectSuggestion(this.suggestions[this.suggestionIndex]);
    },
  },
};
</script>