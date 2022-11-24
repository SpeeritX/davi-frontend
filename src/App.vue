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
}

input:focus,
input:focus-visible {
  outline: 1px solid #4e64a0;
}
.input-label {
  font-size: 1rem;
  color: #4e64a0;
  margin: 0.5rem 0;
  text-align: left;
}
button,
button:active {
  background-color: #4e64a0;
  color: white;
  border-radius: 4px;
  outline: none;
  box-shadow: none;
  border: none;
  padding: 0.3rem 0.4rem;
}
button:hover {
  opacity: 0.95;
  box-shadow: 0 0 3px gray;
  cursor: pointer;
}
button svg {
  color: black;
}
h2 {
  color: #4e64a0;
  font-weight: 400;
  width: 100%;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #dadada;
}
</style>
