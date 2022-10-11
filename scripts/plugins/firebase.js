import Vue from "vue";
import { firestorePlugin } from "vuefire";

const serialize = (snapshot) => {
  // snapshot.data() DOES NOT contain the `id` of the document. By
  // default, Vuefire adds it as a non enumerable property named id.
  // This allows to easily create copies when updating documents, as using
  // the spread operator won't copy it
  return { ...snapshot.data(), id: snapshot.id };
};

Vue.use(firestorePlugin, { serialize });
