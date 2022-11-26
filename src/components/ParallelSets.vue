<template>
  <NoFlights v-if="noFlights" class="no-flights"> </NoFlights>
  <div v-else class="parallel-container">
    <div id="parallel-sets"></div>
  </div>
</template>

<script setup>
import Plotly from "plotly.js-dist";
import { onMounted, onUpdated, defineProps, ref } from "vue";
import parallelService from "@/services/parallelService";
import NoFlights from "./NoFlights";

const props = defineProps({
  filters: Object,
  dates: Object,
  region: String,
});

const noFlights = ref(false);

const getData = async () => {
  const response = await parallelService.getParallelSets({
    ...props.filters,
    ...props.dates,
    current_region: props.region,
  });
  const parallel = response.data.data;
  if (parallel.length === 0) {
    noFlights.value = true;
    return;
  } else {
    noFlights.value = false;
  }
  var SPIDim = {
    values: parallel.map((val) => val[2]),
    label: "SPI",
  };

  var squawkDim = {
    values: parallel.map((val) => val[0]),
    label: "Squawk",
  };

  var ukraineDim = {
    values: parallel.map((val) => val[1]),
    label: "Ukraine",
  };

  var color = ukraineDim.values;
  var colorscale = [
    [0, "lightsteelblue"],
    [1, "mediumseagreen"],
  ];

  var trace1 = {
    type: "parcats",
    dimensions: [SPIDim, squawkDim, ukraineDim],
    line: { color: color, colorscale: colorscale },
    hoveron: "color",
    hoverinfo: "count+probability",
    labelfont: { size: 14 },
    arrangement: "freeform",
  };
  var data = [trace1];
  var layout = { margin: { l: 0, r: 0, t: 24, b: 10 } };
  await Plotly.newPlot("parallel-sets", data, layout);
};

onMounted(async () => {
  await getData();
});

onUpdated(async () => {
  await getData();
});
</script>

<style scoped>
#parallel-sets {
  height: 100%;
  width: 100%;
}
.parallel-container {
  height: 100%;
  width: 100%;
}
</style>
