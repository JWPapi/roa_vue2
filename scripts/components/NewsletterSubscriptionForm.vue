<template>
  <form @submit.prevent="subscribe">
    <div class="flex flex-wrap items-start -m-1">
      <roa-input
        label="Your email"
        v-model.trim="email"
        :disabled="loading"
        type="email"
        :error="error"
        required
        autocomplete="email"
        class="m-1 flex-grow"
      />
      <roa-button
        type="submit"
        class="m-1 flex-1"
        @reset="
          loading = false;
          success = false;
        "
        v-bind="{ success, loading, white, secondary: white }"
      >
        {{ cta }}
      </roa-button>
    </div>
    <div v-if="success" class="hidden">
      <img
        src="https://trc.taboola.com/1333083/log/3/unip?en=lead"
        width="0"
        height="0"
      />
    </div>
  </form>
</template>
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
    cta: { type: String, default: "Join" },
    white: { type: Boolean, default: false },
  },

  data() {
    return {
      email: "",
      success: false,
      error: null,
      loading: false,
      uid: null,
      url: "https://returnonart.us16.list-manage.com/subscribe/post-json",
    };
  },

  computed: {
    user() {
      return this.$auth.currentUser;
    },
    data() {
      return queryString.stringify({
        u: this.userId,
        id: this.listId,
        EMAIL: this.email,
        ARTMATCHID: this.uid,
      });
    },
  },
  watch: {
    user(user) {
      if (user?.email) this.email = user.email;
    },
  },
  methods: {
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
        this.email = "";
        this.$emit("success");
      }
    },
  },
};
</script>
