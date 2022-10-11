import Vue from "vue";
import store from "./store";
import "./bootstrap";
import "./filters";
import "./plugins";
import AOS from "aos";
import "aos/dist/aos.css";

new Vue({
  el: "#main",
  store,
  async created() {
    await this.$store.dispatch("getCart");
    this.$store.commit("setCartLoading", false);
    AOS.init({
      duration: 500,
      easing: "ease-out-cubic",
      offset: 0,
      once: true,
      disable: window.innerWidth < 640,
    });
  },
  methods: {
    setViewHeight() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    },
  },
  mounted() {
    this.setViewHeight();
    window.addEventListener("resize", this.setViewHeight);
  },
});
