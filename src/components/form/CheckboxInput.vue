<template>
  <div class="container">
    <input :id="id" type="checkbox" @input="inputChange" />
    <label>{{ label }}</label>
  </div>
</template>

<script>
export default {
  name: "CheckboxInput",
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
  },
  methods: {
    inputChange(e) {
      console.log(e.currentTarget.checked);
      this.$emit("updateValue", e.currentTarget.checked);
    },
  },
};
</script>

<style scoped>
label {
  margin-left: 0.5rem;
  font-size: 0.9rem;
}
.container {
  display: flex;
  flex-direction: row;
  align-items: start;
  margin: 0;
}
</style>
