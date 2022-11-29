<template>
  <div class="container">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="initValue"
      @input="inputChange"
    />
  </div>
</template>

<script>
export default {
  name: "SliderInput",
  components: {},
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
    initValue: {
      type: Number,
      required: false,
      default: 5,
    },
    min: {
      type: Number,
      required: false,
      default: 5,
    },
    max: {
      type: Number,
      required: false,
      default: 100,
    },
    step: {
      type: Number,
      required: false,
      default: 5,
    },
  },
  methods: {
    inputChange(e) {
      this.$emit("updateValue", e.target.value);
    },
  },
};
</script>

<style scoped>
label {
  font-size: 0.9rem;
  margin-bottom: -0.3rem;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: start;
  margin: 0;
  margin-bottom: 0.4rem;
}
input:focus {
  outline: none;
}
</style>
