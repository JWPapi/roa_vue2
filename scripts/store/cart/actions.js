import Vue from "vue";
import axios from "axios";

export default {
  async addCoupon({ commit }, payload) {
    try {
      const response = await axios.post("/store/cart/coupon", payload);
      const data = response.data;
      commit("setCart", data);
    } catch (e) {
      return e.response.data;
    }
  },
  async removeCoupon({ commit }) {
    try {
      const response = await axios.delete("/store/cart/coupon", {
        data: { index: 0 },
      });
      const data = response.data;
      commit("setCart", data);
    } catch (e) {
      return e.response.data;
    }
  },
  async getCart({ commit }) {
    const response = await fetch("/store/cart/get");
    const data = await response.json();
    commit("setCart", data);
  },
  async updateCart({ commit }, item_id, quantity) {
    const response = await axios.post("/store/cart/update", {
      item_id,
      quantity,
    });
    const data = response.data;
    return commit("setCart", data);
  },
  async setShippingCountry({ commit }, country_code) {
    const response = await axios.post("/store/cart/set-shipping", {
      shipping_country: country_code,
    });
    const data = response.data;
    commit("setCart", data.cart);
    commit("setRegions", data.regions);
  },
  async setShippingMethod({ commit, state }, data) {
    const oldKey = Object.keys(state.cart.shipping.methods).find(
      (key) => state.cart.shipping.methods[key].active
    );
    const key = data.substring(data.indexOf("|") + 1);
    commit("setShippingMethod", key);
    try {
      const response = await axios.post("/store/cart/set-shipping-method", {
        shipping: data,
      });
      const cart = response.data;
      commit("setCart", cart);
    } catch (e) {
      commit("setShippingMethod", oldKey);
      if (e.response?.data.message) Vue.roast.error(e.response.data.message);
      else Vue.roast.cookie();
    }
  },
  async removeFromCart({ commit }, item) {
    try {
      const response = await axios.post("/store/cart/update", {
        item_id: item.item_id,
        quantity: 0,
      });
      const data = await response.data;
      commit("setCart", data);
      Vue.roast.success(`"${item.product.title}" was removed from your cart.`);
      Vue.analytics.dispatchEcommerceEvent("remove_from_cart", item.product);
    } catch (e) {
      if (e.response?.data.message) Vue.roast.error(e.response.data.message);
      else Vue.roast.cookie();
    }
  },
  async addToCart({ commit }, item) {
    try {
      const response = await axios.post("/store/cart/add", {
        product: item.id,
        quantity: 1,
        variant: undefined,
      });
      const data = await response.data;
      commit("setCart", data);
      commit("toggleCart");
      Vue.analytics.dispatchEcommerceEvent("add_to_cart", item);
      setTimeout(() => commit("toggleCart"), 3000);
    } catch (e) {
      console.error(e);
      if (e.response?.data.message) Vue.roast.error(e.response.data.message);
      else Vue.roast.cookie();
      throw new Error(e.response?.data.message);
    }
  },
  async setCurrency({ commit, getters }, currency) {
    const { code: oldCurrency } = getters["currentCurrency"];
    try {
      commit("setCurrency", currency);
      await axios.post("/store/currency", { currency });
    } catch (e) {
      commit("setCurrency", oldCurrency);
      Vue.roast.cookie();
    }
  },
};
