<template>
  <div>
    <ul
      role="tablist"
      class="flex border-b-sm border-gray-darkest overflow-x-auto max-w-full"
    >
      <li role="presentation" v-for="(panel, idx) in panels" :key="panel">
        <a
          role="tab"
          :href="`#${panelSelector(panel)}`"
          :id="`tab_${slug(panel)}`"
          @click="openPanel = slug(panel)"
          :aria-selected="isCurrent(panel)"
          class="
            paragraph
            transition-colors
            duration-300
            hover:text-gray-darkest
            mt-1
            whitespace-no-wrap
            p-4
            block
            border-gray-darkest
            text-center
            focus:outline-none
          "
          :class="{
            'text-gray': !isCurrent(panel),
            'border-b-2 focus:border-b-4': isCurrent(panel),
          }"
          :tabindex="isCurrent(panel) ? 0 : -1"
          @keydown.left="openPanelByIndex(idx - 1)"
          @keydown.right="openPanelByIndex(idx + 1)"
          @keydown.down="focusCurrentPanel"
        >
          <slot :name="`tab-${slug(panel)}`">
            {{ panel }}
          </slot>
        </a>
      </li>
    </ul>
    <transition name="fade" mode="out-in">
      <section
        tabindex="-1"
        class="focus:outline-none"
        :aria-labelledby="`tab_${slug(currentPanel)}`"
        :key="currentPanel"
        :id="panelSelector(currentPanel)"
        role="tabpanel"
      >
        <slot :name="currentPanel"></slot>
      </section>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    panels: {
      type: Array,
      required: true,
      validator: (value) => !!value.length,
    },
    prefix: {
      type: String,
      default: "tabpanel",
    },
    defaultIndex: { type: Number, default: 0 },
  },
  data() {
    const hash = window.location.hash;
    let openPanel = this.slug(this.panels[this.defaultIndex]);
    if (hash && hash.includes(this.prefix)) {
      const hashValue = hash.replace(/^#/, "").split("_").pop();
      if (this.panels.map(this.slug).includes(hashValue)) {
        openPanel = hashValue;
      }
    }
    return {
      openPanel,
    };
  },
  methods: {
    openPanelByIndex(index) {
      if (index < 0 || index >= this.panels.length) return;
      this.openPanel = this.slug(this.panels[index]);
      const tabLabel = this.$el.querySelector(`#tab_${this.openPanel}`);
      tabLabel.focus();
      window.location.hash = tabLabel.getAttribute("href");
    },
    focusCurrentPanel() {
      const openPanel = this.$el.querySelector(`#${this.panelSelector()}`);
      openPanel.focus();
    },
    isCurrent(panel) {
      return this.slug(panel) === this.openPanel;
    },
    panelSelector(panel) {
      let slug = panel ? this.slug(panel) : this.openPanel;
      return [this.prefix, slug].filter((e) => e).join("_");
    },
    slug(string) {
      return string.replace(/^(\w+)\s.*/, "$1").toLowerCase();
    },
  },
  computed: {
    currentPanel() {
      return this.panels.find((panel) => this.isCurrent(panel));
    },
  },
};
</script>
