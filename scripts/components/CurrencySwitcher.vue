<template>
  <roa-select
    :value="currentCurrency.code"
    @input="updateCurrency"
    class="w-32"
    label="Currency"
    required
    v-if="currentCurrency"
  >
    <option
      :value="curr.code"
      v-for="curr in currencies"
      :key="curr.code"
      :selected="curr.code === currentCurrency.code"
    >
      {{ curr.symbol }} {{ curr.code }}
    </option>
  </roa-select>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["currencies", "currentCurrency"]),
  },
  methods: {
    updateCurrency(newCode) {
      this.$store.dispatch("setCurrency", newCode);
    },
  },
};
</script>