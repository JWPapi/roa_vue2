<template>
  <div>
    <select
      :multiple="multiple"
      @value="value"
      @input="toggleOption($event.target.value)"
      class="sr-only"
    >
      <option
        :value="option"
        :key="typeof option === 'string' ? option : option.value"
        v-for="option in options"
      >
        {{ typeof option === "string" ? option : option.value }}
      </option>
    </select>
    <div class="flex-wrap -m-1 hidden md:flex">
      <button
        :key="typeof option === 'string' ? option : option.value"
        v-for="option in options"
        type="button"
        @click="
          toggleOption(typeof option === 'string' ? option : option.value)
        "
        class="m-1 focus:outline-none"
        :class="[
          isActive(typeof option === 'string' ? option : option.value)
            ? 'pill bg-gray-darkest text-white hover:outline-black focus:outline-black'
            : 'pill bg-gray-lightest hover:bg-gray-darkest hover:text-white focus:text-white focus:bg-gray-darkest',
        ]"
      >
        {{ typeof option === "string" ? option : option.title }}
      </button>
    </div>
    <div class="-mx-8" v-if="windowWidth < breakpoints.md">
      <slider-wrapper
        :controls="false"
        @init="glide = $event"
        :options="{
          perView: 4,
          peek: { before: 32, after: 64 },
          breakpoints: {
            620: { perView: 3 },
            500: { perView: 2 },
          },
          bound: true,
        }"
      >
        <li
          :key="typeof option === 'string' ? option : option.value"
          v-for="option in options"
        >
          <button
            type="button"
            @click="
              toggleOption(typeof option === 'string' ? option : option.value)
            "
            class="m-1 focus:outline-none w-full"
            :class="[
              isActive(typeof option === 'string' ? option : option.value)
                ? 'pill bg-gray-darkest text-white hover:outline-black focus:outline-black'
                : 'pill bg-gray-lightest hover:bg-gray-darkest hover:text-white focus:text-white focus:bg-gray-darkest',
            ]"
          >
            {{ typeof option === "string" ? option : option.title }}
          </button>
        </li>
      </slider-wrapper>
    </div>
  </div>
</template>

<script>
import WindowWidth from "../../mixins/WindowWidth";
import SliderWrapper from "../SliderWrapper.vue";
export default {
  mixins: [WindowWidth],
  components: { SliderWrapper },
  props: {
    disabled: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    value: { type: Array | String, required: true },
    options: { type: Array, required: true },
    error: { type: String },
  },
  methods: {
    toggleOption(option) {
      if (this.multiple) {
        let value = [...this.value];
        if (value.includes(option)) value = value.filter((el) => el !== option);
        else value.push(option);
        this.$emit("input", value);
      } else {
        this.$emit("input", option);
      }
    },
    isActive(option) {
      if (this.multiple) return this.value.includes(option);
      else return this.value === option;
    },
  },
};
</script>