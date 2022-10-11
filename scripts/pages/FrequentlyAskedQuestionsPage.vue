
<script>
export default {
  props: {
    contents: {
      type: Array,
      required: true,
    }
  },
  computed: {
    categories() {
      return this.contents.map(({ title }) => title);
    },
  },
};
</script>