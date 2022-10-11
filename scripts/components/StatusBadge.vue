<template>
  <span
    class="pill bg-blue"
    :class="light ? 'text-gray-darkest' : 'text-white'"
    :style="{ backgroundColor: color }"
  >
    {{ name }}
  </span>
</template>

<script>
const statuses = {
  awaiting_payment: {
    name: "Awaiting payment",
    color: "#4F4F4F",
    light: false,
  },
  pending: {
    name: "Pending",
    color: "#8A9095",
    light: false,
  },
  completed: {
    name: "Completed",
    color: "#0072CE",
    light: false,
  },
  shipped: {
    name: "Shipped",
    color: "#0072CE",
    light: false,
  },
  cancelled: {
    name: "Cancelled",
    color: "#F94223",
    light: false,
  },
  disputed: {
    name: "Disputed",
    color: "#F94223",
    light: false,
  },
  refunded: {
    name: "Refunded",
    color: "#F9C81C",
    light: true,
  },
  refunded_partially: {
    name: "Refunded Partially",
    color: "#F9C81C",
    light: true,
  },
};
export default {
  props: {
    status: { type: String, default: "" },
  },
  computed: {
    name() {
      return statuses[this.status]?.name || "Not available";
    },
    light() {
      return statuses[this.status]?.light || false;
    },
    color() {
      return statuses[this.status]?.color || "#D0D3D4";
    },
  },
};
</script>