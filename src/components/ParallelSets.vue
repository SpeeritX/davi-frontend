<template>
  <div class="parallel-container">
    <div id="parallel-sets"></div>
  </div>
</template>

<script setup>
import Plotly from "plotly.js-dist";
import { onMounted, defineProps } from "vue";
import parallelService from "@/services/parallelService";

const props = defineProps({
  filters: Object,
});

const getData = async () => {
  const response = await parallelService.getParallelSets(props.filters);
  const parallel = response.data.data;
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
  console.log(typeof ukraineDim.values[0]);
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
  Plotly.newPlot("parallel-sets", data, {}, { responsive: true });
};

onMounted(async () => {
  getData();
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
