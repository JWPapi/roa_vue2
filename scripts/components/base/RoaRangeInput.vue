<template>
  <input
    type="range"
    :value="value"
    @input="$emit('input', $event.target.value)"
    v-bind="{ ...$attrs }"
  />
</template>
<script>
export default {
  props: {
    value: Number | String,
  },
};
</script>
<style scoped lang="scss">
// Styling Cross-Browser Compatible Range Inputs with Sass
// Github: https://github.com/darlanrod/input-range-sass
// Author: Darlan Rod https://github.com/darlanrod
// Version 1.5.2
// MIT License

$track-color: theme("colors.gray.darkest") !default;
$thumb-color: theme("colors.gray.darkest") !default;

$thumb-radius: 0 !default;
$thumb-height: 24px !default;
$thumb-width: 6px !default;
$thumb-shadow-size: 0 !default;
$thumb-shadow-blur: 0 !default;
$thumb-shadow-color: rgba(0, 0, 0, 0.2) !default;
$thumb-border-width: 1px !default;
$thumb-border-color: white !default;

$track-width: auto !default;
$track-height: 8px !default;
$track-shadow-size: 0 !default;
$track-shadow-blur: 0 !default;
$track-shadow-color: transparent !default;
$track-border-width: 2px !default;
$track-border-color: white !default;

$track-radius: 0 !default;
$contrast: 5% !default;

$ie-bottom-track-color: theme("colors.black") !default;

@mixin shadow($shadow-size, $shadow-blur, $shadow-color) {
  box-shadow: 0 $shadow-size $shadow-blur $shadow-color;
}

@mixin track {
  cursor: default;
  height: $track-height;
  transition: all 0.2s ease;
  width: $track-width;
}

@mixin thumb {
  @include shadow($thumb-shadow-size, $thumb-shadow-blur, $thumb-shadow-color);
  background: $thumb-color;
  border: $thumb-border-width solid $thumb-border-color;
  border-radius: $thumb-radius;
  box-sizing: border-box;
  cursor: default;
  height: $thumb-height;
  width: $thumb-width;
}

[type="range"] {
  -webkit-appearance: none;
  background: transparent;
  margin: $thumb-height * 0.5 0;
  width: $track-width;

  &::-moz-focus-outer {
    border: 0;
  }

  &:focus {
    outline: 0;

    &::-webkit-slider-runnable-track {
      background: theme("colors.gray.dark");
    }

    &::-ms-fill-lower {
      background: $track-color;
    }

    &::-ms-fill-upper {
      background: theme("colors.gray.dark");
    }
  }

  &::-webkit-slider-runnable-track {
    @include track;
    @include shadow(
      $track-shadow-size,
      $track-shadow-blur,
      $track-shadow-color
    );
    background: $track-color;
    border: $track-border-width solid $track-border-color;
    border-radius: $track-radius;
  }

  &::-webkit-slider-thumb {
    @include thumb;
    -webkit-appearance: none;
    margin-top: (
      (-$track-border-width * 2 + $track-height) * 0.5 - $thumb-height * 0.5
    );
  }

  &::-moz-range-track {
    @include shadow(
      $track-shadow-size,
      $track-shadow-blur,
      $track-shadow-color
    );
    @include track;
    background: $track-color;
    border: $track-border-width solid $track-border-color;
    border-radius: $track-radius;
    height: $track-height * 0.5;
  }

  &::-moz-range-thumb {
    @include thumb;
  }

  &::-ms-track {
    @include track;
    background: transparent;
    border-color: transparent;
    border-width: ($thumb-height * 0.5) 0;
    color: transparent;
  }

  &::-ms-fill-lower {
    @include shadow(
      $track-shadow-size,
      $track-shadow-blur,
      $track-shadow-color
    );
    background: $ie-bottom-track-color;
    border: $track-border-width solid $track-border-color;
    border-radius: ($track-radius * 2);
  }

  &::-ms-fill-upper {
    @include shadow(
      $track-shadow-size,
      $track-shadow-blur,
      $track-shadow-color
    );
    background: $track-color;
    border: $track-border-width solid $track-border-color;
    border-radius: ($track-radius * 2);
  }

  &::-ms-thumb {
    @include thumb;
    margin-top: $track-height * 0.25;
  }

  &:disabled {
    &::-webkit-slider-thumb,
    &::-moz-range-thumb,
    &::-ms-thumb,
    &::-webkit-slider-runnable-track,
    &::-ms-fill-lower,
    &::-ms-fill-upper {
      cursor: not-allowed;
    }
  }
}
</style>