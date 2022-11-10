<template>
  <canvas class="matrix-chart" ref="matrixChart"></canvas>
</template>

<script setup>
import { Chart } from "chart.js";
import { ref, onMounted } from "vue";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
Chart.register(MatrixController, MatrixElement);

const matrixChart = ref(null);
onMounted(() => {
  const ctx = matrixChart.value.getContext("2d");
  new Chart(ctx, {
    type: "matrix",
    data: {
      datasets: [
        {
          label: "Basic matrix",
          data: [
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
          ],
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.5)",
          backgroundColor: "rgba(200,200,0,0.3)",
          width: ({ chart }) => (chart.chartArea || {}).width / 2 - 1,
          height: ({ chart }) => (chart.chartArea || {}).height / 2 - 1,
        },
      ],
    },
    options: {
      scales: {
        x: {
          display: false,
          min: 0.5,
          max: 2.5,
          offset: false,
        },
        y: {
          display: false,
          min: 0.5,
          max: 2.5,
        },
      },
    },
  });
});
</script>

<style scoped>
#matrix-chart {
  width: 100%;
  height: 100%;
}
</style>
