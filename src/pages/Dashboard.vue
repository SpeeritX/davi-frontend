<template>
  <div id="main-container">
    <div id="main-content">
      <MapDemo />
    </div>
    <div id="sidebar">
      <MatrixChart />
      <ChartDemo id="charts" />
    </div>
  </div>
</template>

<script>
import MapDemo from "../components/MapDemo.vue";
import ChartDemo from "../components/ChartDemo.vue";
import MatrixChart from "../components/MatrixChart.vue";

export default {
  name: "App",
  components: {
    MapDemo,
    ChartDemo,
    MatrixChart,
  },
};
</script>

<style scoped>
#main-container {
  height: calc(100% - 2rem);
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  width: 100%;
  max-width: calc(100% - 2rem);
  padding: 1rem;
  align-items: center;
  flex-direction: row;
}

#main-content {
  height: 100%;
  flex: 3;
}

#sidebar {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
}

#minimap,
#charts {
  flex: 1;
  height: 100%;
}

#charts {
  margin-top: 1rem;
}
</style>
