<template>
  <div>
    <canvas class="matrix-chart" ref="matrixChart"></canvas>
  </div>
</template>

<script setup>
import Chart from "chart.js/auto";
import { ref, onMounted } from "vue";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import zoomPlugin from "chartjs-plugin-zoom";
import matrixService from "@/services/matrixService";

Chart.register(MatrixController, MatrixElement);
Chart.register(zoomPlugin);

const matrixChart = ref(null);
onMounted(async () => {
  const response = await matrixService.getExpectedMatrix({
    date_1: "2022-02-22",
    date_2: "2022-02-22",
    origin_country: "Hungary",
    expected: true,
  });
  const matrixData = response.data;
  const ctx = matrixChart.value.getContext("2d");
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
          (chart.chartArea || {}).width / Object.keys(matrixData).length,
        height: ({ chart }) =>
          (chart.chartArea || {}).height / Object.keys(matrixData).length,
      },
    ],
  };
  console.log(data);
  const options = {
    onClick: (e, e2) => {
      console.log(data.datasets[0].data[e2[0]?.index]);
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
  new Chart(ctx, {
    type: "matrix",
    data: data,
    options: options,
  });
});
</script>

<style scoped>
.matrix-chart {
  aspect-ratio: 1 / 1;
  width: 100%;
}
div {
  height: 100%;
  flex: 1;
}
</style>
