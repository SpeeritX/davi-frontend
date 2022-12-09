<template>
  <div>
    <div class="marker-container">
      <div
        v-if="markerPosX !== null"
        class="marker marker-x"
        v-bind:style="{
          'margin-top': `${marginTop}px`,
          'margin-left': `${marginLeft + 2}px`,
          left: `${markerPosX}px`,
          height: `${markerPosY - 1}px`,
        }"
      ></div>
    </div>
    <div class="marker-container">
      <div
        v-if="markerPosX !== null"
        class="marker marker-x"
        v-bind:style="{
          'margin-top': `${marginTop}px`,
          'margin-left': `${marginLeft + 2}px`,
          top: `${markerPosY + 4}px`,
          left: `${markerPosX}px`,
          height: `${height - markerPosY + 1}px`,
        }"
      ></div>
    </div>
    <div class="marker-container">
      <div
        v-if="markerPosY !== null"
        class="marker marker-y"
        v-bind:style="{
          'margin-top': `${marginTop + 1}px`,
          'margin-left': `${marginLeft}px`,
          top: `${markerPosY}px`,
          width: `${markerPosX - 1}px`,
        }"
      ></div>
    </div>
    <div class="marker-container">
      <div
        v-if="markerPosY !== null"
        class="marker marker-y"
        v-bind:style="{
          'margin-top': `${marginTop + 1}px`,
          'margin-left': `${marginLeft + 5}px`,
          top: `${markerPosY}px`,
          left: `${markerPosX}px`,
          width: `${width - markerPosX}px`,
        }"
      ></div>
    </div>
    <div class="matrix-container">
      <canvas class="matrix-chart" ref="matrixChart"></canvas>
      <div id="matrix-legend"></div>
    </div>
  </div>
</template>

<script setup>
import Chart from "chart.js/auto";
import { ref, onMounted, defineProps, defineEmits, watch, computed } from "vue";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import zoomPlugin from "chartjs-plugin-zoom";
import matrixService from "@/services/matrixService";
import stateInCountry from "../assets/stateInCountry.json";

const midpoint = 0;

Chart.register(MatrixController, MatrixElement);
Chart.register(zoomPlugin);

const props = defineProps({
  filters: Object,
  dates: Object,
  current_region: String,
  hoveredRegions: Array,
});
const minValue = ref(0);
const maxValue = ref(0);
const emit = defineEmits(["updateRegions", "updateHoveredRegions"]);

let chartRef;
const chartSize = ref(null);

const htmlLegendPlugin = {
  id: "matrix-legend",
  afterUpdate() {
    const legendContainer = document.getElementById("matrix-legend");
    legendContainer.innerHTML = "";
    const scale = document.createElement("div");
    scale.style.height = "0.8rem";
    scale.style.flex = "1";
    scale.style.marginInline = "4px";
    const percent =
      (100 * Math.abs(maxValue.value)) / (maxValue.value - minValue.value);
    scale.style.background =
      "linear-gradient(to left, #d8b365, #e1e1e1 " + percent + "%, #5ab4ac)";
    const labelMin = document.createElement("div");
    labelMin.innerHTML = Math.round(minValue.value * 100) / 100;
    const labelMax = document.createElement("div");
    labelMax.innerHTML = Math.round(maxValue.value * 100) / 100;
    legendContainer.appendChild(labelMin);
    legendContainer.appendChild(scale);
    legendContainer.appendChild(labelMax);
  },
};

const matrixChart = ref(null);
const fillMatrix = async (current_region, response) => {
  const matrixData = response.data;
  maxValue.value = midpoint;
  minValue.value = midpoint;
  matrixData.data.map(({ v }) => {
    if (v > maxValue.value) maxValue.value = v;
    if (v < minValue.value) minValue.value = v;
  });
  const data = {
    datasets: [
      {
        label: "Basic matrix",
        data: matrixData.data,
        backgroundColor(context) {
          if (!context.dataset.data[context.dataIndex]) return
          const value = context.dataset.data[context.dataIndex].v;
          const convert = (val) =>
            Math.floor(
              225 -
                (225 - val) *
                  (Math.abs(value - midpoint) /
                    (value > midpoint
                      ? maxValue.value
                      : Math.abs(minValue.value - midpoint)))
            );
          let color;
          if (
            context.dataset.data[context.dataIndex].x +
              "," +
              context.dataset.data[context.dataIndex].y ===
            current_region
          )
            color = "rgb(0,0,0)";
          else if (value > midpoint)
            color = `rgb(${convert(216)},${convert(179)},${convert(101)})`;
          else color = `rgb(${convert(90)},${convert(180)},${convert(172)})`;
          return color;
        },
        borderColor() {
          // const value = context.dataset.data[context.dataIndex].v;
          // const convert = (val) =>
          //   255 - (255 - val) * Math.floor(value / maxVal);
          // let color;
          // if (value > 0)
          //   color = `rgb(${convert(0)},${convert(0)},${convert(0)})`;
          // else color = `rgb(${convert(0)},${convert(0)},${convert(0)})`;
          return "#616161";
        },
        borderWidth: 0,
        width: ({ chart }) =>
          (chart.chartArea || {}).width / Object.keys(stateInCountry).length,
        height: ({ chart }) =>
          (chart.chartArea || {}).height / Object.keys(stateInCountry).length,
      },
    ],
  };
  return data;
};

// Watch size changes
const width = ref(0);
const height = ref(0);
const marginTop = ref(0);
const marginLeft = ref(0);
function updateSize() {
  width.value = chartSize.value.width - 5;
  height.value = chartSize.value.height - 3;
  marginTop.value = chartSize.value.top;
  marginLeft.value = chartSize.value.left;
}

const markerPosX = computed(() => {
  if (props.hoveredRegions.length) {
    const index = countries.value.findIndex(
      (el) => el === props.hoveredRegions[0]
    );
    if (index === -1) return null;
    return cellWidth.value * index;
  } else {
    return null;
  }
});

const markerPosY = computed(() => {
  if (props.hoveredRegions.length) {
    const index = countries.value.findIndex(
      (el) => el === props.hoveredRegions[1]
    );
    if (index === -1) return null;
    return cellHeight.value * index;
  } else {
    return null;
  }
});

const cellWidth = computed(() => {
  if (countries.value.length) return width.value / (countries.value.length - 1);
  return 1;
});

const cellHeight = computed(() => {
  if (countries.value.length)
    return height.value / (countries.value.length - 1);
  return 1;
});

const countries = ref([]);
onMounted(async () => {
  const ctx = matrixChart.value.getContext("2d");
  countries.value = Object.keys(stateInCountry).sort((a, b) => {
    if (stateInCountry[a] < stateInCountry[b]) return -1;
    if (stateInCountry[a] > stateInCountry[b]) return 1;
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
  const options = {
    onClick: (e, e2) => {
      const item = e.chart.data.datasets[0].data[e2[0]?.index];
      if (props.current_region === `${item.x},${item.y}`) {
        emit("updateRegions", undefined);
        return;
      }
      emit("updateRegions", `${item.x},${item.y}`);
    },
    onHover: (e, e2) => {
      const item = e.chart.data.datasets[0].data[e2[0]?.index];
      if (item) {
        emit("updateHoveredRegions", [item.x, item.y]);
      } else {
        emit("updateHoveredRegions", []);
      }
    },
    aspectRatio: 1,
    plugins: {
      title: {
        display: true,
        text: "Daily average difference compared to the whole date range",
      },
      legend: false,
      htmlLegend: {
        containerID: "matrix-legend",
      },
      tooltip: {
        callbacks: {
          title() {
            return "";
          },
          label(context) {
            const v = context.dataset.data[context.dataIndex];
            return [
              "Region 1: " + v.x + ", " + stateInCountry[v.x],
              "Region 2: " + v.y + ", " + stateInCountry[v.y],
              "Expected: " + Math.round(v.expected * 100) / 100,
              "Flights: " + (v.absolute ?? 0),
            ];
          },
        },
      },
      // zoom: {
      //   zoom: {
      //     wheel: {
      //       enabled: true,
      //     },
      //     pinch: {
      //       enabled: true,
      //     },
      //     mode: "xy",
      //   },
      // },
    },
    scales: {
      x: {
        type: "category",
        labels: countries.value,
        grid: {
          color: "#777",
          z: 1000,
          //lineWidth: 1.3,
        },
        ticks: {
          display: true,
          callback: function (value, index) {
            if (
              index >= 1 &&
              stateInCountry[countries.value[index]] ===
                stateInCountry[countries.value[index - 1]]
            )
              return;
            return ""; //stateInCountry[countries.value[index]].substring(0, 2);
          },
        },
      },
      y: {
        type: "category",
        labels: countries.value.slice().reverse(),
        grid: {
          color: "#777",
          z: 1000,
          //lineWidth: 1.3,
        },
        ticks: {
          display: true,
          callback: function (value, index) {
            const reverseCountries = countries.value.slice().reverse();
            if (
              index >= 1 &&
              stateInCountry[reverseCountries[index]] ===
                stateInCountry[reverseCountries[index - 1]]
            )
              return;
            return ""; //stateInCountry[reverseCountries[index]].substring(0, 2);
          },
        },
      },
    },
  };
  const mouseOutPlugin = {
    id: "mouseOutPlugin",
    beforeEvent(chart, args) {
      const event = args.event;
      if (event.type === "mouseout") {
        emit("updateHoveredRegions", []);
      }
    },
  };
  response.value = await matrixService.getExpectedMatrix({
    ...props.filters,
    ...props.dates,
    current_region: null,
  });
  const data = await fillMatrix(props.current_region, response.value);
  chartRef = new Chart(ctx, {
    type: "matrix",
    data: data,
    options: options,
    plugins: [htmlLegendPlugin, mouseOutPlugin],
  });
  chartSize.value = chartRef.chartArea;
  updateSize();
});

const response = ref(null);
watch(
  () => [props.filters, props.dates, props.current_region],
  async (next, prev) => {
    console.log("next");
    console.log(next);
    if (
      JSON.stringify([next[0], next[1]]) !== JSON.stringify([prev[0], prev[1]])
    ) {
      response.value = await matrixService.getExpectedMatrix({
        ...props.filters,
        ...props.dates,
        current_region: null,
      });
    }
    const data = await fillMatrix(next[2], response.value);
    chartRef.data = data;
    await chartRef.update();
    updateSize();
  }
);
</script>

<style scoped>
.matrix-chart {
  aspect-ratio: 1 / 1;
  flex: 1;
  border: 1px var(--border-color) solid;
}
#matrix-legend {
  width: 80%;
  height: 0.8rem;
  display: flex;
  flex-direction: row;
  font-size: 0.8rem;
}
.matrix-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.marker-container {
  position: relative;
  display: flex;
  justify-content: left;
  height: 0;
  width: 100%;
}
.marker {
  position: relative;
  background-color: red;
}
.marker-x {
  width: 1px;
}
.marker-y {
  height: 1px;
}
</style>
