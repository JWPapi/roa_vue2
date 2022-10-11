<template>
  <div
    class="h-full pt-4 sm:pt-8 flex flex-col items-center p-4 w-full overflow-visible"
  >
    <div class="flex mb-4 sm:mb-8">
      <div
        class="flex-shrink-0 flex flex-col items-center justify-center text-center mr-6"
      >
        <roa-icon-button icon="arrow-left" round @click="$emit('pass')">
          Pass
        </roa-icon-button>
        <p class="h3 handwritten text-gray-solid">pass</p>
      </div>
      <div
        class="flex-shrink-0 flex flex-col items-center justify-center text-center"
      >
        <roa-icon-button icon="arrow-right" round @click="$emit('like')">
          Like
        </roa-icon-button>
        <p class="h3 handwritten text-gray-solid">Like</p>
      </div>
    </div>
    <progress-bar :max-value="cardsLength" :current-value="cardsLeft" />
  </div>
</template>

<script>
import ProgressBar from "./ProgressBar";
export default {
  props: { cardsLength: Number, cardsLeft: Number },
  components: { ProgressBar },
};
</script>
