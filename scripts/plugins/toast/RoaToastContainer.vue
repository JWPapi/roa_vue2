<template>
  <div
    class="fixed top-0 w-full flex items-center flex-col z-50 p-1 pointer-events-none"
  >
    <transition-group name="toasts">
      <roa-toast
        v-for="toast in toasts"
        :key="toast.id"
        :toast="toast"
        class="pointer-events-auto"
      ></roa-toast>
    </transition-group>
  </div>
</template>

<script>
import RoaToast from "./RoaToast";
import { mapGetters } from "vuex";
export default {
  components: { RoaToast },
  computed: {
    ...mapGetters(["toasts"]),
  },
};
</script>

<style lang="scss" scoped>
.toasts-enter-active {
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toasts-leave-active {
  transition: transform 200ms, opacity 200ms;
}

.toasts-move {
  transition: transform 100ms ease-in-out;
}

.toasts-leave,
.toasts-enter-to {
  transform: translateY(0);
}

.toasts-leave-to,
.toasts-enter {
  transform: translateY(-110%);
  opacity: 0;
}
</style>