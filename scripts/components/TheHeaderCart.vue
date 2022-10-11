<template>
  <portal to="modal">
    <transition name="slide-left" appear>
      <focus-trap initial-focus="#closeMenuButton">
        <section
          class="
            fixed
            inset-y-0
            right-0
            w-full
            h-window
            overflow-y-auto
            z-50
            flex flex-col
            sm:w-1/2
            xl:w-1/3
            bg-white
            px-8
            pb-8
            shadow
          "
          v-cloak
          v-scroll-lock
        >
          <portal to="modal">
            <div>
              <transition name="fade" appear>
                <div
                  class="
                    fixed
                    inset-0
                    w-full
                    h-full
                    z-40
                    bg-opacity-50 bg-black
                  "
                  @click.self="$emit('close')"
                />
              </transition>
            </div>
          </portal>
          <div class="mb-2 flex h-16 sm:h-20 justify-between items-center">
            <h2 class="h4-uppercase text-gray-darkest">Your cart</h2>
            <roa-icon-button solid icon="cross" @click="$emit('close')">
              Close Cart
            </roa-icon-button>
          </div>
          <ul v-if="cartItems.length" class="sm:mt-16 mb-4 sm:mb-8 flex-1">
            <header-cart-item
              v-for="item in cartItems"
              :key="item.item_id"
              :item="item"
            />
          </ul>
          <p v-else class="flex-1 mt-4 h4 text-gray">Your cart is empty.</p>
          <div
            v-if="cartItems.length"
            class="paragraph uppercase flex justify-between text-lg"
          >
            <p>Total:</p>
            <p class="font-medium">{{ total.sub | money(currentCurrency) }}</p>
          </div>
          <roa-link-button
            v-if="cartItems.length"
            href="/store/checkout"
            rel="nofollow"
            class="w-full mt-4 sm:mt-8"
          >
            Checkout
          </roa-link-button>
          <roa-link-button secondary href="/artworks" class="w-full mt-4">
            Browse more artworks
          </roa-link-button>
        </section>
      </focus-trap>
    </transition>
  </portal>
</template>

<script>
import { mapGetters } from "vuex";
import { FocusTrap } from "focus-trap-vue";
export default {
  components: { FocusTrap },
  computed: {
    ...mapGetters(["cart", "currentCurrency", "total", "cartLoading"]),
    cartItems() {
      return this.cart.items || [];
    },
  },
};
</script>