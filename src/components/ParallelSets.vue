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
    values: parallel.map((val) => val[3]),
    label: "SPI",
  };

  var squawkDim = {
    values: parallel.map((val) => val[4]),
    label: "Squawk",
  };

  var ukraineDim = {
    values: parallel.map((val) => val[5]),
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
  var layout = { margin: { l: 0, r: 0, t: 50, b: 20 } };
  Plotly.newPlot("parallel-sets", data, layout);
};

onMounted(async () => {
  getData();
});
</script>

<style scoped>
#parallel-sets {
  width: 100%;
  height: 100%;
}
</style>
