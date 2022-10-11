<script>
import jsonp from "jsonp";
import queryString from "query-string";

export default {
  props: {
    userId: {
      required: true,
      type: String,
    },

    listId: {
      required: true,
      type: String,
    },
  },

  data() {
    return {
      email: null,
      success: false,
      error: null,
      loading: false,
      uid: null,
      url: "https://returnonart.us16.list-manage.com/subscribe/post-json",
    };
  },

  computed: {
    data() {
      return queryString.stringify({
        u: this.userId,
        id: this.listId,
        EMAIL: this.email,
        ARTMATCHID: this.uid,
      });
    },
  },

  methods: {
    setEmail(value = "") {
      this.email = value.trim();
    },

    subscribe() {
      if (this.email === null || this.loading) {
        return;
      }

      this.success = false;
      this.error = null;
      this.loading = true;
      this.uid = localStorage.getItem("uid");

      const url = `${this.url}?${this.data}`;
      jsonp(url, { param: "c" }, this.onResponse);
    },

    onResponse(error, data) {
      this.loading = false;

      if (error) {
        this.error = error;
      }

      if (data && data.result === "error") {
        this.error = data.msg;
      }

      if (this.error) {
        this.$emit("error", this.error);
      } else {
        this.success = true;
        this.email = null;
        this.$emit("success");
      }
    },
  },

  render() {
    return this.$scopedSlots.default({
      subscribe: this.subscribe,
      setEmail: this.setEmail,
      setUid: this.setUid,
      error: this.error,
      success: this.success,
      loading: this.loading,
    });
  },
};
</script>
