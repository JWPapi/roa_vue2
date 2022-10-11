import Vue from "vue";
import * as components from "./components";
import * as baseComponents from "./components/base";
import * as pageComponents from "./pages";

// register components, design system and page components globally
for (let module of [components, baseComponents, pageComponents]) {
  for (let [name, component] of Object.entries(module)) {
    Vue.component(name, component);
  }
}
