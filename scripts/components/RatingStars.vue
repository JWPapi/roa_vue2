<template>
  <div class="flex -ml-1 mt-8">
    <svg
      v-for="val in max"
      :key="val"
      class="ml-1"
      width="1em"
      height="1em"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask :id="`rating_star_${val}`">
        <rect x="0" y="0" width="15" height="15" fill="hsl(0deg 0% 40%)"></rect>
        <rect
          x="0"
          y="0"
          height="15"
          :width="val <= value ? 15 : val > value + 1 ? 0 : (value % 1) * 15"
          fill="white"
        ></rect>
      </mask>
      <path
        :mask="`url(#rating_star_${val})`"
        class="text-gray-solid"
        d="M7.20263 11.4775L11.5883 14.1246L10.4243 9.13608L14.2989 5.77958L9.19676 5.34685L7.20263 0.64209L5.2085 5.34685L0.106323 5.77958L3.98095 9.13608L2.81695 14.1246L7.20263 11.4775Z"
        fill="currentColor"
      />
    </svg>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Number,
      required: true,
    },
    max: {
      type: Nmber,
      default: 5,
    },
  },
};
</script>