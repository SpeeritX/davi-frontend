<template>
  <div class="filter">
    <label class="input-label">{{ label }}</label>
    <select :id="id" v-model="value" @input="chooseOption">
      <option disabled selected>Choose</option>
      <option v-for="option in options" v-bind:key="option">
        {{ option }}
      </option>
    </select>
    <div v-for="chosenValue in chosenValues" v-bind:key="chosenValue">
      {{ chosenValue }}
      <button>
        <FontAwesomeIcon icon="fa-solid fa-xmark"></FontAwesomeIcon>
      </button>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "DefaultInput",
  components: { FontAwesomeIcon },
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  data() {
    return { value: "Choose", chosenValues: new Set() };
  },
  mounted() {},
  computed: {},
  methods: {},
  watch: {
    value(val) {
      if (val !== "Choose") {
        this.chosenValues.add(val);
        this.value = "Choose";
      }
    },
  },
};
</script>

<style scoped>
.filter {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  margin: 2rem 0;
}
select {
  width: 100%;
}
</style>
