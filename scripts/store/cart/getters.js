export default {
  cart: (state) => {
    return state.cart;
  },
  cartItems: (state) => {
    return state.cart.items || [];
  },
  total: (state) => {
    const subtotal = state.cart.items.reduce(
      (prev, curr) => prev + curr.product.price * curr.quantity,
      0
    );
    const shipping = state.cart?.total?.shipping || 0;
    const discount = state.cart?.total?.discount;
    return {
      sub: subtotal,
      grand: subtotal + shipping + discount,
      discount,
      items: state.cart.items.length,
      pieces: state.cart.items.reduce((prev, curr) => prev + curr.quantity, 0),
    };
  },
  regions: (state) => {
    return state.regions;
  },
  clientSecret: (state) => {
    return state.cart?.payment?.client_secret || null;
  },
  coupons: (state) => {
    return state.cart?.coupons || [];
  },
  currentCurrency: (state) => {
    if (state.cart?.currency?.rate)
      return {
        ...state.cart.currency,
        rate: parseFloat(state.cart.currency.rate),
      };
    else return state.cart.currency;
  },
  currencies: (state) => state.cart.currencies,
  cartIsOpen(state) {
    return state.cartIsOpen;
  },
  cartLoading(state) {
    return state.cartLoading;
  },
};
