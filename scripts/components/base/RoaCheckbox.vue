<template>
  <label class="flex items-start">
    <input
      type="checkbox"
      class="sr-only"
      v-bind="{ required, name: name || label, checked: value, disabled }"
      value="true"
      @change="$emit('input', $event.target.checked)"
      @focus="focused = true"
      @blur="focused = false"
    />
    <span
      class="
        w-4
        h-4
        flex-shrink-0
        border
        rounded-sm
        text-white text-sm
        inline-flex
        items-center
        justify-center
      "
      :class="{
        'bg-transparent border-gray-darkest': !value && !disabled,
        'bg-gray-darkest border-gray-darkest': value && !disabled && !focused,
        'border-gray-light text-gray bg-transparent': disabled,
        'bg-gray-darkest border-gray-darkest outline-black': focused,
      }"
    >
      <roa-icon name="checkmark" v-if="value" />
    </span>
    <span
      class="ml-4 -mt-1"
      :class="{
        'small-caps': small,
        paragraph: !small,
        'text-gray': disabled,
      }"
    >
      <slot>
        {{ label }}
      </slot>
    </span>
  </label>
</template>

<script>
export default {
  data() {
    return {
      focused: false,
    };
  },
  props: {
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    small: { type: Boolean, default: false },
    name: { type: String },
    label: { type: String },
    value: { type: Boolean | Array, required: true },
  },
};
</script>