<template>
  <div class="container">
    <label class="input-label">{{ label }}</label>
    <select :id="id" v-model="value" @input="chooseOption">
      <option disabled selected>Choose</option>
      <option v-for="option in options" v-bind:key="option">
        {{ option }}
      </option>
    </select>
    <div
      v-for="chosenValue in chosenValues"
      v-bind:key="chosenValue"
      class="chosen-value"
    >
      {{ chosenValue }}
      <button @click="() => removeValue(chosenValue)">
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
  emits: ["updateValue"],
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
  methods: {
    removeValue(valueToRemove) {
      this.chosenValues.delete(valueToRemove);
      this.value = "Choose";
      this.emitUpdateValues();
    },
    emitUpdateValues() {
      if (this.chosenValues.size === 0) {
        this.$emit("updateValue", null);
      } else {
        this.$emit("updateValue", Array.from(this.chosenValues).join(","));
      }
    },
  },
  watch: {
    value(val) {
      if (val !== "Choose") {
        this.chosenValues.add(val);
        this.value = "Choose";
        this.emitUpdateValues();
      }
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
}
select {
  width: 100%;
}
.chosen-value {
  font-size: 0.8rem;
  border-radius: 4px;
  margin-top: 0.2rem;
  padding: 0 0 0 0.3rem;
  background-color: white;
  border: 1px solid lightgray;
}
.chosen-value button {
  border: none;
  box-shadow: none;
  background-color: transparent;
  padding: 0.19rem 0.4rem;
}
</style>
