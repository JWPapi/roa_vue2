<template>
  <label
    class="flex items-center paragraph"
    :class="{
      'bg-white rounded-lg p-16 block shadow': large,
    }"
  >
    <input
      type="radio"
      v-bind="{ value, name, disabled }"
      :checked="modelValue === value"
      class="sr-only"
      @change="$emit('change', value)"
      @focus="focused = true"
      @blur="focused = false"
    />
    <span
      class="w-5 h-5 mr-2 flex-shrink-0 border rounded-full text-white text-sm inline-flex items-center justify-center"
      :class="{
        'bg-transparent border-gray-darkest':
          !(modelValue === value) && !disabled,
        'bg-gray-darkest border-gray-darkest':
          modelValue === value && !disabled && !focused,
        'border-gray-light bg-gray-light': disabled && modelValue === value,
        'border-gray-light bg-transparent': disabled && !(modelValue === value),
        'text-gray-darkest border-gray-darkest': focused,
        'mr-16': large,
      }"
    >
      <roa-icon name="checkmark" v-if="modelValue === value" />
    </span>
    <span class="flex-1" v-if="label">{{ label }}</span>
    <span
      class="flex-1"
      v-else-if="$slots.default"
      :class="{ 'text-gray': disabled }"
    >
      <slot></slot>
    </span>
  </label>
</template>

<script>
export default {
  props: {
    label: { type: String },
    value: { required: true },
    name: { type: String, required: true },
    disabled: { type: Boolean, default: false },
    modelValue: { required: true },
    large: { type: Boolean, default: false },
  },
  model: {
    prop: "modelValue",
    event: "change",
  },
  data() {
    return {
      focused: false,
    };
  },
};
</script>