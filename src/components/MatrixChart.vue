<template>
  <div class="matrix-container">
    <canvas class="matrix-chart" ref="matrixChart"></canvas>
    <div id="matrix-legend"></div>
  </div>
</template>

<script setup>
import Chart from "chart.js/auto";
import { ref, onMounted, defineProps, defineEmits, watch } from "vue";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import zoomPlugin from "chartjs-plugin-zoom";
import matrixService from "@/services/matrixService";

const midpoint = 0;

Chart.register(MatrixController, MatrixElement);
Chart.register(zoomPlugin);

const props = defineProps({
  filters: Object,
  dates: Object,
  current_region: String,
});
const minValue = ref(0);
const maxValue = ref(0);
const emit = defineEmits(["updateRegions"]);

let chart;

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
      "linear-gradient(to left, #d8b365, #f5f5f5 " + percent + "%, #5ab4ac)";
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
const fillMatrix = async (current_region) => {
  const response = await matrixService.getExpectedMatrix({
    ...props.filters,
    ...props.dates,
    current_region: null,
  });
  const matrixData = response.data;
  maxValue.value = midpoint;
  minValue.value = midpoint;
  const regions = new Set();
  matrixData.data.map(({ x, y, v }) => {
    if (v > maxValue.value) maxValue.value = v;
    if (v < minValue.value) minValue.value = v;
    regions.add(x);
    regions.add(y);
  });
  const data = {
    datasets: [
      {
        label: "Basic matrix",
        data: matrixData.data,
        backgroundColor(context) {
          const value = context.dataset.data[context.dataIndex].v;
          const convert = (val) =>
            Math.floor(
              245 -
                (245 - val) *
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
        width: ({ chart }) => (chart.chartArea || {}).width / regions.size,
        height: ({ chart }) => (chart.chartArea || {}).height / regions.size,
      },
    ],
  };
  return data;
};
onMounted(async () => {
  const ctx = matrixChart.value.getContext("2d");
  const options = {
    onClick: (e, e2) => {
      const item = data.datasets[0].data[e2[0]?.index];
      if (props.current_region === `${item.x},${item.y}`) {
        emit("updateRegions", undefined);
        return;
      }
      console.log(item);
      emit("updateRegions", `${item.x},${item.y}`);
    },
    aspectRatio: 1,
    plugins: {
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
              "Region 1: " + v.x,
              "Region 2: " + v.y,
              "Expected: " + Math.round(v.expected * 100) / 100,
              "Flights: " + (v.absolute ?? 0),
            ];
          },
        },
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "xy",
        },
      },
    },
    scales: {
      x: {
        type: "category",
        display: false,
      },
      y: {
        type: "category",
        display: false,
      },
    },
  };
  const data = await fillMatrix();
  chart = new Chart(ctx, {
    type: "matrix",
    data: data,
    options: options,
    plugins: [htmlLegendPlugin],
  });
});
watch(
  () => [props.filters, props.dates, props.current_region],
  async (next) => {
    const data = await fillMatrix(next[2]);
    chart.data = data;
    chart?.update();
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
  height: 100%;
}
</style>
