<template>
  <div v-if="!orders.length" class="my-32 flex items-center flex-col">
    <p class="text-center paragraph text-gray-darkest mb-8">
      You don't have any orders yet
    </p>
    <roa-link-button href="/artworks" secondary>
      Browse artworks
    </roa-link-button>
  </div>
  <div v-else-if="currentOrder" class="my-8">
    <roa-icon-button
      icon="arrow-left"
      @click="currentOrder = null"
      solid
      class="mb-8 lg:mb-0"
    >
      Show overview
    </roa-icon-button>
    <div class="w-full max-w-4xl mx-auto">
      <div class="sm:flex items-center justify-between">
        <h2 class="h4-uppercase mb-4 sm:mb-0">Order #{{ currentOrder.id }}</h2>
        <roa-link-button
          v-if="currentOrder.receipt_url"
          :href="currentOrder.receipt_url"
          secondary
          target="_blank"
          icon="arrow-right"
        >
          Show receipt
        </roa-link-button>
      </div>
      <ul class="divide-y divide-gray">
        <header-cart-item
          v-for="(item, idx) in currentOrder.items"
          :key="idx"
          :item="item"
          :editable="false"
        ></header-cart-item>
      </ul>
      <div class="text-right text-gray-darkest border-t border-gray pt-4">
        <p v-if="currentOrder.total.discount" class="paragraph ml-auto">
          Subtotal: {{ currentOrder.total.sub | money(currentCurrency) }}
        </p>
        <p v-if="currentOrder.total.discount" class="paragraph ml-auto">
          Discount: {{ currentOrder.total.discount | money(currentCurrency) }}
        </p>
        <p class="paragraph ml-auto">
          Total: {{ currentOrder.total.grand | money(currentCurrency) }}
        </p>
      </div>
      <div class="md:flex text-gray-darkest border-t border-gray pt-4 mt-4">
        <div class="md:w-1/3">
          <h3 class="small-caps mb-2">Payment method</h3>
          <p>{{ currentOrder.payment_method }}</p>
        </div>
        <div class="md:w-1/3 mt-8 md:mt-0">
          <h3 class="small-caps mb-2">Shipping address</h3>
          <address v-if="currentOrder.shipping" class="not-italic">
            {{ currentOrder.shipping.name }}<br />
            {{ currentOrder.shipping.address }}<br />
            <span v-if="currentOrder.shipping.address_2"
              >{{ currentOrder.shipping.address_2 }}<br
            /></span>
            {{ currentOrder.shipping.postal }} {{ currentOrder.shipping.city
            }}<br />
            {{ currentOrder.shipping.region }}<br />
            {{ currentOrder.shipping.country }}<br />
          </address>
        </div>
        <div class="md:w-1/3 mt-8 md:mt-0" v-if="currentOrder.billing">
          <h3 class="small-caps mb-2">Billing address</h3>
          <address class="not-italic">
            {{ currentOrder.billing.name }}<br />
            {{ currentOrder.billing.address }}<br />
            <span v-if="currentOrder.billing.address_2">
              {{ currentOrder.billing.address_2 }}<br />
            </span>
            {{ currentOrder.billing.postal }} {{ currentOrder.billing.city
            }}<br />
            <span v-if="currentOrder.billing.region">
              {{ currentOrder.billing.region }}<br />
            </span>
            {{ currentOrder.billing.country }}<br />
          </address>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-gray-darkest">
    <p class="mt-8">Past orders: {{ orders.length }}</p>
    <div class="w-full overflow-x-auto">
      <table class="my-8 whitespace-no-wrap">
        <thead>
          <tr class="small-caps">
            <th class="pr-4 md:pr-8 font-normal text-left">Order Number</th>
            <th class="px-4 md:px-8 font-normal text-left">Purchase Date</th>
            <th class="px-4 md:px-8 font-normal text-left">Price</th>
            <th class="px-4 md:px-8 font-normal text-left">Items</th>
            <th class="px-4 md:px-8 font-normal text-center">Status</th>
            <th class="pl-4 md:pl-8 font-normal text-left"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray">
          <tr
            v-for="(order, idx) in orders"
            :key="idx"
            class="mb-4 align-middle h-12"
          >
            <td class="pr-4 md:pr-8">
              <button
                @click="currentOrder = order"
                class="
                  focus:border-current
                  hover:border-current
                  border-b border-transparent
                  transition-colors
                  duration-300
                  focus:outline-none
                "
              >
                #{{ order.id }}
              </button>
            </td>
            <td class="px-4 md:px-8 text-gray-solid">
              {{ format(order.created_at.toDate(), "dd MMM yyyy") }}
            </td>
            <td class="px-4 md:px-8">
              {{ order.total.grand | money(currentCurrency) }}
            </td>
            <td class="px-4 md:px-8">{{ order.items.length }}</td>
            <td class="px-4 md:px-8 text-center">
              <status-badge :status="order.status" />
            </td>
            <td class="pl-4 md:pl-8">
              <div class="flex">
                <roa-icon-link
                  v-if="order.receipt_url"
                  :href="order.receipt_url"
                  muted
                  target="_blank"
                  icon="download"
                >
                  Show receipt
                </roa-icon-link>
                <roa-icon-button icon="eye" muted @click="currentOrder = order">
                  Show details
                </roa-icon-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { format } from "date-fns";
import { db } from "../db";
import { mapGetters } from "vuex";
import RoaIconButton from "./base/RoaIconButton.vue";
import HeaderCartItem from "./HeaderCartItem.vue";
import StatusBadge from "./StatusBadge.vue";
export default {
  components: { RoaIconButton, HeaderCartItem, StatusBadge },
  data() {
    return {
      format,
      currentOrder: null,
      orders: [],
    };
  },
  firestore() {
    return {
      orders: db
        .collection("orders")
        .where("user", "==", this.$auth.currentUser.uid),
    };
  },
  computed: {
    ...mapGetters(["currentCurrency"]),
  },
};
</script>