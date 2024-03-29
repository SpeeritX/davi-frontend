<template>
  <div class="filters-container">
    <h2>DaVi - Flights in Ukraine</h2>
    <div class="filter">
      <p class="input-label">Velocity (km/h)</p>
      <SmallInput
        id="velocityMin"
        label="Min"
        type="number"
        :min="data.velocityMin"
        :max="data.velocityMax"
        :value="state.velocityMin"
        @update-value="(value) => updateFilter('velocityMin', value)"
      />
      <SmallInput
        id="velocityMax"
        label="Max"
        type="number"
        :min="data.velocityMin"
        :max="data.velocityMax"
        :value="state.velocityMax"
        @update-value="(value) => updateFilter('velocityMax', value)"
      />
    </div>
    <div class="filter">
      <p class="input-label">Barometric altitude (m)</p>
      <SmallInput
        id="altitudeMin"
        label="Min"
        type="number"
        :min="data.altitudeMin"
        :max="data.altitudeMax"
        :value="state.altitudeMin"
        @update-value="(value) => updateFilter('altitudeMin', value)"
      />
      <SmallInput
        id="altitudeMax"
        label="Max"
        type="number"
        :min="data.altitudeMin"
        :max="data.altitudeMax"
        :value="state.altitudeMax"
        @update-value="(value) => updateFilter('altitudeMax', value)"
      />
    </div>
    <SelectInput
      id="squawk"
      class="filter"
      label="Squawk"
      :options="data.squawkOptions"
      @update-value="(value) => updateFilter('squawk', value)"
    />
    <MultiSelectInput
      id="currentCountry"
      class="filter"
      label="Country"
      :options="data.currentCountryOptions"
      @update-value="(value) => updateFilter('currentCountry', value)"
    />
    <MultiSelectInput
      id="originCountry"
      class="filter"
      label="Country of origin"
      :options="data.originCountryOptions"
      @update-value="(value) => updateFilter('originCountry', value)"
    />
    <div class="filter">
      <p class="input-label">Additional options</p>
      <SliderInput
        id="pathsOpacity"
        :initValue="state.pathsOpacity"
        :label="`Flights paths opacity: ${state.pathsOpacity / 100}`"
        @update-value="(value) => updateFilter('pathsOpacity', value)"
      />
      <CheckboxInput
        id="choroplethMap"
        :initValue="state.choroplethMap"
        @update-value="(value) => updateFilter('choroplethMap', value)"
        label="Show the choropleth map"
      />
      <CheckboxInput
        id="showFlightPaths"
        :initValue="state.showFlightPaths"
        @update-value="(value) => updateFilter('showFlightPaths', value)"
        label="Show flights paths"
      />
      <CheckboxInput
        id="shortestPaths"
        @update-value="(value) => updateFilter('shortestPaths', value)"
        label="Show the shortest connections between the start and end points of flights"
      />
    </div>
    <button @click="emitUpdateFilters" class="apply-button">Apply</button>
  </div>
</template>

<script>
import SmallInput from "./form/SmallInput";
import MultiSelectInput from "./form/MultiSelectInput";
import SelectInput from "./form/SelectInput";
import CheckboxInput from "./form/CheckboxInput";
import SliderInput from "./form/SliderInput";
import { originCountries, currentCountries } from "../tools/countryList";

export default {
  name: "FlightsFilters",
  components: {
    MultiSelectInput,
    SelectInput,
    SmallInput,
    CheckboxInput,
    SliderInput,
  },
  props: {},
  emits: [
    "updateFilters",
    "updateShortestPaths",
    "updateShowFlightPaths",
    "updateChoroplethMap",
    "updatePathsOpacity",
  ],
  data() {
    return {
      data: {
        velocityMin: 0,
        velocityMax: 2062,
        altitudeMin: -42,
        altitudeMax: 11770,
        currentCountryOptions: currentCountries,
        originCountryOptions: originCountries,
        squawkOptions: ["other", "7500", "7700"],
      },
      state: {
        velocityMin: 0,
        velocityMax: 3819,
        altitudeMin: -42,
        altitudeMax: 11770,
        squawk: null,
        currentCountry: null,
        originCountry: null,
        shortestPaths: false,
        showFlightPaths: true,
        choroplethMap: true,
        pathsOpacity: 20,
      },
      filtersModified: false,
    };
  },
  methods: {
    updateFilter(filter, newValue) {
      if (
        ![
          "shortestPaths",
          "showFlightPaths",
          "choroplethMap",
          "pathsOpacity",
        ].includes(filter)
      ) {
        this.filtersModified = true;
      }
      this.state[filter] = newValue;
    },
    emitUpdateFilters() {
      const camelToSnakeCase = (str) =>
        str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      let query = {};
      Object.keys(this.state).forEach((key) => {
        if (
          ![
            "shortestPaths",
            "showFlightPaths",
            "choroplethMap",
            "pathsOpacity",
          ].includes(key)
        ) {
          const param = camelToSnakeCase(key);
          query[param] = this.state[key];
        }
      });
      this.$emit("updateShortestPaths", this.state.shortestPaths);
      this.$emit("updateChoroplethMap", this.state.choroplethMap);
      this.$emit("updateShowFlightPaths", this.state.showFlightPaths);
      this.$emit("updatePathsOpacity", this.state.pathsOpacity);
      if (this.filtersModified) {
        this.$emit("updateFilters", query);
      }
      this.filtersModified = false;
    },
  },
};
</script>

<style scoped>
.filter {
  margin: 1rem 0;
  text-align: left;
}

.filters-container {
  height: 100%;
  padding: 0.8rem;
  box-sizing: border-box;
  background-color: #f8f8f8;
  box-shadow: 0px 0px 6px rgb(153, 153, 153);
  overflow-y: scroll;
}
.apply-button {
  width: 100%;
}
</style>
