<template>
  <div
    class="max-w-xl mx-auto px-4 flex flex-col items-center justify-center text-center text-gray-darkest my-8"
  >
    <h2 class="h2 mb-8"><span class="handwritten">Art match</span></h2>
    <p class="h4 max-w-md mx-auto">
      Swipe left or right to get your personal recommendations: a selection of
      artworks tailored to your individual taste.
    </p>
    <div class="flex justify-between items-center mb-8 mt-12">
      <div class="flex flex-col items-center sm:flex-shrink-0 justify-center">
        <roa-icon name="arrow-left" bordered></roa-icon>
        <p class="h3 handwritten text-gray-solid">pass</p>
        <p class="small-caps">Swipe left to pass</p>
      </div>
      <div class="relative sm:mx-8 w-1/3 sm:w-auto">
        <roa-image
          class="absolute inset-0 w-full h-full object-fill transform origin-bottom-left overflow-hidden -rotate-6"
          :w="150"
          sizes="(max-width: 640px) 33vw, 288px"
          :h="null"
          src="https://assets.returnonart.com/artworks/4f69d1a89eead7fdee346b5cbaf7e764j.jpg"
        ></roa-image>
        <roa-image
          class="relative"
          :w="150"
          sizes="(max-width: 640px) 33vw, 288px"
          :h="null"
          src="https://assets.returnonart.com/artworks/4-1608131122.jpg"
        ></roa-image>
      </div>
      <div class="flex flex-col items-center sm:flex-shrink-0 justify-center">
        <roa-icon name="arrow-right" bordered></roa-icon>
        <p class="h3 handwritten text-gray-solid">Like</p>
        <p class="small-caps">Swipe right to like</p>
      </div>
    </div>
    <roa-button :loading="loading" @click="$emit('start')" :disabled="!!$parent.error" class="w-full">
      Start
    </roa-button>
  </div>
</template>
<script>
export default {
  props: {
    loading: Boolean,
  },
};
</script>
<style scoped>
.card {
  /* animation: tick 3s infinite 5s; */
  transform-origin: bottom center;
}

@keyframes tick {
  0% {
    transform: rotate(0);
  }

  50% {
    transform: rotate(0);
  }

  57% {
    transform: rotate(2deg);
  }

  70% {
    transform: rotate(0deg);
  }
}

.intro {
  padding: 1.5em 0.5em;
  background: url("/images/border.svg"),
    linear-gradient(to bottom right, white, #f5f5f5) no-repeat center;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: space-between;
  border-right: solid 3px #0003;
  border-bottom: solid 3px #0003;
  box-shadow: 0 0 10px #0002;
}

h3 {
  text-align: center;
  text-transform: uppercase;
  margin: 0 1em;
  font-size: 1em;
}

.indicators {
  display: flex;
  flex-direction: column;
  margin-top: -1em;
}

.indicator {
  font-size: 5em;
  margin-block-start: 0;
  margin-block-end: 0;
}

.left {
  align-self: flex-start;
  margin: 0;
  margin-top: -2em;
}

.right {
  align-self: flex-end;
}
</style>
