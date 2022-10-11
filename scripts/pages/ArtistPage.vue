<script>
import SliderWrapper from "../components/SliderWrapper";
import MediaGallery from "../components/MediaGallery";
import ArtistAppreciationChart from "../components/ArtistAppreciationChart";
import ArtistDetails from "../components/ArtistDetails";
import { db, PROFILES_REFERENCE } from "../db";
import firebase from "firebase/app";
import "firebase/firestore";
export default {
  components: {
    ArtistAppreciationChart,
    ArtistDetails,
    MediaGallery,
    SliderWrapper,
  },
  props: {
    id: { type: String, required: true },
    title: { type: String, required: true },
  },
  data() {
    return {
      showGalleryView: false,
      loading: true,
      artworksSold: [],
      artworksAvailable: [],
      artist: { id: this.id, title: this.title },
      followingLoading: false,
      showFullBio: false,
      showChartInfo: false,
    };
  },
  computed: {
    userFollowsArtist() {
      if (!this.$auth.currentUser?.followedArtists) return false;
      return !!this.$auth.currentUser?.followedArtists.find(
        (artist) => artist.id === this.id
      );
    },
    soldCount() {
      const number = this.artworksSold.length;
      if (number > 100) return "100+";
      return number;
    },
  },
  async created() {
    await Promise.all([
      this.$bind("artist", db.collection("artists").doc(this.id)),
      this.$bind(
        "artworksAvailable",
        db
          .collection("artworks")
          .where("available", "==", true)
          .where("unlisted", "==", false)
          .where("artistReference", "==", db.collection("artists").doc(this.id))
          .orderBy("date", "desc"),
        { maxRefDepth: 0 }
      ),
      this.$bind(
        "artworksSold",
        db
          .collection("artworks")
          .where("available", "==", false)
          .where("unlisted", "==", false)
          .where("artistReference", "==", db.collection("artists").doc(this.id))
          .orderBy("date", "desc")
          .limit(101),
        { maxRefDepth: 0 }
      ),
    ]);
    this.loading = false;
  },
  methods: {
    async toggleArtistFollow({ title, id }) {
      if (!this.$auth.loggedIn) {
        await this.$auth.showLogin();
      }
      this.followingLoading = true;
      const userReference = PROFILES_REFERENCE.doc(this.$auth.currentUser.uid);
      try {
        if (this.userFollowsArtist) {
          await userReference.update({
            followedArtists: firebase.firestore.FieldValue.arrayRemove(
              db.collection("artists").doc(id)
            ),
          });
          this.$roast.success(`You unfollowed ${title}`);
          if (this.artist.followers) this.artist.followers -= 1;
        } else {
          await userReference.update({
            followedArtists: firebase.firestore.FieldValue.arrayUnion(
              db.collection("artists").doc(id)
            ),
          });
          this.$roast.success(`You will now receive updates on ${title}`);
          if (this.artist.followers) this.artist.followers += 1;
          else this.artist.followers = 1;
        }
      } catch (error) {
        this.$roast.error(error.message);
      }
      this.followingLoading = false;
    },
  },
};
</script>