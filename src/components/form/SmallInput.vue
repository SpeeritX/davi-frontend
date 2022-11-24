<template>
  <div class="container">
    <label>{{ label }}</label
    ><input
      :id="id"
      :type="type"
      @input="inputChange"
      :min="min"
      :max="max"
      :value="value"
    />
  </div>
</template>

<script>
export default {
  name: "DefaultInput",
  components: {},
  emits: ["updateValue"],
  props: {
    value: {
      type: Number,
      required: true,
    },
    min: {
      type: Number,
      required: false,
      default: 0,
    },
    max: {
      type: Number,
      required: false,
      default: 10000000000,
    },
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: false,
      default: "text",
    },
  },
  data() {
    return {};
  },
  mounted() {},
  computed: {},
  methods: {
    inputChange(e) {
      console.log(e.target.value);
      this.$emit("updateValue", e.target.value);
    },
  },
};
</script>

<style scoped>
input {
  width: 5rem;
}

label {
  margin-right: 0.5rem;
  font-size: 0.9rem;
}
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.3rem;
}
</style>
