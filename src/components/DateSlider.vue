<template>
  <div>
    <MultiRangeSlider
      baseClassName="multi-range-slider-bar-only"
      :min="0"
      :max="maxSliderRange"
      :step="1"
      :minValue="rawMinValue"
      :maxValue="visibleRawMaxValue"
      @input="updateRawValues"
    />
    <div class="timeline-controls">
      <div>
        <label for="minDate">Min Date</label>
        <input type="date" id="minDate" v-model="minDatePicker" />
      </div>
      <div>
        <label for="maxDate">Max Date</label>
        <input type="date" id="maxDate" v-model="maxDatePicker" />
      </div>
      <button @click="emitUpdateDates">Confirm</button>
    </div>
  </div>
</template>
  
  <script>
import MultiRangeSlider from "multi-range-slider-vue";

export default {
  name: "DateSlider",
  components: { MultiRangeSlider },
  props: {
    minDate: {
      type: String,
      required: true,
    },
    maxDate: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      rawMinValue: 0,
      rawMaxValue: 1,
      minDatePicker: "",
      maxDatePicker: "",
    };
  },
  mounted() {
    this.rawMaxValue = 0;
    this.maxDatePicker = this.minDate;
    this.baseDatePicker = this.minDate;
  },
  computed: {
    baseDate() {
      // +2 hours to fix issues with substracting dates with summer and winter time
      return new Date(this.minDate + " 2:00:00");
    },
    maxSliderRange() {
      const value = this.dateStringToRawValue(this.maxDate);
      // We want to see the chart for the chosen day between slider handles
      // So, the right handle is shifted one position to the right
      // Thus, we need to add one to the slider range.
      return value + 1;
    },
    visibleRawMaxValue() {
      return this.rawMaxValue + 1;
    },
  },
  methods: {
    updateRawValues(e) {
      this.rawMinValue = e.minValue;
      // The right handle is shifted 1 position to the right (see maxSliderRange())
      this.rawMaxValue = e.maxValue - 1;
      this.minDatePicker = this.rawValueToDateString(this.rawMinValue);
      this.maxDatePicker = this.rawValueToDateString(this.rawMaxValue);
    },
    rawValueToDateString(value) {
      const newDate = new Date(this.baseDate);
      const days = newDate.getDate() + value;
      newDate.setDate(days);
      const dateString = newDate.toISOString().split("T")[0];
      return dateString;
    },
    dateStringToRawValue(date) {
      const timeDifference = new Date(date) - this.baseDate;
      const days = Math.round(timeDifference / (24 * 3600 * 1000));
      return days;
    },
    emitUpdateDates() {
      this.$emit("updateDates", {
        minDate: this.minDatePicker,
        maxDate: this.maxDatePicker,
      });
    },
  },
  watch: {
    minDatePicker(val) {
      this.rawMinValue = this.dateStringToRawValue(val);
      if (this.rawMaxValue < this.rawMinValue) {
        this.rawMaxValue = this.rawMinValue;
      }
    },
    maxDatePicker(val) {
      this.rawMaxValue = this.dateStringToRawValue(val);
      if (this.rawMinValue > this.rawMaxValue) {
        this.rawMinValue = this.rawMaxValue;
      }
    },
  },
};
</script>
  
  <style>
@import "/node_modules/multi-range-slider-vue/MultiRangeSliderBarOnly.css";

.timeline-controls {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.timeline-controls div,
.timeline-controls button {
  margin-left: 1rem;
}

.timeline-controls input {
  margin-left: 0.3rem;
}

.multi-range-slider-bar-only {
  margin-top: -41px;
  padding: 0;
  margin-bottom: 20px;
}

.multi-range-slider-bar-only .bar {
  height: 40px;
}
.multi-range-slider-bar-only .bar-left,
.multi-range-slider-bar-only .bar-right {
  background-color: transparent;
  border-radius: 0;
}

.multi-range-slider-bar-only .bar-inner {
  background-color: transparent;
  backdrop-filter: brightness(120%) hue-rotate(10deg);
  box-shadow: none;
  border: none;
}

.multi-range-slider-bar-only .thumb::before {
  top: 45px;
  background-color: white;
  margin: -6px;
  width: 12px;
  border-radius: 4px;
  box-shadow: inset 0px 0px 5px gray;
}
</style>
  