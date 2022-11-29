<template>
  <NoFlights v-if="noFlights" class="no-flights"> </NoFlights>
  <div v-else class="parallel-container">
    <div v-if="appliedFilters" class="legend-container">
      <div>
        <span class="legend-title">Applied filters</span><br />
        <span v-if="appliedFilters.squawk">
          Squawk: {{ appliedFilters.squawk }} <br
        /></span>
        <span v-if="appliedFilters.spi">
          SPI: {{ appliedFilters.spi }} <br
        /></span>
        <span v-if="appliedFilters.was_in_ukraine">
          Was in Ukraine: {{ appliedFilters.was_in_ukraine }}
        </span>
        <button @click="clearFilters" class="clear-button">Clear</button>
      </div>
    </div>
    <div id="parallel-sets"></div>
  </div>
</template>

<script setup>
import Plotly from "plotly.js-dist";
import { onMounted, watch, defineProps, defineEmits, ref } from "vue";
import parallelService from "@/services/parallelService";
import NoFlights from "./NoFlights";

const props = defineProps({
  filters: Object,
  dates: Object,
  region: String,
});

const emit = defineEmits(["updateFilters"]);

const noFlights = ref(false);
const appliedFilters = ref(null);
const dataLength = ref(0);

const getData = async (filters, dates, region) => {
  const response = await parallelService.getParallelSets({
    ...filters,
    ...dates,
    current_region: region,
  });
  const parallel = response.data.data;
  dataLength.value = parallel.length;
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
    label: "Was in Ukraine",
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
  var layout = { margin: { l: 0, r: 4, t: 40, b: 30 }, autosize: true };
  await Plotly.newPlot("parallel-sets", data, layout);
  var gd = document.getElementById("parallel-sets");

  var update_color = (points_data) => {
    console.log(points_data);
    const newFilters = {
      spi: points_data.constraints[0],
      squawk: points_data.constraints[1],
      was_in_ukraine: points_data.constraints[2],
    };
    appliedFilters.value = newFilters;
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
  await getData(props.filters, props.dates, props.region);
});

watch(
  () => [props.filters, props.dates, props.region],
  async (value) => {
    appliedFilters.value = null;
    console.log(value);
    await getData(value[0], value[1], value[2]);
  }
);

async function clearFilters() {
  appliedFilters.value = null;
  Plotly.restyle(
    "parallel-sets",
    { "line.color": [new Int8Array(dataLength.value)] },
    0
  );
}
</script>

<style scoped>
#parallel-sets {
  height: 100%;
  width: calc(100% - 7.6rem);
}
.parallel-container {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.legend-container {
  margin-top: 2rem;
  padding-left: 0.5rem;
  width: 7.1rem;
  min-height: 2rem;
  text-align: center;
}
.legend-container > div {
  width: 100%;
  text-align: left;
}
.legend-title {
  color: var(--primary-color);
  font-weight: 600;
}
.clear-button {
  margin-top: 0.5rem;
  width: 100%;
}
</style>
