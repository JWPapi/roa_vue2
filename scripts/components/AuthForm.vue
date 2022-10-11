<template>
  <transition name="fade" mode="out-in">
    <div v-if="show === 'login'" key="login">
      <div class="flex flex-col">
        <roa-button
          :disabled="login.loading"
          class="mt-6 w-full"
          secondary
          @click="loginWithOAuth('google.com')"
          icon="google"
        >
          Sign in with <span class="font-medium">Google</span>
        </roa-button>
        <roa-button
          :disabled="login.loading"
          class="mt-6 w-full"
          secondary
          @click="loginWithOAuth('apple.com')"
          icon="apple"
        >
          Sign in with <span class="font-medium">Apple</span>
        </roa-button>
        <roa-button
          :disabled="login.loading"
          class="mt-6 w-full"
          secondary
          @click="loginWithOAuth('facebook.com')"
          icon="facebook"
        >
          Sign in with <span class="font-medium">Facebook</span>
        </roa-button>
      </div>
      <p class="mt-4 text-center paragraph w-full text-gray-darkest">
        or sign in with your email
      </p>
      <form @submit.prevent="submitLogin">
        <roa-input
          class="mt-4"
          required
          label="Email"
          v-model="login.data.email"
          type="email"
        ></roa-input>
        <roa-button
          :loading="login.loading"
          :success="login.success"
          class="mt-4 w-full"
          type="submit"
          >Continue</roa-button
        >
      </form>
    </div>
    <div v-else-if="show === 'loginMailSent'" key="loginMailSent">
      <p class="h4-uppercase mt-8 mb-8 text-center">Check your inbox</p>
      <p class="mt-4 text-center paragraph w-full text-gray-darkest">
        Click the link we sent to
        <strong class="font-medium">{{ login.data.email }}</strong> to sign in.
      </p>
      <roa-button class="mt-8 w-full" @click="$emit('close')">Ok</roa-button>
      <roa-button class="mt-2 w-full" plain @click="show = 'login'">
        Sign in with a different method
      </roa-button>
    </div>
    <div v-else-if="show === 'verifyEmail'" key="verifyEmail">
      <p class="h4-uppercase mt-8 mb-8 text-center">One last step</p>
      <p class="mt-4 text-center paragraph w-full text-gray-darkest">
        We need you to verify your email address to login.
      </p>
      <form @submit.prevent="submitEmailVerification()">
        <roa-input
          class="mt-4"
          required
          label="Email"
          v-model="verify.data.email"
          type="email"
        ></roa-input>
        <roa-button type="submit" class="mt-8 w-full">Verify</roa-button>
      </form>
    </div>
    <div v-else-if="show === 'addPersonalInformation'" key="register">
      <p class="h4-uppercase mt-8 mb-12 text-center">
        Let's get to know each other
      </p>
      <p class="paragraph text-gray-solid text-center">
        To fully use your Return on Account we need some personal information
        from you. We'll store it safely and will never sell your data.
      </p>
      <form @submit.prevent="addPersonalInformation">
        <roa-input
          class="mt-4"
          required
          label="First name"
          v-model="personalInformation.data.firstName"
        ></roa-input>
        <roa-input
          class="mt-4"
          required
          label="Last name"
          v-model="personalInformation.data.lastName"
        ></roa-input>
        <div class="flex mt-4">
          <roa-select
            label="Month"
            class="flex-1 mr-4"
            v-model="personalInformation.data.birthday.month"
          >
            <option
              v-for="(option, idx) in months"
              :key="idx"
              :value="(idx + 1).toString()"
            >
              {{ option }}
            </option>
          </roa-select>
          <roa-input
            label="Date"
            class="flex-1"
            type="number"
            min="1"
            max="31"
            v-model="personalInformation.data.birthday.date"
          />
        </div>
        <roa-checkbox
          name="register-terms-confirm"
          required
          v-model="personalInformation.data.privacy_check"
          class="mt-4"
        >
          I agree to Return on Art's
          <a href="/terms" target="_blank" rel="noopener noreferrer">
            Terms and Conditions</a
          >
          and
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </roa-checkbox>
        <roa-checkbox
          name="register-newsletter"
          v-model="personalInformation.data.newsletter"
          class="mt-4"
          label="Sign up for exclusive sales and artists news"
        ></roa-checkbox>
        <roa-button
          :loading="personalInformation.loading"
          class="mt-4 w-full"
          type="submit"
          >Register</roa-button
        >
      </form>
    </div>
  </transition>
</template>

<script>
import RoaButton from "./base/RoaButton.vue";
import RoaLinkButton from "./base/RoaLinkButton.vue";
import RoaInput from "./base/RoaInput.vue";
import RoaCheckbox from "./base/RoaCheckbox.vue";
import RoaLogo from "./base/RoaLogo.vue";
import RoaIcon from "./base/RoaIcon.vue";
export default {
  components: {
    RoaLogo,
    RoaInput,
    RoaCheckbox,
    RoaButton,
    RoaLinkButton,
    RoaIcon,
  },
  props: { initialView: { type: String, default: "login" } },
  data() {
    return {
      show: this.initialView,
      login: {
        data: {
          email: "",
        },
        loading: false,
      },
      verify: {
        data: {
          email: "",
        },
      },
      personalInformation: {
        data: {
          firstName: "",
          lastName: "",
          privacy_check: false,
          newsletter: false,
          birthday: {
            date: "",
            month: "",
          },
        },
        loading: false,
        success: false,
      },
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    };
  },
  methods: {
    async loginWithOAuth(provider) {
      this.login.loading = true;
      try {
        if (provider === "google.com") await this.$auth.loginWithGoogle();
        else if (provider === "facebook.com")
          await this.$auth.loginWithFacebook();
        else if (provider === "apple.com") await this.$auth.loginWithApple();
        this.$roast.success("You've successfully logged in!");
        this.$emit("close");
      } catch (error) {
        this.$roast.error(error.message);
      }
      this.login.loading = false;
    },
    async submitLogin() {
      this.login.loading = true;
      try {
        await this.$auth.loginWithEmail(this.login.data);
        this.show = "loginMailSent";
      } catch (error) {
        this.$roast.error(error.message);
      }
      this.login.loading = false;
    },
    async submitEmailVerification() {
      this.$emit("success", this.verify.data.email);
      this.$emit("close");
    },
    async addPersonalInformation() {
      this.personalInformation.loading = true;
      try {
        const birthday = `${this.personalInformation.data.birthday.month.padStart(
          2,
          "0"
        )}/${this.personalInformation.data.birthday.date.padStart(2, "0")}`;
        const data = {
          firstName: this.personalInformation.data.firstName,
          lastName: this.personalInformation.data.lastName,
          privacy_check: this.personalInformation.data.privacy_check,
          newsletter: this.personalInformation.data.newsletter,
          birthday,
        };
        await this.$auth.updateProfile(data);
        this.$roast.success(
          "Welcome to Return on Art! It's great to have you."
        );
        this.$emit("success");
        this.$emit("close");
      } catch (error) {
        this.$roast.error(error.message);
      }
      this.personalInformation.loading = false;
    },
  },
};
</script>