<template>
  <div class="flex items-center">
    <audio :src="src" ref="player" class="hidden">
      <p class="paragraph-sm">
        Your browser doesn't support audio playback. You're welcome to
        <a :href="src">download the audio file</a> and play it on your device.
      </p>
    </audio>
    <roa-icon-button
      :disabled="!audioLoaded"
      class="bg-gray-dark text-white mr-2"
      @click="toggleAudio()"
      :icon="isPlaying ? 'pause' : 'play'"
    >
      {{ isPlaying ? "Pause" : "Play" }}
    </roa-icon-button>
    <div class="sm:flex items-center flex-1">
      <roa-range-input
        v-model="playbackTime"
        class="w-full sm:w-auto flex-grow mr-2"
        :disabled="!audioLoaded"
        step="0.1"
        :max="audioDuration"
      />
      <p class="small-caps sm:ml-4">{{ elapsedTime }} / {{ totalTime }}</p>
    </div>
  </div>
</template>
<script>
import RoaIconButton from "./RoaIconButton";
import RoaRangeInput from "./RoaRangeInput";
export default {
  components: { RoaIconButton, RoaRangeInput },
  props: { src: String },
  /**
   * playbackTime = local var that syncs to audio.currentTime
   * audioDuration = duration of audio file in seconds
   * isPlaying = boolean (true if audio is playing)
   *
   **/
  data() {
    return {
      playbackTime: 0,
      audioDuration: 100,
      audioLoaded: false,
      isPlaying: false,
    };
  },
  computed: {
    totalTime() {
      return this.convertTime(this.audioDuration);
    },
    elapsedTime() {
      return this.convertTime(this.playbackTime);
    },
    relativeTime() {
      return Math.min(this.playbackTime / this.audioDuration, 1);
    },
  },
  methods: {
    //Set the range slider max value equal to audio duration
    initSlider() {
      const audio = this.$refs.player;
      if (audio) {
        this.audioDuration = Math.round(audio.duration);
      }
    },
    //Convert audio current time from seconds to min:sec display
    convertTime(seconds = 0) {
      const format = (val) => val.toString().padStart(2, "0");
      const hours = (seconds / 3600) << 0;
      const minutes = ((seconds % 3600) / 60) << 0;
      seconds = seconds % 60 << 0;
      return [hours || null, minutes, seconds]
        .filter((val) => val !== null)
        .map(format)
        .join(":");
    },
    //Playback listener function runs every 100ms while audio is playing
    playbackListener(e) {
      const audio = this.$refs.player;
      //Sync local 'playbackTime' var to audio.currentTime and update global state
      this.playbackTime = audio.currentTime;

      //console.log("update: " + audio.currentTime);
      //Add listeners for audio pause and audio end events
      audio.addEventListener("ended", this.endListener);
      audio.addEventListener("pause", this.pauseListener);
    },
    //Function to run when audio is paused by user
    pauseListener() {
      this.isPlaying = false;
      this.listenerActive = false;
      this.cleanupListeners();
    },
    //Function to run when audio play reaches the end of file
    endListener() {
      this.isPlaying = false;
      this.listenerActive = false;
      this.cleanupListeners();
    },
    //Remove listeners after audio play stops
    cleanupListeners() {
      const audio = this.$refs.player;
      audio.removeEventListener("timeupdate", this.playbackListener);
      audio.removeEventListener("ended", this.endListener);
      audio.removeEventListener("pause", this.pauseListener);
    },
    toggleAudio() {
      const audio = this.$refs.player;
      if (audio.paused) {
        audio.play();
        this.isPlaying = true;
      } else {
        audio.pause();
        this.isPlaying = false;
      }
    },
  },
  watch: {
    isPlaying() {
      if (this.isPlaying) {
        const audio = this.$refs.player;
        this.initSlider();
        //console.log("Audio playback started.");
        //prevent starting multiple listeners at the same time
        if (!this.listenerActive) {
          this.listenerActive = true;
          //for a more consistent timeupdate, include freqtimeupdate.js and replace both instances of 'timeupdate' with 'freqtimeupdate'
          audio.addEventListener("timeupdate", this.playbackListener);
        }
      }
    },
    playbackTime() {
      const audio = this.$refs.player;
      const diff = Math.abs(this.playbackTime - audio.currentTime);
      if (diff > 0.01) {
        this.$refs.player.currentTime = this.playbackTime;
      }
    },
  },
  mounted() {
    this.$nextTick(function () {
      const audio = this.$refs.player;
      audio.addEventListener("loadedmetadata", this.initSlider);
      audio.addEventListener("canplay", () => (this.audioLoaded = true));
    });
  },
};
</script>