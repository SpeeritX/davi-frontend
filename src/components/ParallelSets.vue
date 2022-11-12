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
  console.log(response)
  const parallel = response.data.data;
  var trace1 = {
    type: "parcats",
    dimensions: [
      {
        label: "Origin country",
        values: parallel.map((val) => val[0]),
      },
      {
        label: "was in Ukraine",
        values: parallel.map((val) => val[1]),
      },
      {
        label: "altitude group",
        values: parallel.map((val) => val[2]),
      },
    ],
  };
  var data = [trace1];
  Plotly.newPlot("parallel-sets", data);
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
