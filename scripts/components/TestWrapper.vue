<template>
  <transition :appear="!fallback" :name="transition" mode="out-in">
    <div :key="value[testId]">
      <slot :name="value[testId]">
        <slot name="fallback"></slot>
      </slot>
    </div>
  </transition>
</template>

<script>
window.__roaABTestSettings = window.__roaABTestSettings || {};
window.__roaABTestSetOption = function (testId, value) {
  window.__roaABTestSettings[testId] = value;
  return window.__roaABTestSettings;
};

export default {
  props: {
    testId: { type: String, required: true },
    fallback: { type: String },
    transition: { type: String, default: "fade" },
  },
  data() {
    window.__roaABTestSetOption(this.testId, this.fallback);
    return {
      value: window.__roaABTestSettings,
    };
  },
};
</script>