<template>
  <div class="filters-container">
    <h2>Filters</h2>
    <div class="filter">
      <p class="input-label">Altitude</p>
      <SmallInput
        id="velocityMin"
        label="Min"
        type="number"
        v-model="state.altitudeMin"
        @update-value="(value) => updateFilter('velocityMin', value)"
      />
      <SmallInput
        id="velocityMax"
        label="Max"
        type="number"
        v-model="state.altitudeMax"
        @update-value="(value) => updateFilter('velocityMax', value)"
      />
    </div>
    <div class="filter">
      <p class="input-label">Altitude</p>
      <SmallInput
        id="altitudeMin"
        label="Min"
        type="number"
        v-model="state.altitudeMin"
        @update-value="(value) => updateFilter('altitudeMin', value)"
      />
      <SmallInput
        id="altitudeMax"
        label="Max"
        type="number"
        v-model="state.altitudeMax"
        @update-value="(value) => updateFilter('altitudeMax', value)"
      />
    </div>
    <DefaultInput
      id="squawk"
      label="Squawk"
      v-model="state.squawk"
      @update-value="(value) => updateFilter('squawk', value)"
    />
    <MultiSelectInput
      id="currentCountry"
      label="Current country"
      :options="data.currentCountryOptions"
      @update-value="(value) => updateFilter('currentCountry', value)"
    />
    <MultiSelectInput
      id="originCountry"
      label="Country of origin"
      :options="data.originCountryOptions"
      @update-value="(value) => updateFilter('originCountry', value)"
    />
    <button @click="emitUpdateFilters">Apply</button>
  </div>
</template>

<script>
import DefaultInput from "./form/DefaultInput";
import SmallInput from "./form/SmallInput";
import MultiSelectInput from "./form/MultiSelectInput";
export default {
  name: "FlightsFilters",
  components: { DefaultInput, MultiSelectInput, SmallInput },
  props: {},
  emits: ["updateFilters"],
  data() {
    return {
      data: {
        currentCountryOptions: ["Ukraine", "Russia", "Poland"],
        originCountryOptions: ["Ukraine", "Russia", "Poland"],
      },
      state: {
        velocityMax: null,
        velocityMin: null,
        altitudeMax: null,
        altitudeMin: null,
        squawk: null,
        currentCountry: null,
        originCountry: null,
      },
    };
  },
  mounted() {},
  computed: {},
  methods: {
    updateFilter(filter, newValue) {
      this.state[filter] = newValue;
    },
    emitUpdateFilters() {
      const camelToSnakeCase = (str) =>
        str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      let query = {};
      Object.keys(this.state).forEach((key) => {
        if (this.state[key] !== null) {
          const param = camelToSnakeCase(key);
          query[param] = this.state[key];
        }
      });
      console.log(query);
      this.$emit("updateFilters", query);
    },
  },
};
</script>

<style scoped>
.filter {
  margin: 2rem 0;
}

.filters-container {
  height: 100%;
  padding: 1rem;
  box-sizing: border-box;
  background-color: #f8f8f8;
  box-shadow: 0px 0px 6px rgb(153, 153, 153);
  overflow-y: scroll;
}
</style>
