<template>
  <div>
    <label
      class="
        bg-gray-lightest
        rounded
        relative
        paragraph
        pt-6
        pb-2
        px-4
        w-full
        flex
      "
      :class="{
        'outline-red': !novalidate && (error || nativeErrorMessage),
        'outline-black':
          focused && ((!error && !nativeErrorMessage) || novalidate),
      }"
    >
      <span
        :class="{
          'uppercase transform -translate-y-3 pointer-events-none small-caps':
            focused || value,
          'text-gray-darkest': (focused || !value) && !disabled,
          'text-gray': !focused && !disabled,
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
      <input
        :type="computedType"
        class="bg-transparent focus:outline-none w-auto flex-1"
        :class="{
          'opacity-100': value || focused,
          'opacity-0': !(value || focused),
          'text-gray': disabled,
          'text-gray-darkest': !disabled,
        }"
        v-bind="{
          value: postfix
            ? value.substring(0, value.length - postfix.length)
            : value,
          placeholder,
          required,
          name,
          disabled,
          autocomplete,
          ...$attrs,
        }"
        v-on="{
          ...$listeners,
          input(event) {
            $emit(
              'input',
              postfix ? event.target.value + postfix : event.target.value
            );
          },
          focus() {
            focused = true;
          },
          blur: handleBlur,
        }"
      />
      <span
        v-if="postfix && (value || focused)"
        class="text-gray-darkest paragraph"
      >
        {{ postfix }}
      </span>
      <button
        class="
          flex-shrink-0
          -ml-6
          px-1
          focus:outline-black
          text-gray
          rounded-full
          text-sm
          focus:outline-none
          transform
          -translate-y-2
        "
        :class="{
          'text-gray': !showPassword,
          'text-gray-darkest': showPassword,
        }"
        type="button"
        @click="showPassword = !showPassword"
        v-if="type === 'password' && !disabled"
      >
        <roa-icon name="eye" />
      </button>
      <button
        class="
          flex-shrink-0
          -ml-6
          px-1
          focus:outline-black
          rounded-full
          text-gray-dark text-sm
          focus:outline-none
          transform
          -translate-y-2
        "
        type="button"
        @click="$emit('input', '')"
        v-else-if="(type === 'search' || clearable) && value && !disabled"
      >
        <roa-icon name="cross" />
      </button>
    </label>
    <p
      v-if="!novalidate && (error || nativeErrorMessage)"
      class="text-red items-center mt-2 tiny flex"
      role="alert"
    >
      <roa-icon
        name="attention-outline"
        class="mx-2 text-base flex-shrink-0 -mt-1 inline-block"
      />
      <span class="flex-1" v-html="error || nativeErrorMessage"> </span>
    </p>
  </div>
</template>

<script>
import RoaIcon from "./RoaIcon.vue";
export default {
  components: { RoaIcon },
  inheritAttrs: false,
  props: {
    label: { type: String, required: true },
    type: { type: String, default: "text" },
    name: { type: String },
    autocomplete: { type: String },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    placeholder: { type: String },
    value: { type: String, required: true },
    error: { type: String },
    postfix: { type: String },
    novalidate: { type: Boolean, default: false },
  },
  data() {
    return {
      focused: false,
      showPassword: false,
      nativeErrorMessage: "",
    };
  },
  computed: {
    computedType() {
      if (this.type !== "password") return this.type;
      return this.showPassword ? "text" : "password";
    },
  },
  methods: {
    handleBlur(event) {
      this.focused = false;
      this.nativeErrorMessage = event.target.validationMessage;
    },
  },
};
</script>

<style scoped>
input::placeholder {
  @apply text-gray-light;
}

input:invalid {
  box-shadow: none;
}

input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  -webkit-appearance: none;
}
</style>