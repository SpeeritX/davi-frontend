<template>
  <div id="parallel-sets"></div>
</template>

<script setup>
import Plotly from "plotly.js-dist";
import { onMounted } from "vue";
import parallelService from "@/services/parallelService";

const getData = async () => {
  const response = await parallelService.getParallelSets({
    date_1: "2022-02-22",
    date_2: "2022-02-28",
  });
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
  width: 100%;
  flex: 0.5;
}
</style>