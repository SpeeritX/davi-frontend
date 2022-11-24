<template>
  <div class="movable-selection-container">
    <div
      class="movable-selection"
      v-bind:style="{
        left: `${sliderValue * step}px`,
        width: `${selectionWidth * step}px`,
      }"
      @mousedown="onMousedown"
      @touchstart="onMousedown"
    />
  </div>
</template>

<script>
export default {
  name: "MovableSelection",
  components: {},
  props: {
    max: {
      type: Number,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    selectionWidth: {
      type: Number,
      required: true,
    },
    sliderWidth: {
      type: Number,
      required: false,
    },
  },
  emits: ["updateValue"],
  data() {
    return {
      sliderValue: 0,
      startX: null,
      startValue: null,
    };
  },
  methods: {
    updateValue(value) {
      this.sliderValue = value;
      this.$emit("updateValue", this.sliderValue);
    },
    onMousedown(e) {
      e.preventDefault();
      this.startX = e.clientX;
      this.startValue = this.sliderValue;
      document.addEventListener("mousemove", this.onMousemove);
      document.addEventListener("mouseup", this.onMouseup);
    },
    onMousemove(e) {
      const position = e.clientX - this.startX;
      let newValue = this.startValue + Math.floor(position / this.step);
      newValue = Math.max(newValue, 0);
      newValue = Math.min(newValue, this.max - this.selectionWidth);
      this.updateValue(newValue);
    },
    onMouseup() {
      document.removeEventListener("mousemove", this.onMousemove);
      document.removeEventListener("mouseup", this.onMouseup);
    },
  },
  computed: {
    step() {
      return this.sliderWidth ? this.sliderWidth / this.max : 1;
    },
  },
  watch: {
    value(val) {
      this.sliderValue = val;
    },
  },
};
</script>

<style scoped>
.movable-selection-container {
  position: absolute;
  height: 0;
  width: 0;
}

.movable-selection {
  height: 40px;
  top: -60px;
  position: relative;
}
</style>
