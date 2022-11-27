<template>
  <NoFlights v-if="noFlights" class="no-flights"> </NoFlights>
  <div v-else class="parallel-container">
    <div id="parallel-sets"></div>
  </div>
</template>

<script setup>
import Plotly from "plotly.js-dist";
import { onMounted, onUpdated, defineProps, defineEmits, ref } from "vue";
import parallelService from "@/services/parallelService";
import NoFlights from "./NoFlights";

const props = defineProps({
  filters: Object,
  dates: Object,
  region: String,
});

const emit = defineEmits(["updateFilters"]);

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

  var color = new Int8Array(parallel.length);
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
  var gd = document.getElementById("parallel-sets");

  var update_color = function (points_data) {
    console.log(points_data);
    const newFilters = {
      spi: points_data.constraints[0],
      squawk: points_data.constraints[1],
      was_in_ukraine: points_data.constraints[2],
    };
    emit("updateFilters", newFilters);

    var new_color = new Int8Array(parallel.length);
    var selection = [];
    for (var i = 0; i < points_data.points.length; i++) {
      new_color[points_data.points[i].pointNumber] = 1;
      selection.push(points_data.points[i].pointNumber);
    }
    // Update color of selected paths in parallel categories diagram
    Plotly.restyle("parallel-sets", { "line.color": [new_color] }, 0);
  };

  gd.on("plotly_selected", update_color);
  gd.on("plotly_click", update_color);
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
