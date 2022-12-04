<template>
  <div id="main-container">
    <FlightsFilters
      id="filters"
      @update-filters="updateFilters"
      @update-shortest-paths="(val) => (this.state.shortestPaths = val)"
      @update-choropleth-map="(val) => (this.state.choroplethMap = val)"
      @update-show-flight-paths="(val) => (this.state.showFlightPaths = val)"
      @update-paths-opacity="(val) => (this.state.pathsOpacity = val)"
    />
    <div id="main-content">
      <div id="flights-container">
        <FlightsMap
          id="flights-map"
          :filters="filtersWithParallelSets"
          :dates="state.dates"
          :region="state.current_region"
          :shortestPaths="state.shortestPaths"
          :showFlightPaths="state.showFlightPaths"
          :choroplethMap="state.choroplethMap"
          :pathsOpacity="state.pathsOpacity"
          :numberOfFlights="numberOfFlights"
          :selectedRegions="
            state.current_region ? state.current_region.split(',') : []
          "
          :hoveredRegions="state.hoveredRegions"
        />
      </div>
      <DateSlider
        id="timeline"
        @update-dates="updateDates"
        :minDate="data.minDate"
        :maxDate="data.maxDate"
        :flightsCount="state.flightsCount"
      />
    </div>
    <div id="sidebar">
      <MatrixChart
        id="matrix"
        :filters="filtersWithParallelSets"
        :dates="state.dates"
        :current_region="state.current_region"
        @update-regions="updateRegions"
        @update-hovered-regions="(val) => (state.hoveredRegions = val)"
      />
      <ParallelSets
        id="parallel"
        :filters="state.filters"
        :dates="state.dates"
        :region="state.current_region"
        @updateFilters="updateParallelSetsFilters"
      />
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
      data: {
        minDate: "2022-02-23",
        maxDate: "2022-06-18",
      },
      state: {
        filters: {},
        parallelSetsFilters: {},
        dates: {
          date_1: "2022-02-23",
          date_2: "2022-02-23",
        },
        current_region: "",
        flightsCount: [],
        shortestPaths: false,
        choroplethMap: true,
        showFlightPaths: true,
        pathsOpacity: 20,
      },
    };
  },
  async mounted() {
    await this.fetchFlightsCount();
  },
  computed: {
    filtersWithParallelSets() {
      return { ...this.state.filters, ...this.state.parallelSetsFilters };
    },
    numberOfFlights() {
      if (this.state.flightsCount.length === 0) return 0;

      const baseDate = new Date(this.data.minDate + " 02:00:00");
      const startIndex = Math.round(
        (new Date(this.state.dates.date_1) - baseDate) / (24 * 3600 * 1000)
      );
      const endIndex = Math.round(
        (new Date(this.state.dates.date_2) - baseDate) / (24 * 3600 * 1000)
      );
      const count = this.state.flightsCount
        .slice(startIndex, endIndex + 1)
        .reduce((a, b) => a + b);
      return count;
    },
  },
  methods: {
    async updateDates(dates) {
      this.state.dates = {
        date_1: dates.minDate,
        date_2: dates.maxDate,
      };
    },
    async updateRegions(regions) {
      this.state.current_region = regions;
      await this.fetchFlightsCount();
    },
    async updateParallelSetsFilters(newFilters) {
      this.state.parallelSetsFilters = {
        ...newFilters,
      };
      await this.fetchFlightsCount();
    },
    async updateFilters(newFilters) {
      this.state.filters = {
        ...newFilters,
      };
      this.state.parallelSetsFilters = {};
      await this.fetchFlightsCount();
    },
    async fetchFlightsCount() {
      const response = await FlightsService.getFlightsCount({
        ...this.filtersWithParallelSets,
        current_region: this.state.current_region,
        date_1: this.data.minDate,
        date_2: this.data.maxDate,
      });
      this.state.flightsCount = response.data.data.flat();
    },
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
  flex: 10 0 0;
  display: flex;
  flex-direction: column;
  padding-top: 0.5rem;
  box-sizing: border-box;
}

#flights-container {
  flex: 10 1 0;
  display: flex;
  flex-direction: row;
}

#filters {
  flex: 2 1 0;
  margin-right: 0.5rem;
}

#flights-map {
  flex: 8 1 0;
}

#timeline {
  flex: 1 1 0;
}

#sidebar {
  height: 100%;
  flex: 8 0 0;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  box-sizing: border-box;
}
#matrix {
  flex: 9 0 0;
}
#parallel {
  flex: 3 0 0;
}
</style>
