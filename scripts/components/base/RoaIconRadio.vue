<template>
  <div class="flex">
    <label
      v-for="option in options"
      :key="option.value"
      :class="
        option.value === value
          ? 'cursor-default text-gray-darkest'
          : 'cursor-pointer text-gray hover:text-gray-darkest transition-colors duration-300'
      "
    >
      <input
        type="radio"
        @change="$emit('input', option.value)"
        :value="option.value"
        :name="name"
        class="sr-only"
      />
      <roa-icon
        :name="option.icon"
        class="text-2xl m-3 flex-shrink-0"
      ></roa-icon>
    </label>
  </div>
</template>

<script>
import RoaIcon from "./RoaIcon";
export default {
  components: { RoaIcon },
  props: {
    options: { type: Array, required: true },
    name: { type: String, required: true },
    value: { type: String, required: true },
  },
};
</script>