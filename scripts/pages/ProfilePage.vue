<template>
  <div v-if="!$auth.loading && $auth.loggedIn" class="mb-16">
    <div class="flex items-center justify-between mt-8">
      <h3 class="h4-uppercase">
        {{ $auth.currentUser.firstName || "" }}
        {{ $auth.currentUser.lastName || "" }}
      </h3>
      <roa-button plain v-if="$auth.loggedIn" @click="$auth.signOut">
        Log out
      </roa-button>
    </div>
    <roa-tabs
      v-if="$auth.loggedIn"
      :panels="[
        'Following',
        'Favorites',
        'My portfolio',
        'Order history',
        'Settings',
      ]"
    >
      <template #Following>
        <following-artists />
      </template>
      <template #Favorites>
        <favorite-artworks />
      </template>
      <template slot="My portfolio">
        <profile-artworks />
      </template>
      <template slot="Order history">
        <profile-orders />
      </template>
      <template #Settings>
        <profile-settings />
      </template>
    </roa-tabs>
  </div>
  <div v-else-if="!$auth.loading" class="text-center my-16">
    <h2 class="h4-uppercase">You're not logged in yet</h2>
    <div class="max-w-sm mx-auto">
      <roa-button @click="$auth.showLogin()" class="mt-8 w-full">
        Login
      </roa-button>
    </div>
  </div>
</template>

<script>
import RoaButton from "../components/base/RoaButton.vue";
import RoaTabs from "../components/base/RoaTabs.vue";
import ProfileSettings from "../components/ProfileSettings";
import FollowingArtists from "../components/FollowingArtists";
import FavoriteArtworks from "../components/FavoriteArtworks";
import ProfileOrders from "../components/ProfileOrders";
import ProfileArtworks from "../components/ProfileArtworks.vue";
export default {
  components: {
    RoaButton,
    RoaTabs,
    ProfileSettings,
    FollowingArtists,
    FavoriteArtworks,
    ProfileOrders,
    ProfileArtworks,
  },
  mounted() {
    const getParams = new URLSearchParams(location.search);
    const mode = getParams.get("mode");
    if (mode)
      switch (mode) {
        case "resetPassword":
          this.$auth.resetPassword();
          break;
        case "verifyEmail":
          this.$auth.verifyEmail();
          break;
        case "recoverEmail":
          this.$auth.recoverEmail();
          break;
        case "signIn":
          this.signIn();
          break;
        default:
          break;
      }
  },
  methods: {
    async signIn() {
      try {
        await this.$auth.loginWithLink();
        this.$roast.success("You've successfully logged in!");
      } catch (error) {
        console.error(error);
        if ((error = "Action cancelled by user.")) return;
        this.$roast.error(error.message);
        this.signIn();
      }
    },
  },
};
</script>