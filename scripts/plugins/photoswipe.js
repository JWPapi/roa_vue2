import Vue from "vue";
import Photoswipe from "vue-pswipe";

Vue.use(Photoswipe, {
  bgOpacity: 0.75,
  shareEl: false,
  barsSize: { top: 48, bottom: 48 },
  timeToIdle: 100000,
  timeToIdleOutside: 100000,
  maxSpreadZoom: 3,
  tapToToggleControls: false,
});
