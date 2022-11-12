<template>
  <div id="main-container">
    <div id="main-content">
      <FlightsMap :flights="flights" />
    </div>
    <div id="sidebar">
      <CountryMap />
      <ParallelSets />
    </div>
  </div>
</template>

<script>
import FlightsMap from "../components/FlightsMap.vue";
import ParallelSets from "../components/ParallelSets.vue";
import CountryMap from "../components/CountryMap.vue";
import FlightsService from "../services/flightsService";

export default {
  name: "App",
  components: {
    FlightsMap,
    ParallelSets,
    CountryMap,
  },
  data() {
    return {
      flights: [],
      parallelSets: []
    };
  },
  async mounted() {
    const response = await FlightsService.getFlights({
      date_1: "2022-05-27",
      date_2: "2022-05-27",
    });
    this.flights = response.data;
  },
};
</script>

<style scoped>
#main-container {
  height: calc(100% - 2rem);
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  width: 100%;
  max-width: calc(100% - 2rem);
  padding: 1rem;
  align-items: center;
  flex-direction: row;
}

#main-content {
  height: 100%;
  flex: 3;
}

#sidebar {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
}

#minimap,
#charts {
  flex: 1;
  height: 100%;
}

#charts {
  margin-top: 1rem;
}
</style>
