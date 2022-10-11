<template>
  <roa-label-wrapper
    v-if="mode === 'dropdown'"
    @click.native.prevent="focusMultiselect($event)"
    v-bind="{
      disabled,
      focus,
      required,
      label,
      isEmpty: !(mode === 'dropdown' && value && value.length),
      icon: 'chevron',
      flipIcon: focus,
      largeIcon: true,
    }"
  >
    <multiselect
      @input="$emit('input', $event)"
      ref="multiselect"
      @open="focus = true"
      @close="handleClose()"
      :class="{ 'opacity-0 h-4 overflow-hidden': !focus }"
      v-bind="{
        value,
        required,
        options,
        showLabels,
        placeholder,
        multiple,
        tabindex: 0,
        disabled,
        closeOnSelect: false,
        label: labelValue,
        trackBy,
        ...$attrs,
      }"
    >
      <template #option="props">
        <slot name="option" v-bind="props"></slot>
      </template>
    </multiselect>
    <p
      class="absolute truncate inset-0 pt-6 pb-2 pl-4 pr-8 w-full h-full"
      v-if="!focus"
    >
      {{ value.join(", ") }}
    </p>
  </roa-label-wrapper>
  <div
    v-else
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
    :class="error && 'outline-red'"
  >
    <span
      :class="{
        'transform -translate-y-3 small-caps': !open && value.length,
        'text-gray-darkest': !disabled,
        'text-gray-light': disabled,
        'uppercase transform -translate-y-3 pointer-events-none small-caps':
          searchable && open,
      }"
      class="
        absolute
        truncate
        inset-x-0
        top-0
        px-4
        pt-4
        transition-transform
        duration-200
        focus:outline-none focus:underline
      "
    >
      {{ label }}
      <span v-if="!required" class="opacity-50">(optional)</span>
    </span>
    <button
      class="
        absolute
        inset-0
        rounded
        focus:outline-none focus:outline-black
        w-full
        h-full
        z-10
      "
      :aria-pressed="open"
      @click="open = !open"
    >
      <span class="sr-only">{{ open ? "close" : "open" }}</span>
    </button>
    <div
      v-if="open"
      class="flex-1 overflow-y-auto max-h-96 -m-1 p-1 -mr-6 relative z-20"
      :class="searchable ? 'mt-1' : 'mt-5'"
    >
      <input
        v-if="searchable"
        class="bg-transparent block w-full paragraph focus:outline-none mb-2"
        autofocus
        type="text"
        :placeholder="placeholder"
        v-model="search"
      />
      <span v-if="mode === 'pills' && open" class="-ml-1 block">
        <button
          class="
            p-2
            rounded
            focus:outline-black focus:outline-none
            m-1
            shadow-md
          "
          :class="
            value.includes(option)
              ? 'bg-gray-darkest text-white hover:bg-gray-dark focus:bg-gray-dark'
              : 'bg-white text-gray-darkest hover:bg-gray-lightest focus:bg-gray-lightest'
          "
          v-for="(option, idx) in filteredOptions"
          :key="idx"
          :aria-pressed="value.includes(option)"
          @click="toggleOption(option)"
        >
          {{ labelValue ? option[labelValue] : option }}
        </button>
      </span>
      <span v-else-if="mode === 'buttons' && open" class="block">
        <button
          class="
            text-left
            w-full
            py-2
            px-4
            flex
            items-center
            rounded
            focus:outline-black focus:outline-none
            mb-2
            last:mb-0
            shadow-md
            transition-colors
            duration-100
          "
          :class="
            isTicked(option)
              ? 'bg-gray-darkest text-white hover:bg-gray-dark focus:bg-gray-dark'
              : 'bg-white text-gray-darkest hover:bg-gray-lightest focus:bg-gray-lightest'
          "
          v-for="(option, idx) in filteredOptions"
          :key="idx"
          :aria-pressed="isTicked(option)"
          @click="toggleOption(option)"
        >
          <roa-icon
            v-if="isTicked(option)"
            name="checkmark"
            class="text-lg mr-4"
          />
          <div class="leading-none">
            {{ labelValue ? option[labelValue] : option }}
            <span class="small-caps" v-if="option.subtitle">
              <br />{{ option.subtitle }}
            </span>
          </div>
        </button>
      </span>
    </div>
    <span v-else class="paragraph flex-1 text-gray-darkest">
      {{ value.map((val) => convertOptionToString(val, true)).join(", ") }}
    </span>
    <roa-icon
      name="chevron"
      class="transform -translate-y-2 text-gray text-xl flex-shrink-0"
      :class="{ '-scale-100': open }"
    />
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import RoaIconButton from "./RoaIconButton.vue";
import RoaLabelWrapper from "./RoaLabelWrapper.vue";

export default {
  components: { Multiselect, RoaLabelWrapper, RoaIconButton },
  props: {
    options: { type: Array, required: true },
    value: { type: Array | String, required: true },
    label: { type: String, required: true },
    trackBy: { type: String },
    labelValue: { type: String },
    disabled: { type: Boolean, default: false },
    showLabels: { type: Boolean, default: true },
    multiple: { type: Boolean, default: true },
    required: { type: Boolean, default: false },
    searchable: { type: Boolean, default: false },
    placeholder: { type: String, default: "Search options" },
    mode: { type: String, default: "dropdown" },
    error: { type: String },
  },
  data() {
    return {
      focus: false,
      open: false,
      search: "",
    };
  },
  computed: {
    filteredOptions() {
      if (!this.searchable || this.search.length === 0) return this.options;
      return this.options.filter((option) => {
        const stringOption = this.convertOptionToString(option);
        return stringOption.toLowerCase().includes(this.search.toLowerCase());
      });
    },
  },
  methods: {
    focusMultiselect(e) {
      if (this.$refs.multiselect && !this.justClosed) {
        this.$refs.multiselect?.activate();
      }
      this.justClosed = false;
    },
    handleClose() {
      this.focus = false;
      this.justClosed = true;
      setTimeout(() => {
        this.justClosed = false;
      }, 500);
    },
    convertOptionToString(option, humanReadable = false) {
      let labelKey = this.trackBy || this.labelValue;
      if (!labelKey || humanReadable) labelKey = this.labelValue;
      return labelKey ? option[labelKey] : option;
    },
    isTicked(option) {
      return !!this.value.find((opt) => this.areEqual(opt, option));
    },
    areEqual(a, b) {
      return this.convertOptionToString(a) === this.convertOptionToString(b);
    },
    toggleOption(option) {
      if (this.isTicked(option)) {
        this.$emit(
          "input",
          this.value.filter((opt) => !this.areEqual(opt, option))
        );
      } else this.$emit("input", [...this.value, option]);
    },
  },
};
</script>


<style scoped lang="scss">
::v-deep {
  fieldset[disabled] .multiselect {
    pointer-events: none;
  }

  .multiselect__spinner {
    position: absolute;
    right: 1px;
    top: 1px;
    width: 48px;
    height: 35px;
    background: #fff;
    display: block;
  }

  .multiselect__spinner::before,
  .multiselect__spinner::after {
    position: absolute;
    content: "";
    top: 50%;
    left: 50%;
    margin: -8px 0 0 -8px;
    width: 16px;
    height: 16px;
    border-radius: 100%;
    border-color: #41b883 transparent transparent;
    border-style: solid;
    border-width: 2px;
    box-shadow: 0 0 0 1px transparent;
  }

  .multiselect__spinner::before {
    animation: spinning 2.4s cubic-bezier(0.41, 0.26, 0.2, 0.62);
    animation-iteration-count: infinite;
  }

  .multiselect__spinner::after {
    animation: spinning 2.4s cubic-bezier(0.51, 0.09, 0.21, 0.8);
    animation-iteration-count: infinite;
  }

  .multiselect__loading-enter-active,
  .multiselect__loading-leave-active {
    transition: opacity 0.4s ease-in-out;
    opacity: 1;
  }

  .multiselect__loading-enter,
  .multiselect__loading-leave-active {
    opacity: 0;
  }

  .multiselect,
  .multiselect__input,
  .multiselect__single {
    background: none;
    font-family: inherit;
    font-size: inherit;
    touch-action: manipulation;
  }

  .multiselect {
    box-sizing: content-box;
    display: block;
    position: relative;
    width: 100%;
    text-align: left;
    color: inherit;
    margin-bottom: -0.25rem;
  }

  .multiselect * {
    box-sizing: border-box;
  }

  .multiselect:focus {
    outline: none;
  }

  .multiselect--disabled {
    pointer-events: none;
  }

  .multiselect--active {
    z-index: 50;
  }

  .multiselect--active:not(.multiselect--above) .multiselect__current,
  .multiselect--active:not(.multiselect--above) .multiselect__input,
  .multiselect--active:not(.multiselect--above) .multiselect__tags {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .multiselect--active .multiselect__select {
    transform: rotateZ(180deg);
  }

  .multiselect--above.multiselect--active .multiselect__current,
  .multiselect--above.multiselect--active .multiselect__input,
  .multiselect--above.multiselect--active .multiselect__tags {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .multiselect__input,
  .multiselect__single {
    position: relative;
    display: inline-block;
    min-height: 20px;
    line-height: 20px;
    border: none;
    width: calc(100%);
    transition: border 0.1s ease;
    box-sizing: border-box;
    vertical-align: top;
  }

  .multiselect__input::placeholder {
    font-size: inherit;
    @apply text-gray;
  }

  .multiselect__tag ~ .multiselect__input,
  .multiselect__tag ~ .multiselect__single {
    width: auto;
  }

  .multiselect__input:hover,
  .multiselect__single:hover {
    @apply border-gray;
  }

  .multiselect__input:focus,
  .multiselect__single:focus {
    @apply border-gray outline-none;
  }

  .multiselect__single {
    // Selected Option when multiple is false
  }

  .multiselect__tags-wrap {
    display: inline;
  }

  .multiselect__tags {
    display: block;
    font-size: inherit;
  }

  .multiselect__tag {
    @apply inline-block relative rounded bg-gray-darkest p-2 text-white shadow-md pr-8 mt-1 mr-2 truncate;
  }

  .multiselect__tag-icon {
    @apply text-xl ml-2 absolute not-italic cursor-pointer inset-y-0 flex items-center justify-center right-0 w-6 transition duration-200;
  }

  .multiselect__tag-icon::after {
    content: "×";
    color: inherit;
  }

  .multiselect__tag-icon:focus,
  .multiselect__tag-icon:hover {
    @apply bg-gray-dark outline-none;
  }

  // .multiselect__tag-icon:focus::after,
  // .multiselect__tag-icon:hover::after {
  //   color: white;
  // }

  .multiselect__current {
    line-height: 16px;
    min-height: 40px;
    box-sizing: border-box;
    display: block;
    overflow: hidden;
    padding: 8px 12px 0;
    padding-right: 30px;
    white-space: nowrap;
    margin: 0;
    text-decoration: none;
    border-radius: 5px;
    border: 1px solid #e8e8e8;
    cursor: pointer;
  }

  .multiselect__select {
    box-sizing: border-box;
    text-decoration: none;
    @apply transition-transform right-0 cursor-pointer text-center absolute block;
  }

  .multiselect__placeholder {
    @apply text-gray;

    display: inline-block;
  }

  .multiselect--active .multiselect__placeholder {
    display: none;
  }

  .multiselect__content-wrapper {
    position: absolute;
    display: block;
    background: theme("colors.gray.lightest");
    width: calc(100% + 1rem + 2.25rem);
    margin-left: -1rem;
    max-height: 240px;
    overflow: auto;
    z-index: 50;
    -webkit-overflow-scrolling: touch;

    @apply shadow;
    @apply rounded-b;
  }

  .multiselect__content {
    list-style: none;
    display: inline-block;
    padding: 0;
    margin: 0;
    min-width: 100%;
    vertical-align: top;
  }

  .multiselect--above .multiselect__content-wrapper {
    bottom: 100%;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom: none;
  }

  .multiselect__element {
    display: block;
  }

  .multiselect__option {
    text-decoration: none;
    text-transform: none;
    white-space: nowrap;

    @apply block relative cursor-pointer p-2 rounded m-2 text-gray-darkest;
  }

  .multiselect__option--highlight {
    @apply bg-white outline-none;
  }

  .multiselect__option--highlight::after {
    content: attr(data-select);
    background: none;
    opacity: 0.5;
    @apply text-current text-right right-0 absolute mr-2;
  }

  .multiselect__option--selected {
  }

  .multiselect__option--selected::before {
    content: "";
    width: 1.5em;
    height: 1em;
    background-image: url("data:image/svg+xml, %3Csvg width='18' height='18' viewBox='0 -2.5 18 18' fill='none' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath d='M1 6.5L6.5 12L17 1' stroke='currentColor' stroke-width='1.5' /%3E%3C/svg%3E");
    background-size: contain;
    background-position: center left;
    background-repeat: no-repeat;
    display: inline-block;
  }

  .multiselect__option--selected::after {
    content: attr(data-selected);
    background: none;
    opacity: 0.5;
    @apply right-0 absolute mr-2;
  }

  .multiselect__option--selected.multiselect__option--highlight {
  }

  .multiselect__option--selected.multiselect__option--highlight::after {
    content: attr(data-deselect);
    background: none;
    opacity: 0.5;
    @apply text-right right-0 absolute mr-2;
  }

  .multiselect--disabled .multiselect__current,
  .multiselect--disabled .multiselect__select {
    @apply bg-gray text-white;
  }

  .multiselect__option--disabled {
    background: #ededed !important;
    color: #a6a6a6 !important;
    cursor: text;
    pointer-events: none;
  }

  .multiselect__option--group {
    background: #ededed;
    color: #35495e;
  }

  .multiselect__option--group.multiselect__option--highlight {
    background: #35495e;
    color: #fff;
  }

  .multiselect__option--group.multiselect__option--highlight::after {
    background: #35495e;
  }

  .multiselect__option--disabled.multiselect__option--highlight {
    background: #dedede;
  }

  .multiselect__option--group-selected.multiselect__option--highlight {
    background: #ff6a6a;
    color: #fff;
  }

  .multiselect__option--group-selected.multiselect__option--highlight::after {
    background: #ff6a6a;
    content: attr(data-deselect);
    background: none;
    color: #fff;
  }

  .multiselect-enter-active,
  .multiselect-leave-active {
    transition: opacity 200ms ease;
  }

  .multiselect-enter,
  .multiselect-leave-active {
    opacity: 0;
  }

  .multiselect__strong {
    margin-bottom: 8px;
    line-height: 20px;
    display: inline-block;
    vertical-align: top;
  }

  @keyframes spinning {
    from {
      transform: rotate(0);
    }

    to {
      transform: rotate(2turn);
    }
  }
}
</style>