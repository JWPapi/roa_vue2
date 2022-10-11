<template>
  <focus-trap :active="isOpen">
    <div class="relative" @keydown.esc="isOpen = false">
      <slot name="activator" :toggle="toggle"></slot>
      <transition name="fade">
        <div
          v-if="isOpen"
          class="
            absolute
            top-auto
            z-50
            right-0
            w-64
            py-4
            bg-gray-darkest
            text-white
            shadow-lg
          "
        >
          <div class="flex justify-between items-center m-4 mt-0">
            <p class="tiny uppercase tracking-wider">{{ label }}</p>
            <roa-icon-button
              v-if="isOpen"
              @click="isOpen = false"
              small
              icon="cross"
              >Close</roa-icon-button
            >
          </div>
          <slot></slot>
        </div>
      </transition>
    </div>
  </focus-trap>
</template>

<script>
import { FocusTrap } from "focus-trap-vue";
import RoaIconButton from "./RoaIconButton.vue";
export default {
  components: { FocusTrap, RoaIconButton },
  props: {
    label: { type: String },
  },
  data() {
    return { isOpen: false };
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>