<template>
  <div id="app">
    <MapDemo />
  </div>
</template>

<script>
import MapDemo from "./components/MapDemo.vue";

export default {
  name: "App",
  components: {
    MapDemo,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  width: 100%;
  padding: 2rem;
  justify-content: center;
  align-content: center;
}
</style>
