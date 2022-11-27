<template>
  <div>
    <canvas class="matrix-chart" ref="matrixChart"></canvas>
  </div>
</template>

<script setup>
import Chart from "chart.js/auto";
import { ref, onMounted, defineProps, defineEmits, watch } from "vue";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import zoomPlugin from "chartjs-plugin-zoom";
import matrixService from "@/services/matrixService";

Chart.register(MatrixController, MatrixElement);
Chart.register(zoomPlugin);

const props = defineProps({
  filters: Object,
  dates: Object,
  current_region: String,
});
const emit = defineEmits(["updateRegions"]);

let chart;

const matrixChart = ref(null);
const fillMatrix = async () => {
  const response = await matrixService.getExpectedMatrix({
    ...props.filters,
    ...props.dates,
    current_region: null,
  });
  const matrixData = response.data;
  let maxVal = 0;
  let minVal = 0;
  const regions = new Set();
  matrixData.data.map(({ x, y, v }) => {
    if (v > maxVal) maxVal = v;
    if (v < minVal) minVal = v;
    regions.add(x);
    regions.add(y);
  });
  console.log(minVal, maxVal);
  const data = {
    datasets: [
      {
        label: "Basic matrix",
        data: matrixData.data,
        backgroundColor(context) {
          const value = context.dataset.data[context.dataIndex].v;
          const convert = (val) =>
            Math.floor(
              255 -
                (255 - val) *
                  (Math.abs(value) / (value > 0 ? maxVal : Math.abs(minVal)))
            );
          let color;
          if (value > 0)
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
      if (props.current_region) {
        emit("updateRegions", undefined);
        return;
      }
      const item = data.datasets[0].data[e2[0]?.index];
      emit("updateRegions", `${item.x},${item.y}`);
    },
    aspectRatio: 1,
    plugins: {
      legend: false,
      tooltip: {
        callbacks: {
          title() {
            return "";
          },
          label(context) {
            const v = context.dataset.data[context.dataIndex];
            return ["x: " + v.x, "y: " + v.y, "v: " + v.v];
          },
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
  });
});
watch(
  () => [props.filters, props.dates],
  async (next, prev) => {
    if (
      JSON.stringify({
        ...next[0],
        current_region: null,
      }) !==
        JSON.stringify({
          ...prev[0],
          current_region: null,
        }) ||
      next[1] !== prev[1]
    ) {
      const data = await fillMatrix();
      chart.data = data;
      chart?.update();
    }
  }
);
</script>

<style scoped>
.matrix-chart {
  aspect-ratio: 1 / 1;
  width: 100%;
  border: 1px var(--border-color) solid;
}
</style>
