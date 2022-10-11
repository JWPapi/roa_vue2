<template>
  <label class="flex items-center paragraph">
    <input
      type="checkbox"
      class="sr-only"
      v-bind="{ name: name || label, checked: value, disabled, required }"
      @focus="focused = true"
      @blur="focused = false"
      @change="$emit('input', $event.target.checked)"
    />
    <span
      class="w-10 rounded-full inline-flex transition-colors duration-200"
      style="padding: 2px"
      :class="{
        'bg-gray cursor-pointer': !value && !disabled,
        'bg-gray-darkest cursor-pointer': value && !disabled,
        'justify-end': value,
        'justify-start': !value,
        'bg-gray-light': disabled,
        'outline-black': focused,
      }"
    >
      <span
        class="bg-white h-5 w-5 rounded-full inline-block"
        :class="{ 'bg-gray-lightest': disabled }"
      ></span>
    </span>
    <span v-if="label" :class="{ 'text-gray': disabled }" class="ml-2">
      {{ label }} <span v-if="!required" class="opacity-50">(optional)</span>
    </span>
  </label>
</template>

<script>
export default {
  props: {
    value: { type: Boolean, required: true },
    name: { type: String },
    label: { type: String },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
  },
  data() {
    return {
      focused: false,
    };
  },
};
</script>