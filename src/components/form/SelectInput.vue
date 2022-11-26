<template>
  <div class="container">
    <label class="input-label">{{ label }}</label>
    <select :id="id" v-model="value" @input="chooseOption">
      <option selected value="Choose">Choose</option>
      <option v-for="option in options" v-bind:key="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>
  
  <script>
export default {
  name: "SelectInput",
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
    return { value: "Choose" };
  },
  mounted() {},
  computed: {},
  methods: {},
  watch: {
    value(val) {
      let value = val;
      if (value == "Choose") val = "";
      this.$emit("updateValue", val);
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
</style>
  