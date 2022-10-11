<template>
  <button
    v-bind="{ type, disabled, ...$attrs }"
    v-on="$listeners"
    class="
      focus:outline-none
      transition-all
      duration-300
      rounded-full
      overflow-visible
    "
    :class="{
      'p-1': small,
      'focus:text-white hover:text-white focus:bg-gray-darkest hover:bg-gray-darkest':
        !muted,
      'text-gray focus:text-gray-darkest hover:text-gray-darkest': muted,
      'p-3': !round && !small,
      'bg-gray-lightest text-gray-darkest border border-transparent':
        solid && !disabled,
      'p-4': solid,
      'bg-gray-lightest text-gray-light cursor-not-allowed border-none':
        disabled,
    }"
  >
    <roa-icon
      :name="icon"
      :class="{ 'text-2xl': !round && !small && !solid, 'text-base': small }"
      class="overflow-visible"
      :bordered="round"
    />
    <span class="sr-only">
      <slot />
    </span>
  </button>
</template>

<script>
export default {
  props: {
    type: { type: String, default: "button" },
    disabled: { type: Boolean, default: false },
    solid: { type: Boolean, default: false },
    round: { type: Boolean, default: false },
    small: { type: Boolean, default: false },
    icon: { type: String, required: true },
    muted: { type: Boolean, default: false },
  },
};
</script>