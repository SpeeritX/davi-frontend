<template>
  <div class="filter">
    <label class="input-label">{{ label }}</label>
    <input :id="id" :type="type" />
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
  width: 100%;
}

label {
  margin-right: 0.5rem;
}
.filter {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  margin: 2rem 0;
}
</style>
