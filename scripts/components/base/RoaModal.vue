<template>
  <portal to="modal">
    <transition name="fade" appear>
      <div
        role="dialog"
        class="
          fixed
          inset-0
          w-full
          h-full
          bg-opacity-50 bg-black
          flex
          justify-center
          items-center
          z-50
          sm:p-6 sm:pb-10
        "
        @click.self="closeable && $emit('close')"
        id="modal-focus"
        tabindex="0"
      >
        <focus-trap initial-focus="#modal-focus">
          <div
            class="
              relative
              bg-white
              w-full
              h-full
              sm:h-auto sm:max-w-md
              p-8
              overflow-y-auto
              max-h-full
            "
            v-scroll-lock="true"
            @keydown.esc="$emit('close')"
          >
            <roa-icon-button
              icon="cross"
              v-if="closeable"
              solid
              @click="$emit('close')"
              class="absolute top-0 right-0 m-4"
            >
              Close
            </roa-icon-button>
            <slot></slot>
          </div>
        </focus-trap>
      </div>
    </transition>
  </portal>
</template>
<script>
import { FocusTrap } from "focus-trap-vue";
export default {
  components: { FocusTrap },
  props: { closeable: { type: Boolean, default: true } },
};
</script>
