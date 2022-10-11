<script>
import SliderWrapper from "../components/SliderWrapper";
import debounce from "lodash.debounce";
import { db } from "../db";

export default {
  props: {
    initialData: { type: Object },
  },
  components: {
    SliderWrapper,
  },
  data() {
    return {
      nationality: "",
      order: "alphabet",
      orderOptions: [
        { label: "Alphabetical (A – Z)", value: "alphabet" },
        { label: "Alphabetical (Z – A)", value: "alphabet:desc" },
        { label: "Most Followers", value: "followers:desc" },
        { label: "Least Followers", value: "followers" },
      ],
      search: "",
      currentArtwork: this.initialData.artwork,
      currentArtist: this.initialData.artist,
      scrollTop: true,
      scrollBottom: false,
      currentCharacter: "A",
      view:
        window.localStorage.getItem("artists_page_preferred_view") || "grid",
      showSearch: false,
      artists: [],
      loading: true,
    };
  },
  async created() {
    await this.$bind("artists", db.collection("artists"));
    this.loading = false;
  },
  mounted() {
    window.addEventListener("scroll", this.handleDocumentScroll);
  },
  unmounted() {
    window.removeEventListener("scroll", this.handleDocumentScroll);
  },
  watch: {
    view() {
      this.order = "alphabet";
      window.localStorage.setItem("artists_page_preferred_view", this.view);
    },
    characters() {
      this.currentCharacter = this.characters[0];
    },
  },
  computed: {
    filteredArtists() {
      return this.artists.filter(this.filterArtist);
    },
    sortedArtists() {
      return this.filteredArtists.sort(this.sortArtists);
    },
    extendedArtists() {
      return this.sortedArtists.map((artist) => {
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
      });
    },
    characters() {
      return this.sortedArtists
        .map((artist) => {
          return artist.title.split(" ").pop()[0];
        })
        .filter((item, idx, self) => {
          return self.indexOf(item) === idx;
        });
    },
  },
  methods: {
    filterArtist(artist) {
      if (!this.search && !this.nationality) return true;
      if (
        this.search &&
        !artist.title.toLowerCase().includes(this.search.toLowerCase())
      )
        return false;
      if (this.nationality && artist.nationality !== this.nationality)
        return false;
      return true;
    },
    sortArtists(a, b) {
      const lastnameA = a.title.split(" ").pop();
      const lastnameB = b.title.split(" ").pop();
      switch (this.order) {
        case "alphabet":
          return lastnameA.toLowerCase() < lastnameB.toLowerCase() ? -1 : 1;
        case "alphabet:desc":
          return lastnameA.toLowerCase() < lastnameB.toLowerCase() ? 1 : -1;
        case "followers":
          return (a.followers || 0) - (b.followers || 0);
        case "followers:desc":
          return (b.followers || 0) - (a.followers || 0);
        default:
          return 0;
      }
    },
    handleDocumentScroll: debounce(function () {
      const scrollTop = window.scrollY;
      const listItems =
        this.$refs.rows && this.$refs.rows.querySelectorAll("li");
      if (listItems)
        [...listItems].find((listItem) => {
          const parentOffset = listItem.offsetParent.offsetParent.offsetTop;
          if (
            parentOffset + listItem.offsetTop <= scrollTop &&
            parentOffset + listItem.offsetTop + listItem.offsetHeight >
              scrollTop
          ) {
            this.currentCharacter = listItem.dataset.char;
            return true;
          }
          return false;
        });
    }, 200),
    scrollToItem(hash) {
      this.currentCharacter = hash;
      const firstElementOfChar = this.$refs.rows?.querySelector(
        `li[data-char=${hash}]`
      );
      if (!firstElementOfChar) return;

      // check if mobile or desktop view
      if (this.$refs.image.offsetParent === null) {
        firstElementOfChar.scrollIntoView();
      } else {
        this.$refs.rows.scrollTo(0, firstElementOfChar.offsetTop);
      }
    },
    updateArtist: debounce(function ({ artist, artwork }) {
      if (artist && artwork) {
        this.currentArtist = artist;
        this.currentArtwork = artwork;
      }
    }, 200),
    updateScroll: debounce(function (e) {
      const { scrollTop, offsetHeight, scrollHeight } = e.target;
      const listItems =
        this.$refs.rows && this.$refs.rows.querySelectorAll("li");
      if (listItems) {
        for (const listItem of listItems) {
          if (
            listItem.offsetTop - 64 <= scrollTop &&
            listItem.offsetTop - 64 + listItem.offsetHeight > scrollTop
          ) {
            this.currentCharacter = listItem.dataset.char;
            break;
          }
        }
      }
      if (scrollTop === 0) this.scrollTop = true;
      else this.scrollTop = false;
      if (scrollTop + offsetHeight === scrollHeight) this.scrollBottom = true;
      else this.scrollBottom = false;
    }, 200),
  },
};
</script>