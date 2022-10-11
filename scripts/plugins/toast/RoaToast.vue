<template>
  <div
    role="alert"
    class="px-8 py-4 bg-white rounded my-1 mx-4 max-w-md shadow flex items-center justify-center"
  >
    <roa-icon
      :name="icon"
      :class="{
        'text-gray-light': toast.type === 'INFO',
        'text-yellow': toast.type === 'ATTENTION',
        'text-blue': toast.type === 'SUCCESS',
        'text-red': toast.type === 'ERROR',
      }"
      class="text-xl mr-8 flex-shrink-0"
    ></roa-icon>
    <p class="flex-grow paragraph-sm" v-html="toast.text"></p>
  </div>
</template>

<script>
export default {
  props: {
    toast: { type: Object, required: true },
  },
  computed: {
    icon() {
      if (this.toast.type === "SUCCESS") return "success";
      else if (this.toast.type === "ATTENTION") return "attention";
      else if (this.toast.type === "ERROR") return "error";
      return "info";
    },
  },
  data() {
    return {
      timeout: null,
      delay: 6000,
    };
  },
  methods: {
    removeSelf() {
      this.$store.commit("removeToast", this.toast.id);
    },
  },
  mounted() {
    this.timeout = setTimeout(this.removeSelf, this.delay);
  },
};
</script>