<template>
  <div class="legend">
    <p class="choropleth-map-header number-of-flights">
      Flights in total: <strong>{{ numberOfFlights }}</strong>
    </p>
    <p v-if="!showFlights" class="warning">
      Too many flights to display flight paths. Try applying filters to reduce
      them.
    </p>
    <div v-if="showFlights && showFlightPaths" class="element element-line">
      <div class="line line-1" />
      <p>Flight path</p>
    </div>
    <div v-if="showFlights && showShortestPaths" class="element element-line">
      <div class="line line-2" />
      <p>
        The shortest connection between the starting and ending points of the
        flight path
      </p>
    </div>
    <div v-if="showChoroplethMap">
      <p class="choropleth-map-header">Number of flights</p>
      <div class="element element-region">
        <div class="region region-1" />
        <p>{{ dataClasses[0].start }} - {{ dataClasses[0].end }}</p>
      </div>
      <div class="element element-region">
        <div class="region region-2" />
        <p>{{ dataClasses[1].start }} - {{ dataClasses[1].end }}</p>
      </div>
      <div class="element element-region">
        <div class="region region-3" />
        <p>{{ dataClasses[2].start }} - {{ dataClasses[2].end }}</p>
      </div>
      <div class="element element-region">
        <div class="region region-4" />
        <p>0</p>
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  name: "MapLegend",
  props: [
    "maxNumberOfFlights",
    "showFlightPaths",
    "showShortestPaths",
    "showChoroplethMap",
    "showFlights",
    "numberOfFlights",
  ],
  computed: {
    dataClasses() {
      return [
        {
          start: Math.floor((this.maxNumberOfFlights * 2) / 3 + 1),
          end: this.maxNumberOfFlights,
        },

        {
          start: Math.floor(this.maxNumberOfFlights / 3 + 1),
          end: Math.floor((this.maxNumberOfFlights * 2) / 3),
        },
        {
          start: 0,
          end: Math.floor(this.maxNumberOfFlights / 3),
        },
      ];
    },
  },
};
</script>
  
<style>
.legend {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: black;
  font-size: 0.8rem;
  text-align: left;
}

.line {
  width: 20px;
  min-width: 20px;
  height: 3px;
  margin-right: 0.5rem;
}
.line-1 {
  background-color: #7c009b;
}
.line-2 {
  background-color: black;
}
.region {
  width: 40px;
  min-width: 40px;
  height: 1rem;
  border: 1px solid white;
  border-bottom: none;
  margin-right: 0.5rem;
}
.element {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.element-line p {
  margin: 0.2rem 0;
}
.choropleth-map-header {
  color: #4a4a4a;
  margin: 0.5rem 0 0.2rem 0;
  font-size: 0.9rem;
}
.element-region p {
  margin: 0;
}
.region-1 {
  background-color: #969696;
}
.region-2 {
  background-color: #bdbdbd;
}
.region-3 {
  background-color: #d9d9d9;
}
.region-4 {
  border-bottom: 1px solid white;

  background-color: #f0f0f0;
}
.warning {
  color: rgb(200, 0, 0);
  font-weight: 600;
}
.number-of-flights {
  margin-top: 0;
  margin-bottom: 0.5rem;
}
</style>
  