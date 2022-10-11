<script>
import axios from "axios";
import VueRecaptcha from "vue-recaptcha";
export default {
  components: { VueRecaptcha },
  data() {
    return {
      loading: false,
      success: false,
      email: "",
      firstname: "",
      lastname: "",
      newsletter_confirmed: false,
      terms_confirmed: false,
      message: "",
    };
  },
  methods: {
    resetValues() {
      this.email = "";
      this.firstname = "";
      this.lastname = "";
      this.newsletter_confirmed = false;
      this.terms_confirmed = false;
      this.message = "";
    },
    async recaptchaVerify() {
      try {
        const formData = new FormData(this.$refs.form);
        formData.delete("_token");
        await axios.post(this.$refs.form.action, formData);
        this.$roast.success("The form was submitted successfully.");
        this.success = true;
        this.$emit("success");
        this.resetValues();
      } catch (e) {
        this.$roast.error(
          e?.response?.data?.errors.join(" ") || "Something went wrong."
        );
      } finally {
        this.loading = false;
        this.$refs.recaptcha.reset();
      }
    },
    async onSubmit() {
      this.loading = true;
      this.$refs.recaptcha.execute();
    },
  },
};
</script>