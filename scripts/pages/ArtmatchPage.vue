<template>
  <div>
    <transition name="fade" mode="out-in">
      <div v-if="loading && state !== 'instructions'">
        <roa-logo type="spinning" class="mx-auto my-16"></roa-logo>
      </div>
      <instructions
        v-else-if="state === 'instructions'"
        @start="start"
        :loading="loading"
      ></instructions>
      <cards
        v-else-if="state === 'swipe'"
        :artworks="artworks"
        @finish="handleFinish"
      />
      <results
        v-else-if="state === 'results'"
        @restart="restart"
        :data="results"
      />
    </transition>
  </div>
</template>

<script>
import Instructions from "../components/artmatch/Instructions";
import Cards from "../components/artmatch/Cards";
import axios from "axios";
import Results from "../components/artmatch/Results";

export default {
  components: { Cards, Instructions, Results },
  data() {
    return {
      state: "instructions",
      results: {},
      artworks: [],
      loading: false,
      error: "",
      endpoint: window.roa?.matchEndpoint
    };
  },
  beforeMount() {
    const storedResults = localStorage.getItem("results");
    this.uid = localStorage.getItem("uid");
    if (storedResults) {
      this.results = JSON.parse(storedResults);
      this.state = "results";
    } else {
      this.fetchQuiz();
    }
  },
  methods: {
    start() {
      this.state = "swipe";
      this.$analytics.dispatchEvent("artmatch_start");
    },
    async handleFinish(ratings) {
      await this.fetchQuiz(ratings);
      this.$analytics.dispatchEvent("artmatch_finish");
    },
    async fetchQuiz(ratings) {
      this.loading = true;
      let postData = ratings
        ? {
            answers: ratings,
            uid: this.uid,
          }
        : {};
      try {
        const { data } = await axios.post(this.endpoint, postData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (data.status === "complete") {
          this.results = data;
          this.state = "results";
          localStorage.setItem("results", JSON.stringify(data));
        } else {
          this.uid = data.uid;
          this.artworks = data.artworks;
          this.ratings = [];
          localStorage.setItem("uid", data.uid);
        }
      } catch (e) {
        this.error = e;
        this.$roast.error('An error occured. Please try again later')
      }
      this.loading = false;
    },
    async restart() {
      this.loading = true;
      localStorage.removeItem("results");
      localStorage.removeItem("uid");
      this.artworks = [];
      this.results = {};
      await this.fetchQuiz();
      this.state = "swipe";
      this.loading = false;
    },
  },
};
</script>