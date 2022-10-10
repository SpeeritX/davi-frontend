<template>
  <div id="container">
    <MapDemo />
    <ChartDemo />
  </div>
</template>

<script>
import MapDemo from "./components/MapDemo.vue";
import ChartDemo from "./components/ChartDemo.vue";

export default {
  name: "App",
  components: {
    MapDemo,
    ChartDemo,
  },
};
</script>

<style>
#container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  width: 100%;
  max-width: calc(100% - 20rem);
  padding: 0rem 10rem;
  align-items: center;
  flex-direction: column;
}
</style>
