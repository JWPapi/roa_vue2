<template>
  <div class="relative">
    <roa-image
      :w="null"
      :h="null"
      class="w-full"
      :src="room.background"
    ></roa-image>
    <div
      class="absolute inset-0 w-full h-full flex justify-center items-center"
      :style="{ padding: room.padding }"
    >
      <roa-image
        :src="artwork.image"
        :w="width"
        :h="null"
        :style="{
          width: `${width}%`,
          filter: room.filter,
        }"
        class="rounded-sm"
      ></roa-image>
    </div>
    <div
      class="absolute inset-0 w-full h-full flex justify-center items-end"
      :style="{ padding: room.padding }"
    >
      <div class="w-full">
        <p class="w-full text-center small-caps md:paragraph mx-auto">
          {{ room.width }} cm
        </p>
        <div
          class="
            w-full
            border-b border-dashed border-gray-darkest
            transform
            translate-y-1
            md:translate-y-2
          "
        ></div>
        <div
          class="w-full border-l border-r h-2 md:h-4 border-gray-darkest"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    artwork: { type: Object, required: true },
  },
  computed: {
    width() {
      return (this.artwork.width / this.room.width) * 100; // percent
    },
    room() {
      if (this.artwork.width > 90 || this.artwork.height > 120) {
        return {
          background:
            "https://returnonart.imgix.net/room_view_backgrounds/shutterstock_1283500861.jpg",
          padding: "10% 25% 13%",
          width: 300,
          filter:
            "drop-shadow(0 8px 7px rgb(0 0 0 / 25%)) drop-shadow(0 2px 1px rgb(0 0 0 / 10%))",
        };
      }
      if (this.artwork.width < 40 && this.artwork.height < 40) {
        return {
          background:
            "https://returnonart.imgix.net/room_view_backgrounds/shutterstock_1506371039_crop-1625044635.jpg",
          padding: "1% 23% 14.5%",
          width: 50,
          filter:
            "drop-shadow(2px 5px 5px rgb(0 0 0 / 15%)) drop-shadow(3px 2px 2px rgb(0 0 0 / 20%))",
        };
      }
      return {
        background:
          "https://returnonart.imgix.net/room_view_backgrounds/1785341555-huge.jpg",
        padding: "0 24% 24.3%",
        width: 180,
        filter:
          "drop-shadow(-8px 5px 6px rgb(0 0 0 / 8%)) drop-shadow(-1px 2px 1px rgb(0 0 0 / 12%))",
      };
    },
  },
};
</script>