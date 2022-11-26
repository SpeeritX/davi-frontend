<template>
  <div class="container">
    <input :id="id" type="checkbox" :checked="initValue" @input="inputChange" />
    <label :for="id">{{ label }}</label>
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
    initValue: {
      type: Boolean,
      required: false,
      deafult: false,
    },
  },
  methods: {
    inputChange(e) {
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
  margin-bottom: 0.4rem;
}
</style>
