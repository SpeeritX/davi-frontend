<template>
  <div class="filters-container">
    <h2>Filters</h2>
    <div class="filter">
      <p class="input-label">Altitude</p>
      <SmallInput id="velocityMin" label="Min" type="number" />
      <SmallInput id="velocityMax" label="Max" type="number" />
    </div>
    <div class="filter">
      <p class="input-label">Altitude</p>
      <SmallInput id="altitudeMin" label="Min" type="number" />
      <SmallInput id="altitudeMax" label="Max" type="number" />
    </div>
    <DefaultInput id="squawk" label="Squawk" />
    <MultiSelectInput
      id="currentCountry"
      label="Current country"
      :options="data.currentCountryOptions"
    />
    <MultiSelectInput
      id="originCountry"
      label="Country of origin"
      :options="data.originCountryOptions"
    />
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
  methods: {},
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
