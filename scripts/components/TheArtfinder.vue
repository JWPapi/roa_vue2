<template>
  <portal to="modal">
    <transition name="slide-right" appear>
      <focus-trap>
        <div
          role="dialog"
          v-scroll-lock="true"
          class="
            fixed
            inset-y-0
            left-0
            w-full
            h-window
            z-50
            sm:w-1/2
            xl:w-1/3
            max-w-lg
            bg-white
            shadow
            flex flex-col
          "
        >
          <portal to="modal">
            <div>
              <transition name="fade" appear>
                <div
                  class="
                    fixed
                    inset-0
                    w-full
                    h-full
                    z-40
                    bg-opacity-50 bg-black
                  "
                  @click.self="$emit('close', value)"
                />
              </transition>
            </div>
          </portal>
          <div class="overflow-y-auto flex-1 p-4 sm:p-8">
            <div class="flex justify-between items-center mb-6">
              <h4 class="h4-uppercase flex-1">Artfinder</h4>
              <roa-icon-button
                @click="$emit('close', value)"
                solid
                icon="cross"
              >
                Close
              </roa-icon-button>
            </div>
            <roa-select
              label="Sort By"
              class="mb-4"
              :value="value.sort.value || ''"
              @input="
                value.sort = options.sort.find(
                  (sorting) => sorting.value === $event
                )
              "
              required
              novalidate
            >
              <option
                :value="sorting.value"
                v-for="sorting in options.sort"
                :key="sorting.value"
              >
                {{ sorting.label }}
              </option>
            </roa-select>
            <roa-multiselect
              required
              class="mb-4"
              label="Artists"
              searchable
              v-model="value.artists"
              :show-labels="false"
              mode="buttons"
              :options="artists"
              placeholder="Search artists"
            />
            <roa-multiselect
              required
              class="mb-4"
              track-by="value"
              label-value="title"
              label="Categories"
              v-model="value.categories"
              :options="options.category"
              mode="pills"
            />
            <roa-multiselect
              required
              class="mb-4"
              label="Size"
              label-value="value"
              v-model="value.sizes"
              :options="options.size"
              mode="buttons"
            />
            <roa-multiselect
              required
              class="mb-4"
              label="Price"
              label-value="value"
              v-model="value.prices"
              :options="options.price"
              mode="buttons"
            />
            <roa-multiselect
              required
              class="mb-4"
              :show-labels="false"
              label="Nationality of artist"
              v-model="value.nationalities"
              :options="options.nationality"
              mode="buttons"
              placeholder="Search country"
              searchable
            />
          </div>
          <div class="flex-shrink-0 p-4 sm:px-8 flex shadow">
            <roa-button
              @click="$emit('input', value)"
              icon="search"
              class="w-1/2 mr-4"
            >
              Search
            </roa-button>
            <transition name="fade">
              <roa-button
                v-if="changed"
                icon="reset"
                class="flex-1"
                secondary
                @click="$emit('reset')"
              >
                Reset
              </roa-button>
            </transition>
          </div>
        </div>
      </focus-trap>
    </transition>
  </portal>
</template>

<script>
import { db } from "../db";
import { FocusTrap } from "focus-trap-vue";
export default {
  components: { FocusTrap },
  props: {
    value: { type: Object, required: true },
  },
  data() {
    return { artists: [], options: window.roa.options };
  },
  created() {
    this.fetchArtists();
  },
  computed: {
    changed() {
      const { artists, prices, sizes, categories, nationalities } = this.value;
      if (artists?.length) return true;
      if (categories?.length) return true;
      if (prices?.length && prices.length !== this.options.price.length)
        return true;
      if (sizes?.length && sizes.length !== this.options.size.length)
        return true;
      if (sizes?.length && sizes.length !== this.options.size.length)
        return true;
      if (
        nationalities?.length &&
        nationalities.length !== this.options.nationality.length
      )
        return true;
      return false;
    },
  },
  methods: {
    async fetchArtists() {
      const collection = await db
        .collection("artists")
        .orderBy("title", "asc")
        .get();
      collection.forEach((doc) => this.artists.push(doc.get("title")));
    },
  },
};
</script>