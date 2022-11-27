<template>
  <router-view />
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
:root {
  --primary-color: #4e64a0;
  --border-color: #a4a4a4;
}

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

option[value="Choose"] {
  color: gray;
}

input:focus,
input:focus-visible {
  outline: 1px solid var(--primary-color);
}
.input-label {
  font-size: 0.9rem;
  color: var(--primary-color);
  margin: 0.3rem 0;
  text-align: left;
}
button,
button:active {
  background-color: var(--primary-color);
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
  color: var(--primary-color);
  font-weight: 400;
  width: 100%;
  padding: 0.8rem 0;
  margin: 0;
  border-bottom: 1px solid #dadada;
}
</style>
