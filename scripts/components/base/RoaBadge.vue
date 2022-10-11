<template>
  <div class="inline-block relative">
    <slot></slot>
    <p
      class="tiny text-white bg-gray-darkest rounded-full m-1 w-5 h-5 absolute top-0 right-0 flex items-center justify-center pointer-events-none"
      v-if="show"
    >
      <span v-if="number">{{ number }}</span>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    number: { type: Number },
    show: { type: Boolean, default: true },
  },
};
</script>