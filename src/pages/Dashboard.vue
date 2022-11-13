<template>
  <div id="main-container">
    <div id="main-content">
      <FlightsMap id="main-map" :flights="flights" />
      <DateSlider
        id="timeline"
        @update-dates="updateDates"
        minDate="2022-02-22"
        maxDate="2022-06-18"
      />
    </div>
    <div id="sidebar">
      <MatrixChart />
      <ParallelSets />
    </div>
  </div>
</template>

<script>
import MatrixChart from "../components/MatrixChart.vue";
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
  },
  data() {
    return {
      flights: [],
      minDate: "2022-02-22",
      maxDate: "2022-02-22",
    };
  },
  methods: {
    async updateDates(dates) {
      this.minDate = dates.minDate;
      this.maxDate = dates.maxDate;
      await this.fetchFlights();
    },
    async fetchFlights() {
      const response = await FlightsService.getFlights({
        date_1: this.minDate,
        date_2: this.maxDate,
      });
      this.flights = response.data;
    },
  },
  async mounted() {
    await this.fetchFlights();
  },
};
</script>

<style scoped>
#main-container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 1rem;
  align-items: center;
  flex-direction: row;
}

#main-content {
  height: 100%;
  flex: 2 0 0;
  display: flex;
  flex-direction: column;
}

#main-map {
  flex: 10 1 0;
}

#timeline {
  flex: 1 1 0;
}

#sidebar {
  height: 100%;
  flex: 1 0 0;
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
}
</style>
