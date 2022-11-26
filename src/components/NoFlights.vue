<template>
  <div class="no-flights">
    <div class="icon"><FontAwesomeIcon icon="fa-solid fa-exclamation" /></div>
    No flights with the applied filters in the selected date range.
  </div>
</template>
  
<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
</script>

  
<style scoped>
.no-flights {
  display: flex;
  justify-content: center;
  align-items: center;
  color: gray;
}
.icon {
  margin-right: 0.5rem;
  background-color: var(--border-color);
  color: white;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0.2rem;
  box-sizing: border-box;
  border-radius: 4px;
}
</style>
  