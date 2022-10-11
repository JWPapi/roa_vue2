<script>
import axios from "axios";
import VueRecaptcha from "vue-recaptcha";
import countries from "../countries";
export default {
  components: { VueRecaptcha },
  data() {
    return {
      loading: false,
      success: false,
      firstname: "",
      lastname: "",
      artistname: "",
      email: "",
      instagram: "",
      instrmatrnum: "",
      website: "",
      country: "",
      studenttype: "",
      isFulltime: false,
      portfolio: null,
      message: "",
      countries,
    };
  },
  computed: {
    emailHasDoubleAt() {
      return this.email.indexOf("@") !== this.email.lastIndexOf("@");
    },
  },
  methods: {
    resetValues() {
      this.firstname = "";
      this.lastname = "";
      this.artistName = "";
      this.email = "";
      this.instagram = "";
      this.instrmatrnum = "";
      this.website = "";
      this.country = "";
      this.studenttype = "";
      this.portfolio = null;
      this.message = "";
      this.isFulltime = false;
    },
    async recaptchaVerify() {
      this.$refs.recaptcha.reset();
      try {
        const formData = new FormData(this.$refs.form);
        formData.delete("_token");
        formData.set("email", this.email);
        await axios.post(this.$refs.form.action, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.$roast.success("The form was submitted successfully.");
        this.success = true;
        this.$emit("success");
        this.resetValues();
      } catch (e) {
        this.$roast.error(
          e?.response?.data.errors.join("\n") || "Something went wrong."
        );
      } finally {
        this.loading = false;
      }
    },
    async onSubmit() {
      this.loading = true;
      this.$refs.recaptcha.execute();
    },
  },
};
</script>