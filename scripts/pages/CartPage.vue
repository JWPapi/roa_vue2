<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["cart", "total", "cartLoading", "currentCurrency"]),
  },
  methods: {
    ...mapActions(["removeFromCart"]),
  },
};
</script>