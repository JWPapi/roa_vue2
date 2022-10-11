<template>
  <div class="flex">
    <p class="flex-shrink-0">{{ label }}</p>
    <div class="flex-1 relative w-24 mx-3">
      <div
        class="h-0 absolute inset-0 border border-gray-light my-3"
        ref="track"
      ></div>
      <div
        class="
          h-0
          absolute
          inset-0
          border border-gray-darkest
          transform
          origin-left
          my-3
        "
        :style="{
          '--transform-scale-x': `${highPercentage - lowPercentage}`,
          '--transform-translate-x': `${lowPercentage * 100}%`,
        }"
      ></div>
      <div
        class="
          w-6
          h-6
          p-1
          cursor-pointer
          rounded-full
          hover:bg-gray-dark
          focus:bg-gray-dark
          hover:bg-opacity-25
          focus:bg-opacity-25
          absolute
          inset-y-0
        "
        :style="{ left: `calc(${lowPercentage * 100}% - .75rem)` }"
        @mousedown="handleClick('min', $event)"
        @touchstart="handleClick('min', $event)"
        ref="minHandle"
      >
        <div class="w-0 mx-auto h-full border border-gray-darkest"></div>
        <label
          class="
            tiny
            bg-white
            rounded-sm
            absolute
            mt-1
            inset-x-0
            left-0
            transform
            -translate-x-1/2
            top-auto
            flex
            items-center
            ml-3
            py-px
            px-1
          "
          :class="{ 'z-10': latestHandle === 'min' }"
          :style="{
            width: `${`${innerValue.min}`.length + symbol.length * 2}ch`,
          }"
        >
          <span class="sr-only">Minimum</span>
          <input
            class="bg-transparent focus:outline-none text-right"
            type="number"
            :value="(innerValue.min * displayFactor) << 0"
            @change="updateValue('min', $event)"
            v-bind="{ step, min, max }"
            :style="{
              width: `${`${innerValue.min}`.length}ch`,
            }"
          />
          {{ symbol }}
        </label>
      </div>
      <div
        class="
          w-6
          h-6
          p-1
          cursor-pointer
          rounded-full
          hover:bg-gray-dark
          focus:bg-gray-dark
          hover:bg-opacity-25
          focus:bg-opacity-25
          absolute
          inset-y-0
        "
        :style="{ left: `calc(${highPercentage * 100}% - .75rem)` }"
        @mousedown="handleClick('max', $event)"
        @touchstart="handleClick('max', $event)"
        ref="maxHandle"
      >
        <div class="w-0 mx-auto h-full border border-gray-darkest"></div>
        <label
          class="
            tiny
            bg-white
            rounded-sm
            absolute
            mt-1
            inset-x-0
            left-0
            transform
            -translate-x-1/2
            top-auto
            flex
            items-center
            ml-3
            py-px
            px-1
          "
          :class="{ 'z-10': latestHandle === 'max' }"
          :style="{
            width: `${`${innerValue.max}`.length + symbol.length * 2}ch`,
          }"
        >
          <span class="sr-only">Maximum</span>
          <input
            class="bg-transparent focus:outline-none text-right"
            type="number"
            :value="((innerValue.max * displayFactor) << 0) + 5"
            @change="updateValue('max', $event)"
            v-bind="{ step, min, max }"
            :style="{ width: `${`${innerValue.max}`.length}ch` }"
          />
          {{ symbol }}
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    value: { type: Object, required: true },
    step: { type: Number, default: 1 },
    symbol: { type: String, default: "" },
    displayFactor: { type: Number, default: 1 },
  },
  data() {
    return {
      startPosition: null,
      currentHandle: null,
      latestHandle: null,
      deltaX: 0,
    };
  },
  created() {
    this.cleanupData();
  },
  computed: {
    lowPercentage() {
      return (this.innerValue.min - this.min) / (this.max - this.min);
    },
    highPercentage() {
      return (this.innerValue.max - this.min) / (this.max - this.min);
    },
    innerValue() {
      if (this.currentHandle === this.$refs.minHandle)
        return {
          min: Math.min(
            this.value.max - this.step,
            Math.max(this.min, this.value.min + this.deltaX)
          ),
          max: this.value.max,
        };
      else if (this.currentHandle === this.$refs.maxHandle)
        return {
          min: this.value.min,
          max: Math.max(
            this.value.min + this.step,
            Math.min(this.max, this.value.max + this.deltaX)
          ),
        };
      else return this.value;
    },
  },
  methods: {
    cleanupData() {
      const value = { ...this.value };
      let changed = false;
      if (value.min < this.min) {
        changed = true;
        value.min = this.min;
      }
      if (value.max > this.max) {
        changed = true;
        value.max = this.max;
      }
      if (value.min > value.max) {
        changed = true;
        const { min, max } = value;
        value.min = max;
        value.max = min;
      }
      if (changed) this.$emit("input", value);
    },
    handleClick(handle, e) {
      const event = e.touches ? e.touches[0] : e;
      this.currentHandle =
        handle === "min" ? this.$refs.minHandle : this.$refs.maxHandle;
      this.latestHandle = handle;
      this.startPosition = event.pageX;
      document.addEventListener("mousemove", this.handleMove);
      document.addEventListener("touchmove", this.handleMove);
      document.addEventListener("mouseup", this.handleEnd);
      document.addEventListener("touchend", this.handleEnd);
    },
    handleEnd() {
      document.removeEventListener("mousemove", this.handleMove);
      document.removeEventListener("touchmove", this.handleMove);
      document.removeEventListener("mouseup", this.handleEnd);
      document.removeEventListener("touchend", this.handleEnd);
      this.$emit("input", this.innerValue);
      this.startPosition = null;
      this.currentHandle = null;
      this.deltaX = 0;
    },
    handleMove(e) {
      const event = e.touches ? e.touches[0] : e;
      const deltaX = event.pageX - this.startPosition;
      const trackWidth = this.$refs.track.offsetWidth;
      const deltaVal = (deltaX / trackWidth) * (this.max - this.min);
      this.deltaX = Math.round(deltaVal / this.step) * this.step;
    },
    updateValue(handle, e) {
      const newValue = this.innerValue;
      const value = e.target.value / this.displayFactor;
      if (handle === "min")
        newValue.min = Math.max(
          this.min,
          Math.min(value, this.innerValue.max - this.step)
        );
      else
        newValue.max = Math.min(
          this.max,
          Math.max(value, this.innerValue.min + this.step)
        );
      this.$emit("input", newValue);
    },
  },
};
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input:invalid {
  box-shadow: none;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>