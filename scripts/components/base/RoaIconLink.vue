<template>
  <a
    v-bind="{ ...$attrs, href }"
    class="focus:outline-none rounded-full transition-colors duration-300"
    :class="{
      'focus:outline-black p-1': small,
      'p-3': !small && !round,
      'text-gray focus:text-gray-darkest hover:text-gray-darkest': muted,
      'focus:text-white hover:text-white focus:bg-gray-darkest hover:bg-gray-darkest':
        !muted,
      'focus:bg-gray-light hover:bg-gray-light': round,
      'bg-gray-lightest border-none focus:bg-gray-light hover:bg-gray-light p-4':
        solid,
    }"
  >
    <roa-icon
      :name="icon"
      :bordered="round"
      :class="{ 'text-2xl': !round && !small && !solid, 'text-base': small }"
      class="overflow-visible"
    />
    <span class="sr-only">
      <slot />
    </span>
  </a>
</template>

<script>
export default {
  props: {
    href: { type: String, required: true },
    solid: { type: Boolean, default: false },
    round: { type: Boolean, default: false },
    small: { type: Boolean, default: false },
    muted: { type: Boolean, default: false },
    icon: { type: String, required: true },
  },
};
</script>