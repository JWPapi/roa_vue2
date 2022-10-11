import Vue from "vue";

const AnalyticsPlugin = {
  install(Vue) {
    const plugin = {
      dispatchEcommerceEvent(eventName, items, value) {
        items = [].concat(items);
        this.dispatchEvent(eventName, {
          ecommerce: {
            items: items.map((item) => ({
              item_id: item.id,
              item_name: item.title,
              item_brand: item.artist.title || item.artist,
              price: item.price,
            })),
            value: value || items.reduce((total, item) => total + item.price, 0),
          },
        })
      },
      dispatchEvent(event, payload = {}) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(Object.assign(payload, { event }));
      },
    };

    Vue.prototype.$analytics = plugin;
    Vue.analytics = plugin;
  },
};
Vue.use(AnalyticsPlugin);
