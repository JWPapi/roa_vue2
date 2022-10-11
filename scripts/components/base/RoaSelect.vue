<template>
  <div class="relative" :class="open ? 'z-30' : 'z-20'">
    <div
      v-if="open"
      class="fixed inset-0 h-full w-full"
      @click="open = false"
    ></div>
    <label
      class="bg-gray-lightest rounded relative z-20 paragraph w-full flex"
      :class="{
        'outline-red': !novalidate && (error || nativeErrorMessage),
        'outline-black':
          open || (focused && ((!error && !nativeErrorMessage) || novalidate)),
        'text-gray-light': disabled,
      }"
    >
      <span class="flex-1">
        <span
          :class="{
            'uppercase transform -translate-y-3 small-caps':
              focused || value !== null,
            'text-gray-darkest': (focused || value === null) && !disabled,
            'text-gray': !focused && !disabled,
          }"
          class="
            absolute
            inset-0
            px-4
            pt-4
            transition-transform
            duration-200
            pointer-events-none
          "
        >
          {{ label }}
          <span v-if="!required && !novalidate" class="opacity-50"
            >(optional)</span
          >
        </span>
        <select
          class="
            bg-transparent
            pt-6
            pb-2
            pl-4
            pr-6
            focus:outline-none
            w-full
            appearance-none
          "
          :class="focused ? 'opacity-100' : 'opacity-0'"
          ref="select"
          v-bind="{
            value,
            placeholder,
            required,
            name,
            disabled,
            autocomplete,
          }"
          @input="$emit('input', $event.target.value)"
          @focus="focused = true"
          @blur="handleBlur"
        >
          <option value="" v-if="!required"></option>
          <slot></slot>
        </select>
        <button
          type="button"
          aria-hidden="true"
          v-if="!focused"
          class="
            selectOpenButton
            truncate
            absolute
            text-left
            inset-0
            pt-6
            pb-2
            pl-4
            pr-6
            focus:outline-none
            w-full
            appearance-none
          "
          @click="open = !open"
        >
          {{ selectedOption ? selectedOption.text : "" }}
        </button>
      </span>
      <roa-icon
        name="chevron"
        class="
          text-xl text-gray
          pointer-events-none
          -ml-10
          my-4
          mr-4
          transition-transform
          duration-150
        "
        :style="{ transform: open ? 'scaleY(-1)' : 'scaleY(1)' }"
      />
    </label>
    <ul
      v-if="open"
      aria-hidden="true"
      class="
        absolute
        z-10
        top-auto
        -mt-2
        pt-4
        pb-2
        w-full
        bg-gray-lightest
        rounded-b
        shadow
        max-h-72
        overflow-y-auto
      "
    >
      <li v-if="!required" class="px-2">
        <button
          type="button"
          class="
            w-full
            paragraph
            p-2
            rounded
            text-left text-gray-solid
            hover:bg-white
            focus:outline-none focus:bg-white
          "
          @click="selectOption({})"
        >
          No selection
        </button>
      </li>
      <li v-for="(option, idx) in options" :key="option.value" class="px-2">
        <button
          type="button"
          class="
            w-full
            flex
            items-center
            paragraph
            p-2
            rounded
            text-left
            hover:bg-white
            focus:outline-none focus:bg-white
          "
          :class="{
            'rounded-b': idx === options.length - 1,
          }"
          @click="selectOption(option)"
        >
          <roa-icon
            class="flex-shrink-0 mr-2"
            name="checkmark"
            v-if="option === selectedOption"
          />
          {{ option.text }}
        </button>
      </li>
    </ul>
    <p
      v-if="!novalidate && (error || nativeErrorMessage)"
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
    autocomplete: { type: String },
    error: { type: String },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    novalidate: { type: Boolean, default: false },
    placeholder: { type: String },
    value: { type: String | null, required: true },
  },
  data() {
    return {
      focused: false,
      nativeErrorMessage: "",
      mounted: false,
      open: false,
    };
  },
  mounted() {
    this.mounted = true;
  },
  computed: {
    options() {
      if (!this.mounted) return [];
      const options = [...this.$refs.select.options]
        .filter((option) => option && option.value !== null)
        .map((option) => {
          return {
            text: option.label,
            value: option.value,
          };
        });
      return options;
    },
    selectedOption() {
      if (!this.mounted) return {};
      if (this.value === null) return {};
      const selectedOption = this.options.find(
        (option) => option.value === this.value
      );
      if (!selectedOption) this.$emit("input", null);
      return selectedOption;
    },
  },
  methods: {
    handleBlur(event) {
      this.focused = false;
      this.nativeErrorMessage = event.target.validationMessage;
    },
    selectOption(option) {
      this.$emit("input", option.value || "");
      this.open = false;
    },
  },
};
</script>

<style scoped lang="scss">
.selectOpenButton {
  display: none;
}

@media (hover: none) {
  select {
    opacity: 1;
  }
}

@media (hover: hover) {
  .selectOpenButton {
    display: block;
  }
}
</style>