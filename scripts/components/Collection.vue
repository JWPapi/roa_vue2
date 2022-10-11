<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["currentCurrency"]),
  },
};
</script>