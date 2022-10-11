<template>
  <roa-modal @close="removeSelf(true)">
    <roa-logo class="mx-auto my-6" />
    <auth-form
      @success="$emit('success', $event)"
      @close="removeSelf"
      v-bind="{ initialView }"
    />
  </roa-modal>
</template>

<script>
import RoaModal from "../components/base/RoaModal";
import RoaLogo from "../components/base/RoaLogo";
import AuthForm from "./AuthForm";
export default {
  components: {
    RoaModal,
    RoaLogo,
    AuthForm,
  },
  props: { initialView: { type: String, default: "login" } },
  methods: {
    removeSelf(cancelled = false) {
      if (cancelled) this.$emit("cancel");
      else this.$emit("success");
      this.$destroy();
      this.$el.parentNode.removeChild(this.$el);
    },
  },
};
</script>