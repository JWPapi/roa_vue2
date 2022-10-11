import Vue from "vue";
import RoaToastContainer from "./RoaToastContainer";
import toastStore from "./store";
import store from "../../store";
Vue.component("roa-toast-container", RoaToastContainer);
class ToastGenerator {
  constructor(store) {
    this.store = store;
  }
  show(options) {
    if (typeof options === "string")
      this.store.commit("addToast", { text: options, type: "INFO" });
    else this.store.commit("addToast", options);
  }
  error(text) {
    this.show({ text, type: "ERROR" });
  }
  attention(text) {
    this.show({ text, type: "ATTENTION" });
  }
  success(text) {
    this.show({ text, type: "SUCCESS" });
  }
  info(text) {
    this.show({ text, type: "INFO" });
  }
  cookie() {
    let text;
    if (document.cookie.toLowerCase().includes("xsrf"))
      text = "We're sorry. Something went wrong...";
    else
      text =
        "It seems like you've blocked our cookies. Please activate cookies and try again.";
    this.show({ text, type: "ERROR" });
  }
}

const ToastPlugin = {
  install(Vue, options) {
    options.store.registerModule("toast", toastStore);
    const toastGenerator = new ToastGenerator(options.store);
    Vue.prototype.$roast = toastGenerator;
    Vue.roast = toastGenerator;
  },
};
Vue.use(ToastPlugin, { store });
