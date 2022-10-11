const state = {
  toasts: [],
};
const actions = {};
const mutations = {
  addToast(state, payload) {
    state.toasts.unshift({ ...payload, id: Date.now() });
  },
  removeToast(state, id) {
    state.toasts = state.toasts.filter((toast) => toast.id !== id);
  },
};
const getters = {
  toasts(state) {
    return state.toasts;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
