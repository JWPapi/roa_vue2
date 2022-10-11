<template>
  <div :class="transparent && 'header-transparent'">
    <header
      ref="header"
      :class="{
        scrolled: scrollPosition > 100,
        'not-scrolled': scrollPosition <= 100,
        'transform -translate-y-full': !showHeader && !showMenu && !focusWithin,
      }"
      @focusin="focusWithin = true"
      @focusout="focusWithin = false"
      class="
        transition-transform
        duration-200
        ease-in-out
        fixed
        border-b-sm border-current
        w-full
        z-40
      "
    >
      <transition name="slide-down" @after-leave="updateHeaderHeight">
        <div
          class="p-3 text-white text-center flex items-center"
          id="header_notice"
          v-if="notice && showNotice"
          :style="{ backgroundColor: notice.color }"
        >
          <p class="flex-grow ml-4">
            <a
              :href="notice.target"
              class="
                paragraph
                hover:border-b
                focus:border-b focus:outline-none
                border-current
              "
              v-if="notice.target"
            >
              {{ notice.text }}
            </a>
            <span class="paragraph" v-else>
              {{ notice.text }}
            </span>
          </p>
          <roa-icon-button
            @click="hideNotice"
            small
            class="flex-shrink-0"
            icon="cross"
            >Close Notice</roa-icon-button
          >
        </div>
      </transition>
      <div
        class="
          w-full
          flex
          items-center
          justify-between
          px-4
          sm:px-8
          xl:px-16
          h-16
          sm:h-20
        "
      >
        <roa-icon-button
          @click="showMenu = true"
          icon="burger"
          class="md:hidden"
        >
          Open Menu
        </roa-icon-button>
        <a
          href="/"
          class="
            main-logo
            flex
            items-center
            flex-no-shrink
            mr-2
            focus:outline-none focus:text-gray-dark
          "
        >
          <roa-logo type="icon" class='transition-colors duration-200'/>
          <roa-logo
            type="text"
            class="ml-6 hidden sm:block md:hidden lg:block transition-colors duration-200"
          />
          <h1 class="sr-only">Return on Art</h1>
        </a>

        <div class="flex h-full">
          <transition name="fade">
            <focus-trap
              initial-focus="#closeMenuButton"
              :active="showMenu && windowWidth < breakpoints.md"
            >
              <nav
                v-show="showMenu || windowWidth >= breakpoints.md"
                class="
                  md:bg-transparent md:h-full
                  text-gray-darkest
                  md:text-current md:visible md:relative md:w-auto
                  bg-white
                  overflow-y-auto
                  fixed
                  z-10
                  md:z-auto
                  inset-0
                  w-full
                  h-window
                  flex-grow flex flex-col
                "
                v-scroll-lock="showMenu && windowWidth < breakpoints.md"
              >
                <div
                  class="
                    md:hidden
                    flex flex-shrink-0
                    justify-between
                    h-16
                    sm:h-20
                    items-center
                    px-4
                    sm:px-8
                  "
                >
                  <roa-icon-button
                    solid
                    icon="cross"
                    id="closeMenuButton"
                    @click="showMenu = false"
                  >
                    Close
                  </roa-icon-button>
                  <roa-icon-button
                    @click="showSearch = true"
                    icon="search"
                    class="flex-shrink-0"
                  >
                    Search
                  </roa-icon-button>
                </div>
                <slot
                  v-bind="{
                    showMenu,
                    width: windowWidth,
                    breakpoint: breakpoints.md,
                  }"
                ></slot>
                <div class="md:hidden flex justify-between p-4">
                  <roa-link-button v-if="$auth.loggedIn" plain href="/profile">
                    Profile
                  </roa-link-button>
                  <roa-button v-else plain @click="$auth.showLogin()">
                    Login
                  </roa-button>
                  <roa-button plain icon="bag" @click="toggleCart">
                    Cart ({{ cartItems.length }})
                  </roa-button>
                </div>
              </nav>
            </focus-trap>
          </transition>
          <div class="flex items-center text-teal-lighter md:ml-2">
            <roa-icon-button
              @click="showSearch = true"
              icon="search"
              class="hidden md:inline-block"
            >
              Search
            </roa-icon-button>
            <roa-icon-link
              v-if="$auth.loggedIn"
              class="hidden md:inline-block"
              href="/profile"
              icon="user"
            >
              Profile
            </roa-icon-link>
            <roa-icon-button
              v-else
              class="hidden md:inline-block"
              icon="user"
              @click="$auth.showLogin('/profile')"
            >
              Login or Register
            </roa-icon-button>
            <roa-badge :show="!!cartItems.length" :number="cartItems.length">
              <roa-icon-button icon="bag" @click="toggleCart">
                Open Cart
              </roa-icon-button>
            </roa-badge>
          </div>
        </div>
      </div>
    </header>
    <the-header-cart @close="toggleCart" v-if="cartIsOpen" />
    <the-search-overlay v-if="showSearch" @close="showSearch = false" />
  </div>
</template>

<script>
import { FocusTrap } from "focus-trap-vue";
import { mapGetters, mapMutations } from "vuex";
import WindowWidth from "../mixins/WindowWidth";
import RoaIconButton from "./base/RoaIconButton";
import RoaLogo from "./base/RoaLogo";
import RoaIconLink from "./base/RoaIconLink";
import TheSearchOverlay from "./TheSearchOverlay";

export default {
  mixins: [WindowWidth],
  components: {
    FocusTrap,
    RoaIconButton,
    RoaIconLink,
    RoaLogo,
    TheSearchOverlay,
  },
  props: {
    transparent: { type: Boolean, default: false },
    notice: { type: Object },
  },
  data() {
    const pageNoticeDismissed = localStorage.getItem("page_notice_dismissed");
    if (!this.notice || pageNoticeDismissed !== this.notice.text)
      localStorage.removeItem("page_notice_dismissed");
    return {
      scrollPosition: window.pageYOffset || document.documentElement.scrollTop,
      showMenu: false,
      showHeader: true,
      focusWithin: false,
      showNotice:
        this.notice &&
        (!pageNoticeDismissed || pageNoticeDismissed !== this.notice.text),
      showSearch: false,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll);
    window.addEventListener("resize", this.updateHeaderHeight);
    this.updateHeaderHeight();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.updateHeaderHeight);
  },
  computed: {
    ...mapGetters(["cart", "cartIsOpen"]),
    cartItems() {
      return this.cart?.items || [];
    },
  },
  methods: {
    updateHeaderHeight() {
      const header = this.$el;
      const isTransparent = header?.classList.contains("header-transparent");
      if (!isTransparent) {
        const headerElement = header.querySelector("header");
        document.querySelector(
          "main"
        ).style.paddingTop = `${headerElement.offsetHeight}px`;
      } else {
        const notice = header.querySelector("#header_notice");
        document.querySelector("main").style.paddingTop = notice
          ? `${notice.offsetHeight}px`
          : 0;
      }
    },
    hideNotice() {
      this.showNotice = false;
      localStorage.setItem("page_notice_dismissed", this.notice.text);
    },
    onScroll() {
      const currentScrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;
      if (
        currentScrollPosition > (this.$refs.header?.offsetHeight || 0) &&
        currentScrollPosition > this.scrollPosition
      ) {
        this.showHeader = false;
      } else {
        this.showHeader = true;
      }
      this.scrollPosition = currentScrollPosition;
    },
    ...mapMutations(["toggleCart"]),
  },
};
</script>
<style lang="scss">
.header-transparent {
  header {
    @apply z-50;

    &.scrolled {
      @apply bg-white;
      @apply text-black;
    }

    &.not-scrolled {
      @apply bg-transparent;
      @apply text-white;

      .main-logo:focus {
        @apply text-gray-light;
      }
    }
  }
}

header {
  @apply bg-white;
  @apply text-black;
}
</style>