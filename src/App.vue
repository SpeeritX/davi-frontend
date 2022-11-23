<template>
  <router-view />
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}

input,
select {
  border-radius: 4px;
  padding: 3px;
  box-shadow: none;
  border: 1px solid lightgray;
  background-color: white;
  font-size: 0.9rem;
}

input:focus,
input:focus-visible {
  outline: 1px solid #4e64a0;
}
.input-label {
  font-size: 1rem;
  font-weight: 600;
  color: #4e64a0;
  margin: 0.5rem 0;
  text-align: left;
}
h2 {
  color: #4e64a0;
  width: 100%;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #dadada;
}
</style>
