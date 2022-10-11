<script>
import { mapGetters } from "vuex";
import axios from "axios";
import Vue from "vue";
import { loadStripe } from "@stripe/stripe-js";
import * as Sentry from "@sentry/vue";

export default {
  props: {
    stripeKey: { type: String, required: true },
  },
  data() {
    return {
      email: "",
      billing_diff: false,
      newsletter_consent: false,
      shippingAddress: {
        firstName: "",
        lastName: "",
        company: "",
        phone: "",
        addr1: "",
        addr2: "",
        city: "",
        zip: "",
        country: "",
        state: "",
      },
      billingAddress: {
        firstName: "",
        lastName: "",
        company: "",
        phone: "",
        addr1: "",
        addr2: "",
        city: "",
        zip: "",
        country: "",
        state: "",
      },
      stripe: null,
      card: null,
      stripeError: "",
      couponCode: "",
      couponLoading: false,
      couponError: "",
      clientSecret: null,
      PIId: null,
      checkoutLoading: false,
      eventSent: false,
    };
  },
  mounted() {
    this.initStripe();
    this.$root.$on("cart", (cart) => {
      this.shippingAddress.country = cart?.country?.code || null;
    });
  },
  watch: {
    cartItems() {
      if (!this.cartItems.length) {
        window.location.replace("/store/cart");
      }
    },
    cartLoading() {
      if (!this.cartLoading && !this.eventSent) {
        this.$analytics.dispatchEcommerceEvent(
          "begin_checkout",
          this.cartItems.map(({ product }) => product),
          this.cart.total.sub
        );
        this.eventSent = true;
      }
    },
    user() {
      if (!this.email) this.email = this.user.email;
      if (!this.user?.address) {
        this.shippingAddress.firstName =
          this.shippingAddress.firstName || this.user.firstName;
        this.shippingAddress.lastName =
          this.shippingAddress.lastName || this.user.lastName;
        this.shippingAddress.phone =
          this.shippingAddress.phone || this.user.phone;
      } else {
        this.shippingAddress = {
          firstName: this.user.address.firstName || this.user.firstName,
          lastName: this.user.address.lastName || this.user.lastName,
          phone: this.user.phone,
          ...this.user.address,
        };
      }
    },
  },
  computed: {
    ...mapGetters([
      "cart",
      "currentCurrency",
      "cartItems",
      "total",
      "coupons",
      "cartLoading",
    ]),
    user() {
      return this.$auth.currentUser;
    },
  },
  methods: {
    async addCoupon() {
      this.couponLoading = true;
      this.couponError = "";
      const error = await this.$store.dispatch("addCoupon", {
        coupon: this.couponCode,
        email: this.email,
      });
      if (error?.message) this.couponError = error.message;
      this.couponLoading = false;
    },
    async removeCoupon() {
      this.couponLoading = true;
      const error = await this.$store.dispatch("removeCoupon");
      if (error?.message) this.couponError = error.message;
      this.couponLoading = false;
    },
    async initStripe() {
      this.stripe = await loadStripe(this.stripeKey);
    },
    async onSubmit(e) {
      if (!e.target.reportValidity()) return;
      this.checkoutLoading = true;
      try {
        const { data } = await axios.get("/store/cart/payment");
        this.clientSecret = data.client_secret;
        this.payWithCard();
      } catch (e) {
        Sentry.captureException(e, "info");
        if (e.response?.data?.message)
          this.$roast.error(e.response.data.message);
        else this.$roast.cookie();
      }
    },
    async payWithCard() {
      // https://stripe.com/docs/js/payment_intents/confirm_card_payment
      const shippingAddress = {
        line1: this.shippingAddress.addr1,
        line2: this.shippingAddress.addr2,
        city: this.shippingAddress.city,
        postal_code: this.shippingAddress.zip,
        country: this.shippingAddress.country,
        state: this.shippingAddress.state,
      };
      const billingAddress = {
        line1: this.billingAddress.addr1,
        line2: this.billingAddress.addr2,
        city: this.billingAddress.city,
        postal_code: this.billingAddress.zip,
        country: this.billingAddress.country,
        state: this.billingAddress.state,
      };
      const result = await this.stripe.confirmCardPayment(this.clientSecret, {
        payment_method: {
          card: this.card,
          billing_details: {
            email: this.email,
            name: this.billing_diff
              ? `${this.billingAddress.firstName} ${this.billingAddress.lastName}`
              : `${this.shippingAddress.firstName} ${this.shippingAddress.lastName}`,
            phone: this.billingAddress.phone || this.shippingAddress.phone,
            address: this.billing_diff ? billingAddress : shippingAddress,
          },
        },
        receipt_email: this.email,
        shipping: {
          name: `${this.shippingAddress.firstName} ${this.shippingAddress.lastName}`,
          phone: this.shippingAddress.phone,
          address: shippingAddress,
        },
      });
      if (result.error) {
        this.$roast.error(result.error.message);
        this.checkoutLoading = false;
        return;
      }
      this.PIId = result.paymentIntent.id;
      Vue.nextTick(() => {
        this.$refs.form.submit();
      });
    },
  },
};
</script>
