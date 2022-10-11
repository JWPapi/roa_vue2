<template>
  <div class="paragraph">
    <roa-label-wrapper
      :label="compact ? 'Credit Card' : 'Card number'"
      :icon="compact ? null : 'card'"
      :disabled="disabled"
      :focus="cardNumber.focused"
      :error="!!error"
      required
      :is-empty="cardNumber.isEmpty"
    >
      <template #default="{ focused, disabled, isEmpty }">
        <div
          ref="cardNumber"
          class="bg-transparent focus:outline-none w-auto flex-1"
          :class="{
            'opacity-100': !isEmpty || focused,
            'opacity-0': isEmpty && !focused,
            'text-gray': disabled,
          }"
        ></div>
      </template>
    </roa-label-wrapper>
    <div class="flex w-full mt-4" v-if="!compact">
      <roa-label-wrapper
        class="flex-1 mr-4"
        :disabled="disabled"
        label="Card Expiry"
        :focus="cardExpiry.focused"
        :error="!!error"
        required
        :is-empty="cardExpiry.isEmpty"
      >
        <template #default="{ focused, disabled, isEmpty }">
          <div
            ref="cardExpiry"
            class="bg-transparent focus:outline-none w-auto flex-1"
            :class="{
              'opacity-100': !isEmpty || focused,
              'opacity-0': isEmpty && !focused,
              'text-gray': disabled,
            }"
          ></div>
        </template>
      </roa-label-wrapper>
      <roa-label-wrapper
        class="flex-1"
        label="CVC"
        :disabled="disabled"
        :focus="cardCvc.focused"
        :error="!!error"
        required
        :is-empty="cardCvc.isEmpty"
      >
        <template #default="{ focused, disabled, isEmpty }">
          <div
            ref="cardCvc"
            class="bg-transparent focus:outline-none w-auto flex-1"
            :class="{
              'opacity-100': !isEmpty || focused,
              'opacity-0': isEmpty && !focused,
              'text-gray': disabled,
            }"
          ></div>
        </template>
      </roa-label-wrapper>
    </div>
    <p v-if="error" class="text-red items-center mt-2 tiny flex" role="alert">
      <roa-icon
        name="attention-outline"
        class="mx-2 text-base flex-shrink-0 -mt-1 inline-block"
      />
      <span class="flex-1" v-html="error"></span>
    </p>
  </div>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";
const style = {
  base: {
    color: "#2D2926",
    fontFamily: "'Resist Sans Display', sans-serif",
    "::placeholder": {
      color: "#AEB6BD",
    },
  },
  invalid: {
    color: "#2D2926",
  },
};
export default {
  props: {
    compact: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    card: { required: true },
    stripe: { type: Object, required: true },
  },
  model: {
    prop: "card",
    event: "change",
  },
  data() {
    return {
      cardNumber: {
        isEmpty: true,
        focused: false,
      },
      cardExpiry: {
        isEmpty: true,
        focused: false,
      },
      cardCvc: {
        isEmpty: true,
        focused: false,
      },
      error: "",
    };
  },
  async mounted() {
    const elements = this.stripe.elements();
    const card = elements.create(this.compact ? "card" : "cardNumber", {
      style,
    });
    if (this.compact) {
      card.mount(this.$refs.cardNumber);
      this.addInputHandlers(this.card);
      return;
    }
    const cardExpiry = elements.create("cardExpiry", { style });
    const cardCvc = elements.create("cardCvc", { style });
    card.mount(this.$refs.cardNumber);
    cardExpiry.mount(this.$refs.cardExpiry);
    cardCvc.mount(this.$refs.cardCvc);
    [card, cardExpiry, cardCvc].forEach(this.addInputHandlers);
    this.$emit("change", card);
  },
  methods: {
    addInputHandlers(element) {
      element.on("change", (event) => this.handleChange(event));
      element.on("focus", (event) => this.handleFocus(event));
      element.on("blur", (event) => this.handleBlur(event));
    },
    handleChange(event) {
      let element = event.elementType;
      if (event.elementType === "card") element = "cardNumber";
      this[element].isEmpty = event.empty;
      this.error = event?.error?.message || "";
      this.$emit("change", this.card);
    },
    handleFocus(event) {
      let element = event.elementType;
      if (event.elementType === "card") element = "cardNumber";
      this[element].focused = true;
    },
    handleBlur(event) {
      let element = event.elementType;
      if (event.elementType === "card") element = "cardNumber";
      this[element].focused = false;
    },
  },
};
</script>