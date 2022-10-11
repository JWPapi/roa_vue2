<template>
  <div class="paragraph text-gray-darkest">
    <h3>
      <button
        class="flex w-full py-6 pr-4 focus:outline-none group rounded justify-between text-left"
        :aria-expanded="isOpen"
        @click="isOpen = !isOpen"
      >
        <span class="group-focus:border-current border-b border-transparent">
          {{ label }}
        </span>
        <roa-icon
          name="chevron"
          class="transform"
          :class="isOpen && '-scale-y-100'"
        ></roa-icon>
      </button>
    </h3>
    <transition name="slide-down">
      <div v-if="isOpen" class="pt-2 pb-8">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script>
import RoaIcon from "./RoaIcon.vue";
export default {
  components: {
    RoaIcon,
  },
  props: {
    label: { type: String, required: true },
  },
  data() {
    return {
      isOpen: false,
    };
  },
};
</script>