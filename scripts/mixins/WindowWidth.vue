<script>
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config.js";
export default {
  data() {
    const { screens: breakpoints } = resolveConfig(tailwindConfig).theme;

    for (let key in breakpoints) {
      breakpoints[key] = parseInt(breakpoints[key],10);
      if (isNaN(breakpoints[key])) delete breakpoints[key];
    }

    return {
      breakpoints,
      windowWidth: window.innerWidth,
    };
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("load", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("load", this.onResize);
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth;
    },
  },
};
</script>