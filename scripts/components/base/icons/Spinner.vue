<template>
  <svg width="1em" height="1em" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <mask id="a" fill="#fff">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0 7.5A7.5 7.5 0 107.5 0"
        />
      </mask>
      <path
        d="M-1.5 7.5a9 9 0 009 9v-3a6 6 0 01-6-6h-3zm9 9a9 9 0 009-9h-3a6 6 0 01-6 6v3zm9-9a9 9 0 00-9-9v3a6 6 0 016 6h3z"
        fill="currentColor"
        mask="url(#a)"
      />
    </g>
  </svg>
</template>
<style scoped>
svg g {
  animation: spin 1s linear infinite;
  transform-origin: center center;
}
@keyframes spin {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>