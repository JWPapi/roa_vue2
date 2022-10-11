<template>
  <div>
    <label
      class="bg-gray-lightest rounded relative paragraph pt-5 pb-1 px-4 w-auto flex"
      :class="{
        'outline-red': error || nativeErrorMessage,
        'outline-black': focused && !error && !nativeErrorMessage,
      }"
    >
      <span
        :class="{
          'uppercase transform -translate-y-2 pointer-events-none small-caps':
            focused || value,
          'text-gray-darkest': (focused || !value) && !disabled,
          'text-gray': !focused && !disabled,
          'text-gray-light': disabled,
        }"
        class="absolute truncate inset-0 px-4 pt-3 transition-transform duration-200"
      >
        {{ label }}
        <span v-if="!required" class="opacity-50">(optional)</span>
      </span>
      <textarea
        class="bg-transparent focus:outline-none w-auto flex-1"
        :class="{
          'opacity-100': value || focused,
          'opacity-0': !(value || focused),
          'text-gray': disabled,
        }"
        v-bind="{
          value,
          placeholder,
          required,
          name,
          disabled,
          ...$attrs,
        }"
        @input="$emit('input', $event.target.value)"
        @focus="focused = true"
        @blur="handleBlur"
      ></textarea>
    </label>
    <p
      v-if="error || nativeErrorMessage"
      class="text-red items-center mt-2 tiny flex"
      role="alert"
    >
      <roa-icon
        name="attention-outline"
        class="mx-2 text-base flex-shrink-0 -mt-1 inline-block"
      />
      <span class="flex-1">
        {{ error || nativeErrorMessage }}
      </span>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, required: true },
    name: { type: String },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String },
    value: { type: String, required: true },
    error: { type: String },
  },
  data() {
    return {
      focused: false,
      showPassword: false,
      nativeErrorMessage: "",
    };
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
</style>