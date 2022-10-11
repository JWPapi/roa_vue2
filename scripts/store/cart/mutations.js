export default {
  setCart(state, data) {
    state.cart = data;
  },
  setShippingMethod(state, data) {
    for (let method in state.cart.shipping.methods) {
      if (method === data) state.cart.shipping.methods[method].active = true;
      else state.cart.shipping.methods[method].active = undefined;
    }
  },
  setRegions(state, data) {
    state.regions = data;
  },
  removeFromCart(state, data) {
    state.cart.items = state.cart.items.filter((item) => item !== data);
  },
  setCurrency(state, currency) {
    state.cart.currency = state.cart.currencies.find(
      (curr) => curr.code === currency
    );
  },
  addToCart(state, product) {
    const itemInCart = state.cart.items.find(
      (val) => val.product.id == product.id
    );
    if (itemInCart) {
      itemInCart.quantity = itemInCart.quantity + 1;
    } else {
      state.cart.items.push({ quantity: 1, product });
    }
  },
  toggleCart(state) {
    state.cartIsOpen = !state.cartIsOpen;
  },
  setCartLoading(state, value) {
    state.cartLoading = value;
  },
};
