<template>
  <div class="container">
    <label>{{ label }}</label
    ><input :id="id" :type="type" />
  </div>
</template>

<script>
export default {
  name: "DefaultInput",
  components: {},
  props: {
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
  methods: {},
};
</script>

<style scoped>
input {
  width: 6rem;
}

label {
  margin-right: 0.5rem;
}
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.3rem;
}
</style>
