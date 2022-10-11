<template>
  <label
    class="
      bg-gray-lightest
      cursor-pointer
      rounded
      relative
      paragraph
      pt-6
      pb-2
      px-4
      w-auto
      flex
      justify-between
    "
    :class="{
      'outline-red': error,
      'outline-black': reallyFocused && !error,
    }"
    @focusin="focused = true"
    @focusout="focused = false"
  >
    <span
      :class="{
        'uppercase transform -translate-y-3 pointer-events-none small-caps':
          reallyFocused || !isEmpty,
        'text-gray-darkest': (reallyFocused || isEmpty) && !disabled,
        'text-gray': !reallyFocused && !disabled,
        'text-gray-light': disabled,
      }"
      class="
        absolute
        truncate
        inset-0
        px-4
        pt-4
        transition-transform
        duration-200
      "
    >
      {{ label }}
      <span v-if="!required" class="opacity-50">(optional)</span>
    </span>
    <slot
      v-bind="{ focused: reallyFocused, disabled, required, isEmpty }"
    ></slot>
    <roa-icon
      :name="icon"
      v-if="icon"
      class="transform -translate-y-2 text-gray"
      :class="{ 'text-xl': largeIcon, '-scale-100': flipIcon }"
    />
  </label>
</template>

<script>
export default {
  props: {
    disabled: { type: Boolean, default: false },
    label: { type: String, required: true },
    icon: { type: String },
    error: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    largeIcon: { type: Boolean, default: false },
    focus: { type: Boolean },
    isEmpty: { type: Boolean, required: true },
    flipIcon: { type: Boolean, default: false },
  },
  data() {
    return {
      focused: false,
    };
  },
  computed: {
    reallyFocused() {
      return this.focused || this.focus;
    },
  },
};
</script>