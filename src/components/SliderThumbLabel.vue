<template>
  <div class="thumb-label-container">
    <div
      class="thumb-label thumb-label-left"
      v-bind:style="{
        'margin-left': `${position + offsetX}px`,
        top: `${offsetY}px`,
      }"
    >
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  name: "SliderThumbLabel",
  components: {},
  props: {
    position: {
      type: Number,
      required: true,
    },
    offsetX: {
      type: Number,
      required: true,
    },
    offsetY: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.thumb-label-container {
  position: absolute;
  height: 0;
}
.thumb-label {
  position: relative;
  z-index: 10;
  background-color: white;
  box-shadow: 0px 0px 3px black;
  padding: 2px 3px;
  border-radius: 4px;
}
</style>
