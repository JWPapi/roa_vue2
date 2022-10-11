<template>
  <div class="sm:flex mt-8">
    <div class="sm:w-1/2 sm:max-w-md">
      <h4 class="small-caps my-8">Personal Information</h4>
      <form @submit.prevent="updatePersonalInformation()">
        <roa-input
          label="First name"
          v-model="personalInfo.firstName"
          required
          class="w-full"
        />
        <roa-input
          label="Last name"
          v-model="personalInfo.lastName"
          required
          class="mt-4 w-full"
        />
        <roa-input
          label="Phone"
          type="tel"
          autocomplete="tel"
          v-model="personalInfo.phone"
          class="mt-4 w-full"
        ></roa-input>
        <p class="small-caps ml-1 mt-4 text-gray-darkest">Birthday</p>
        <div class="flex">
          <roa-select
            label="Month"
            class="flex-1 mr-4"
            v-model="personalInfo.birthday.month"
            :required="!!personalInfo.birthday.date"
          >
            <option
              v-for="(option, idx) in months"
              :key="idx"
              :value="idx + 1"
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
            v-model="personalInfo.birthday.date"
            :required="!!(personalInfo.birthday.month || personalInfo.birthday.date)"
          />
        </div>
        <roa-button
          class="mt-4 w-full"
          type="submit"
          :disabled="!isPersonalInfoChanged"
          :success="personalInfo.success"
          @reset="personalInfo.success = false"
          :loading="personalInfo.loading"
        >
          Save changes
        </roa-button>
      </form>
      <h4 class="small-caps my-8">Preferences</h4>
      <div class="flex justify-between items-center">
        <p class="paragraph flex-grow">Subscribed to newsletter</p>
        <roa-toggle
          class="flex-shrink-0"
          v-model="preferences.newsletter"
          :disabled="preferencesLoading"
          name="newsletter-subscription"
        />
      </div>
    </div>
    <div class="sm:w-1/2 sm:max-w-md sm:ml-16 mt-8 sm:mt-0">
      <h4 class="small-caps my-8">Shipping Information</h4>
      <form @submit.prevent="updateAddress()">
        <address-inputs
          v-model="address"
          class="flex flex-col gap-4"
          prefix="address"
          address-only
        ></address-inputs>
        <roa-button
          :loading="addressLoading"
          :disabled="!isAddressChanged"
          :success="addressSuccess"
          @reset="addressSuccess = false"
          type="submit"
          class="mt-4 w-full"
        >
          Save changes
        </roa-button>
      </form>
    </div>
  </div>
</template>

<script>
import RoaInput from "./base/RoaInput";
import AddressInputs from "./AddressInputs.vue";
import RoaButton from "./base/RoaButton.vue";
import RoaModal from "./base/RoaModal.vue";
import RoaToggle from "./base/RoaToggle.vue";
import RoaSelect from "./base/RoaSelect.vue";
import firebase from "firebase/app";
import { format } from 'date-fns';
import "firebase/firestore";

export default {
  components: {
    RoaInput,
    RoaButton,
    RoaToggle,
    RoaModal,
    AddressInputs,
    RoaSelect,
  },
  data() {
    const [month = "", date = ""] = (this.$auth.currentUser?.birthday || "")
      .split("/").map(Number).filter(Boolean).map(String);

    return {
      personalInfo: {
        firstName: this.$auth.currentUser.firstName || "",
        lastName: this.$auth.currentUser.lastName || "",
        phone: this.$auth.currentUser.phone || "",
        birthday: {
          date,
          month,
        },
        loading: false,
        success: false,
      },
      preferences: {
        newsletter: !!this.$auth.currentUser.newsletter,
      },
      preferencesLoading: false,
      address: { ...this.$auth.currentUser.address, company: this.$auth.currentUser.company } || {
        addr1: "",
        addr2: "",
        company: "",
        city: "",
        zip: "",
        country: "",
        state: "",
      },
      addressLoading: false,
      addressSuccess: false,
      isAddressChanged: false,
      months: [...Array(12).keys()].map(i => format(new Date(null, i), 'LLLL')),
    };
  },
  computed: {
    birthdayString() {
      const string = [this.personalInfo.birthday.month, this.personalInfo.birthday.date]
        .map(v => v.toString().padStart(2, "0")).join('/');
      return string !== "00/00" ? string : undefined;
    },
    isPersonalInfoChanged() {
      return (
        this.personalInfo.firstName !== this.$auth.currentUser.firstName ||
        this.personalInfo.lastName !== this.$auth.currentUser.lastName ||
        this.personalInfo.phone !== this.$auth.currentUser.phone ||
        this.birthdayString !== this.$auth.currentUser.birthday
      );
    },
  },
  watch: {
    async 'preferences.newsletter'(newsletter) {
      this.preferencesLoading = true;
      try {
        await this.$auth.updateProfile({ newsletter });
        this.$roast.success(
          "Your subscription settings were successfully updated!"
        );
      } catch (error) {
        this.$roast.error(error.message);
      }
      this.preferencesLoading = false;
    },
    address: {
      deep: true,
      handler() { this.isAddressChanged = true },
    }
  },
  methods: {
    async updateAddress() {
      this.addressLoading = true;
      try {
        const { company, ...address } = this.address;
        await this.$auth.updateProfile({ address, company });
        this.$roast.success("Successfully updated your shipping address.");
      } catch (error) {
        this.$roast.error(error.message);
      }
      this.addressLoading = false;
      this.addressSuccess = true;
      this.isAddressChanged = false;
    },
    async updatePersonalInformation() {
      this.personalInfo.loading = true;
      try {
        if (this.isPersonalInfoChanged) {
          const payload = {
            firstName: this.personalInfo.firstName,
            lastName: this.personalInfo.lastName,
            phone: this.personalInfo.phone,
            birthday: this.birthdayString || firebase.firestore.FieldValue.delete(),
          };
          await this.$auth.updateProfile(payload);
        }
        this.personalInfo.success = true;
        this.$roast.success(
          "Your profile information was successfully updated!"
        );
      } catch (error) {
        if (error.code === "auth/requires-recent-login") {
          try {
            await this.$auth.reauthenticate();
            this.updatePersonalInformation();
          } catch (error) {
            this.$roast.attention("Your profile information was not updated.");
          }
        } else {
          this.$roast.error(error.message);
        }
      }
      this.personalInfo.loading = false;
    },
  },
};
</script>