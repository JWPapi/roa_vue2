<template>
  <div class="flex items-center justify-between">
    <div class="flex-grow">
      <p class="paragraph-sm uppercase text-gray-darkest" v-if="intro">
        {{ intro }}
      </p>
      <h2 class="h3-uppercase">
        <a v-if="href" :href="href">
          <span class="text-gray-solid" v-if="muted">{{ muted }}</span>
          <span class="handwritten text-gray-darkest">{{ main }}</span>
        </a>
        <span v-if="!href && muted" class="text-gray-solid">
          {{ muted }}
        </span>
        <span v-if="!href" class="handwritten text-gray-darkest">
          {{ main }}
        </span>
      </h2>
    </div>
    <roa-link-button
      v-if="cta && href"
      :href="href"
      class="flex-shrink-0 hidden sm:inline-flex"
      >{{ cta }}</roa-link-button
    >
  </div>
</template>

<script>
export default {
  props: {
    intro: { type: String },
    muted: { type: String },
    main: { type: String },
    href: { type: String },
    cta: { type: String },
  },
};
</script>