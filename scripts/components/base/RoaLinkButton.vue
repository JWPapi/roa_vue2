<template>
  <a
    class="
      paragraph
      relative
      inline-flex
      px-6
      py-4
      transition-colors
      duration-300
      items-center
      justify-center
      focus:outline-none
    "
    v-bind="{ href, ...$attrs }"
    :class="{
      'cursor-not-allowed pointer-events-none': this.disabled,
      ...styles,
    }"
  >
    <roa-icon v-if="icon" :name="icon" class="mr-3" />
    <span
      class="
        mt-1
        group-hover:border-current
        border-b border-transparent
        whitespace-no-wrap
      "
    >
      <slot />
    </span>
  </a>
</template>

<script>
export default {
  props: {
    href: { type: String, required: true },
    disabled: { type: Boolean, default: false },
    secondary: { type: Boolean, default: false },
    icon: { type: String },
    white: { type: Boolean, default: false },
    plain: { type: Boolean, default: false },
  },
  computed: {
    styles() {
      if (this.plain) {
        if (this.white) {
          return {
            "text-white hover:bg-gray-dark focus:bg-gray-dark": !this.disabled,
            "text-gray-dark": this.disabled,
          };
        }
        return {
          "text-gray-darkest group": !this.disabled,
          "text-gray-light": this.disabled,
        };
      }
      if (this.secondary) {
        if (this.white)
          return {
            "border-gray-dark text-gray-dark border": this.disabled,
            "bg-transparent border-white text-white border border-transparent hover:bg-white hover:text-gray-darkest focus:border-gray focus:text-gray":
              !this.disabled,
          };
        return {
          "border-gray-light text-gray-light border": this.disabled,
          "bg-transparent border-gray-solid text-gray-darkest border hover:text-black hover:border-black focus:text-black focus:border-black":
            !this.disabled,
        };
      }
      if (this.white)
        return {
          "bg-gray-dark text-gray-darkest": this.disabled,
          "bg-white text-gray-darkest border border-transparent hover:bg-transparent hover:border-white hover:text-white focus:bg-gray":
            !this.disabled,
        };
      return {
        "bg-gray-lightest text-gray-light": this.disabled,
        "bg-gray-darkest text-white border border-transparent hover:bg-black hover:border-black focus:bg-black":
          !this.disabled,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
a:focus:hover {
  @apply text-white;
}
</style>