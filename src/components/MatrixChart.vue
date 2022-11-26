<template>
  <div>
    <canvas class="matrix-chart" ref="matrixChart"></canvas>
  </div>
</template>

<script setup>
import Chart from "chart.js/auto";
import { ref, onMounted, defineProps, onUpdated, defineEmits } from "vue";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import zoomPlugin from "chartjs-plugin-zoom";
import matrixService from "@/services/matrixService";

Chart.register(MatrixController, MatrixElement);
Chart.register(zoomPlugin);

const props = defineProps({
  filters: Object,
});
const emit = defineEmits(["updateRegions"]);

let chart;

const matrixChart = ref(null);
const fillMatrix = async () => {
  const response = await matrixService.getExpectedMatrix(props.filters);
  const matrixData = response.data;
  const data = {
    datasets: [
      {
        label: "Basic matrix",
        data: [
          ...Object.entries(matrixData).map(([x, obj]) =>
            Object.entries(obj).map(([y, v]) => ({ x, y, v }))
          ),
        ].flat(),
        backgroundColor(context) {
          const value = context.dataset.data[context.dataIndex].v;
          const alpha = value / 150 + 0;
          return `rgba(200,200,0,${alpha})`;
        },
        borderColor() {
          return `rgba(0,0,0,200)`;
        },
        width: ({ chart }) =>
          (chart.chartArea || {}).width / Object.keys(matrixData).length + 1,
        height: ({ chart }) =>
          (chart.chartArea || {}).height / Object.keys(matrixData).length + 1,
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
      console.log(item);
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
onUpdated(async () => {
  const data = await fillMatrix();
  chart.data = data;
  chart?.update();
});
</script>

<style scoped>
.matrix-chart {
  aspect-ratio: 1 / 1;
  width: 100%;
  border: 1px var(--border-color) solid;
}
</style>
