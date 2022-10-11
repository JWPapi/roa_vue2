<template>
  <div
    v-if="bordered"
    class="
      text-base
      border border-gray-darkest
      rounded-full
      p-3
      box-content
      overflow-visible
    "
  >
    <component :is="name" aria-hidden="true" />
  </div>
  <component v-else :is="name" aria-hidden="true" />
</template>

<script>
import * as icons from "./icons";
export default {
  props: {
    name: { type: String, required: true },
    bordered: { type: Boolean, default: false },
  },
  components: { ...icons },
};
</script>
