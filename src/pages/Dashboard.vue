<template>
  <div id="main-container">
    <FlightsFilters id="filters" @update-filters="updateFilters" />
    <div id="main-content">
      <div id="fligths-container">
        <FlightsMap id="flights-map" :filters="filters" />
      </div>
      <DateSlider
        v-if="flightsCount.length"
        id="timeline"
        @update-dates="updateDates"
        minDate="2022-02-22"
        maxDate="2022-06-18"
        :flightsCount="flightsCount"
      />
    </div>
    <div id="sidebar">
      <MatrixChart id="matrix" :filters="filters" />
      <ParallelSets id="parallel" :filters="filters" />
    </div>
  </div>
</template>
<script>
import MatrixChart from "../components/MatrixChart.vue";
import FlightsFilters from "../components/FlightsFilters.vue";
import FlightsMap from "../components/FlightsMap.vue";
import ParallelSets from "../components/ParallelSets.vue";
import FlightsService from "../services/flightsService";
import DateSlider from "../components/DateSlider.vue";

export default {
  name: "App",
  components: {
    MatrixChart,
    FlightsMap,
    ParallelSets,
    DateSlider,
    FlightsFilters,
  },
  data() {
    return {
      filters: {
        date_1: "2022-02-22",
        date_2: "2022-02-22",
      },
      flightsCount: [],
    };
  },
  methods: {
    async updateDates(dates) {
      this.filters = {
        date_1: dates.minDate,
        date_2: dates.maxDate,
        ...this.filters,
      };
    },
    async fetchFlightsCount() {
      const response = await FlightsService.getFlightsCount();
      this.flightsCount = response.data;
    },
    async updateFilters(newFilters) {
      this.filters = {
        date_1: this.filters.minDate,
        date_2: this.filters.maxDate,
        ...newFilters,
      };
    },
  },
  async mounted() {
    await this.fetchFlightsCount();
  },
};
</script>

<style scoped>
#main-container {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  flex-direction: row;
  overflow: hidden;
}

#main-content {
  height: 100%;
  flex: 6 0 0;
  display: flex;
  flex-direction: column;
}

#fligths-container {
  flex: 10 1 0;
  display: flex;
  flex-direction: row;
}

#filters {
  flex: 1 1 0;
  margin-right: 1rem;
}

#flights-map {
  flex: 8 1 0;
}

#timeline {
  flex: 1 1 0;
}

#sidebar {
  height: 100%;
  flex: 3 0 0;
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
}
#matrix {
  flex: 3 0 0;
}
#parallel {
  flex: 3 0 0;
}
</style>
