<template>
  <button
    class="paragraph relative inline-flex px-6 py-4 transition-colors duration-300 items-center justify-center focus:outline-none"
    v-bind="{ disabled: disabled || loading || success, type }"
    v-on="$listeners"
    :class="{
      'cursor-not-allowed': this.disabled || this.loading || this.success,
      ...styles,
    }"
  >
    <roa-icon
      v-if="icon"
      :class="{ invisible: loading || success }"
      :name="icon"
      class="mr-2"
    />
    <span
      :class="{ invisible: loading || success }"
      class="group-hover:border-current border-b border-transparent whitespace-no-wrap"
    >
      <slot />
    </span>
    <span
      v-if="loading || success"
      class="absolute inset-0 flex justify-center items-center"
    >
      <roa-icon :name="success ? 'checkmark-animated' : 'spinner'" />
    </span>
  </button>
</template>

<script>
export default {
  props: {
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    secondary: { type: Boolean, default: false },
    type: { type: String, default: "button" },
    icon: { type: String },
    white: { type: Boolean, default: false },
    plain: { type: Boolean, default: false },
    success: { type: Boolean, default: false },
  },
  watch: {
    success(value) {
      if (value) {
        setTimeout(() => {
          this.$emit("reset");
        }, 5000);
      }
    },
  },
  computed: {
    styles() {
      if (this.plain) {
        if (this.white) {
          return {
            "text-white": !this.disabled,
            "text-gray-dark": this.disabled,
            "hover:bg-gray-dark focus:bg-gray-dark":
              !this.disabled && !this.loading && !this.success,
          };
        }
        return {
          "text-gray-darkest": !this.disabled,
          "text-gray-light": this.disabled,
          group: !this.disabled && !this.loading && !this.success,
        };
      }
      if (this.secondary) {
        if (this.white)
          return {
            "border-gray-dark text-gray-dark border": this.disabled,
            "bg-transparent border-white text-white border border-transparent": !this
              .disabled,
            "hover:bg-white hover:text-gray-darkest focus:border-gray focus:text-gray":
              !this.disabled && !this.loading && !this.success,
          };
        return {
          "border-gray-light text-gray-light border": this.disabled,
          "bg-transparent border-gray-solid text-gray-darkest border": !this
            .disabled,
          "hover:text-black hover:border-black focus:text-black focus:border-black":
            !this.disabled && !this.loading && !this.success,
        };
      }
      if (this.white)
        return {
          "bg-gray-dark text-gray-darkest": this.disabled,
          "bg-white text-gray-darkest border border-transparent": !this
            .disabled,
          "hover:bg-transparent hover:border-white hover:text-white focus:bg-gray":
            !this.disabled && !this.loading && !this.success,
        };
      return {
        "bg-gray-lightest text-gray-light": this.disabled,
        "bg-gray-darkest text-white border border-transparent": !this.disabled,
        "hover:bg-black hover:border-black focus:bg-black":
          !this.disabled && !this.loading && !this.success,
      };
    },
  },
};
</script>