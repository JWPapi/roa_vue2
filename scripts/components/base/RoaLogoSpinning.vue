<template>
  <div aria-hidden="true" class="spinner" :style="`--zoom: ${zoom}`">
    <div class="frame">
      <div class="strip">
        <div class="a"></div>
        <div class="b">R</div>
        <div class="c">e</div>
        <div class="d">t</div>
        <div class="e">u</div>
        <div class="f">r</div>
        <div class="g">n</div>
        <div class="h"></div>
        <div class="i">o</div>
        <div class="j">n</div>
        <div class="k"></div>
        <div class="l">A</div>
        <div class="m">r</div>
        <div class="n">t</div>
        <div class="o"></div>
        <div class="p"></div>
        <div class="q">R</div>
        <div class="r">e</div>
        <div class="s">t</div>
        <div class="t">u</div>
        <div class="u">r</div>
        <div class="v">n</div>
        <div class="w"></div>
        <div class="x">o</div>
        <div class="y">n</div>
        <div class="z"></div>
        <div class="a1">A</div>
        <div class="b1">r</div>
        <div class="c1">t</div>
        <div class="d1"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    zoom: {
      default: 1,
      type: Number,
    },
  },
};
</script>

<style scoped>
.spinner {
  width: 23.5ch;
  height: 8em;
  zoom: var(--zoom);
  font-family: "Resist Sans Display", sans-serif;
}

.frame {
  width: 33px;
  transform-style: preserve-3d;

  --rotation: 20deg;

  transform: rotateX(calc(var(--rotation) * -1)) rotateY(var(--rotation))
    rotateZ(var(--rotation)) translate3d(12.5ch, 0.5ch, 0);
}

.strip {
  transform-style: preserve-3d;
  animation: spin 10s infinite linear;
}

.strip div {
  text-transform: uppercase;
  position: absolute;
  opacity: 1;
  font-size: 2.4em;
}

.strip .a {
  transform: rotateY(0deg) translateZ(124px);
}

.strip .b {
  transform: rotateY(12deg) translateZ(124px);
}

.strip .c {
  transform: rotateY(24deg) translateZ(124px);
}

.strip .d {
  transform: rotateY(36deg) translateZ(124px);
}

.strip .e {
  transform: rotateY(48deg) translateZ(124px);
}

.strip .f {
  transform: rotateY(60deg) translateZ(124px);
}

.strip .g {
  transform: rotateY(72deg) translateZ(124px);
}

.strip .h {
  transform: rotateY(84deg) translateZ(124px);
}

.strip .i {
  transform: rotateY(96deg) translateZ(124px);
}

.strip .j {
  transform: rotateY(108deg) translateZ(124px);
}

.strip .k {
  transform: rotateY(120deg) translateZ(124px);
}

.strip .l {
  transform: rotateY(132deg) translateZ(124px);
}

.strip .m {
  transform: rotateY(144deg) translateZ(124px);
}

.strip .n {
  transform: rotateY(156deg) translateZ(124px);
}

.strip .o {
  transform: rotateY(168deg) translateZ(124px);
}

.strip .p {
  transform: rotateY(180deg) translateZ(124px);
}

.strip .q {
  transform: rotateY(192deg) translateZ(124px);
}

.strip .r {
  transform: rotateY(204deg) translateZ(124px);
}

.strip .s {
  transform: rotateY(216deg) translateZ(124px);
}

.strip .t {
  transform: rotateY(228deg) translateZ(124px);
}

.strip .u {
  transform: rotateY(240deg) translateZ(124px);
}

.strip .v {
  transform: rotateY(252deg) translateZ(124px);
}

.strip .w {
  transform: rotateY(264deg) translateZ(124px);
}

.strip .x {
  transform: rotateY(276deg) translateZ(124px);
}

.strip .y {
  transform: rotateY(288deg) translateZ(124px);
}

.strip .z {
  transform: rotateY(300deg) translateZ(124px);
}

.strip .a1 {
  transform: rotateY(312deg) translateZ(124px);
}

.strip .b1 {
  transform: rotateY(324deg) translateZ(124px);
}

.strip .c1 {
  transform: rotateY(336deg) translateZ(124px);
}

.strip .d1 {
  transform: rotateY(348deg) translateZ(124px);
}

@keyframes spin {
  from {
    transform: rotateY(1turn);
  }

  to {
    transform: rotateY(0);
  }
}
</style>
