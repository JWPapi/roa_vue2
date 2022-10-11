<template>
  <svg
    width="1em"
    height="1em"
    viewBox="0 -2.5 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1 6.5L6.5 12L17 1" stroke="currentColor" stroke-width="1.5" />
  </svg>
</template>

<style lang="scss" scoped>
path {
  stroke-dashoffset: 25px;
  stroke-dasharray: 25px;
  animation: path 500ms cubic-bezier(0.85, 0, 0.15, 1) forwards;
}

@keyframes path {
  to {
    stroke-dashoffset: 0;
  }
}
</style>