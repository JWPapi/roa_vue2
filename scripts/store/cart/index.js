import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";
const state = {
  cart: {
    items: [],
    currency: null,
    currencies: [
      {
        code: "EUR",
        symbol: "€",
        rate: 1,
      },
    ],
  },
  cartIsOpen: false,
  cartLoading: true,
};

export default { actions, mutations, getters, state };
