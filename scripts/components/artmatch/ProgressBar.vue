<template>
  <div class="max-w-xl w-full">
    <div
      class="w-full border-b border-gray-solid text-left overflow-visible mb-2"
    >
      <div
        class="origin-left transition-transform duration-300 ease-in-out border-b-2 border-gray-darkest"
        :style="style"
      />
    </div>
    <p class="small-caps">{{ currentValue }} of {{ maxValue }}</p>
  </div>
</template>

<script>
export default {
  props: {
    maxValue: {
      type: Number,
      required: true,
    },
    currentValue: {
      type: Number,
      required: true,
    },
  },
  computed: {
    style() {
      return {
        transform: `scaleX(${
          this.currentValue / this.maxValue
        }) translateY(1px)`,
      };
    },
  },
};
</script>