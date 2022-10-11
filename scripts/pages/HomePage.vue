<script>
import HeroCarousel from "../components/HeroCarousel";
import SliderWrapper from "../components/SliderWrapper";
import TestimonialsSlider from "../components/TestimonialsSlider";
import HomeGallery from "../components/HomeGallery";
import ArtworksSlider from "../components/ArtworksSlider";
import SectionHeading from "../components/SectionHeading";
import { db } from "../db";
export default {
  components: {
    HeroCarousel,
    SliderWrapper,
    TestimonialsSlider,
    HomeGallery,
    ArtworksSlider,
    SectionHeading,
  },
  props: {
    featuredArtists: { type: Array, default: [] },
  },
  data() {
    return {
      recentArtworks: [],
      trendingArtists: [],
      featuredArtistsArtworks: [],
      latestArtists: [],
      recentArtworksLoading: true,
      trendingArtistsLoading: true,
      featuredArtistsArtworksLoading: true,
    };
  },
  computed: {
    extendedTrendingArtists() {
      return this.trendingArtists.map(this.extendArtist);
    },
  },
  async created() {
    this.loadRecentArtworks();
    this.loadFeaturedArtistsArtworks();
    this.loadTrendingArtists();
    this.loadLatestArtists();
  },
  methods: {
    extendArtist(artist) {
      const extendedArtist = { ...artist };
      extendedArtist["image"] = artist.photo;
      if (artist.cover_image) {
        extendedArtist["image"] = artist.cover_image;
        extendedArtist["focalpoint"] = artist.cover_image_focus;
      } else if (artist.featured_artwork) {
        extendedArtist["image"] = artist.featured_artwork.image;
        extendedArtist["focalpoint"] = artist.featured_artwork.image_focus;
      }
      return extendedArtist;
    },
    async loadRecentArtworks() {
      await this.$bind(
        "recentArtworks",
        db
          .collection("artworks")
          .where("available", "==", true)
          .where("unlisted", "==", false)
          .orderBy("date", "desc")
          .limit(16),
        { maxRefDepth: 0 }
      );
      this.recentArtworksLoading = false;
    },
    async loadTrendingArtists() {
      await this.$bind(
        "trendingArtists",
        db.collection("artists").orderBy("followers", "desc").limit(8)
      );
      this.trendingArtistsLoading = false;
    },
    async loadLatestArtists() {
      await db
        .collection("artists")
        .orderBy("date", "desc")
        .limit(20)
        .get()
        .then(async (queryResultsArtists) => {
          if (queryResultsArtists) {
            queryResultsArtists.docs.map(async (artist) => {
              await db
                .collection("artworks")
                .where("available", "==", true)
                .where("unlisted", "==", false)
                .where("artist.id", "==", artist.id)
                .get()
                .then((queryResultsArtworks) => {
                  if (!queryResultsArtworks.empty) {
                    this.latestArtists.push({ id: artist.id, ...artist.data() });
                  }
                });
            });
          }
        });
    },
    async loadFeaturedArtistsArtworks() {
      await Promise.all([
        ...this.featuredArtists.map(async (artist) => {
          const artistReference = db.collection("artists").doc(artist.id);
          let artworks = [
            ...(
              await db
                .collection("artworks")
                .where("available", "==", true)
                .where("unlisted", "==", false)
                .where("artistReference", "==", artistReference)
                .get()
            ).docs.map((artworkRef) => ({
              id: artworkRef.id,
              ...artworkRef.data(),
            })),
          ];
          this.featuredArtistsArtworks.push({
            artist,
            artworks,
          });
        }),
      ]);
      this.featuredArtistsArtworksLoading = false;
    },
  },
};
</script>