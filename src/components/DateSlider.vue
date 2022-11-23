<template>
  <div>
    <div class="timeline-controls">
      <div>
        <label for="minDate">Min Date</label>
        <input
          type="date"
          id="minDate"
          v-model="minDatePicker"
          :min="minDate"
          :max="maxDate"
        />
      </div>
      <div>
        <label for="maxDate">Max Date</label>
        <input
          type="date"
          id="maxDate"
          v-model="maxDatePicker"
          :min="minDate"
          :max="maxDate"
        />
      </div>
      <button @click="emitUpdateDates">Confirm</button>
    </div>
    <div ref="timelineChartContainer" class="timeline-chart-container">
      <HorizonChart
        :data="flightsCount"
        :height="40"
        :width="width"
      ></HorizonChart>
      <MultiRangeSlider
        baseClassName="multi-range-slider-bar-only"
        :min="0"
        :max="maxSliderRange"
        :step="1"
        :minValue="rawMinValue"
        :maxValue="visibleRawMaxValue"
        @input="updateRawValues"
      />
      <SliderThumbLabel
        :position="leftLabelPosition"
        :offsetX="-5"
        :offsetY="4"
        :text="minDatePicker"
      />
      <SliderThumbLabel
        :position="rightLabelPosition"
        :offsetX="11"
        :offsetY="-17"
        :text="maxDatePicker"
      />

      <MovableSelection
        :max="maxSliderRange"
        :value="rawMinValue"
        :selectionWidth="visibleRawMaxValue - rawMinValue"
        :sliderWidth="width"
        @update-value="moveSlider"
      />
    </div>
  </div>
</template>

<script>
import MultiRangeSlider from "multi-range-slider-vue";
import HorizonChart from "./HorizonChart.vue";
import MovableSelection from "./MovableSelection.vue";
import SliderThumbLabel from "./SliderThumbLabel.vue";

export default {
  name: "DateSlider",
  components: {
    MultiRangeSlider,
    HorizonChart,
    MovableSelection,
    SliderThumbLabel,
  },
  props: {
    minDate: {
      type: String,
      required: true,
    },
    maxDate: {
      type: String,
      required: true,
    },
    flightsCount: {
      type: Array,
      required: true,
    },
  },
  emits: ["updateDates"],
  data() {
    return {
      rawMinValue: 0,
      rawMaxValue: 1,
      minDatePicker: "",
      maxDatePicker: "",
      width: null,
    };
  },
  async mounted() {
    this.minDatePicker = this.maxDatePicker = this.minDate;
    window.addEventListener("resize", () => {
      this.updateWidth();
    });
    this.updateWidth();
  },
  computed: {
    baseDate() {
      // +2 hours to fix issues with subtracting dates with summer and winter time
      return new Date(this.minDate + " 02:00:00");
    },
    maxSliderRange() {
      const value = this.dateStringToRawValue(this.maxDate);
      // We want to see the chart for the chosen day between slider handles
      // So, the right handle is shifted one position to the right
      // Thus, we need to add one to the slider range.
      return value + 1;
    },
    visibleRawMaxValue() {
      // The right handle is shifted by 1 position, so the visible and real value are different
      return this.rawMaxValue + 1;
    },
    rightLabelPosition() {
      return (this.width / this.maxSliderRange) * this.visibleRawMaxValue;
    },
    leftLabelPosition() {
      return (this.width / this.maxSliderRange) * this.rawMinValue;
    },
  },
  methods: {
    updateRawValues(e) {
      this.rawMinValue = e.minValue;
      this.rawMaxValue = e.maxValue - 1; // The right handle is shifted by 1
      this.minDatePicker = this.rawValueToDateString(this.rawMinValue);
      this.maxDatePicker = this.rawValueToDateString(this.rawMaxValue);
    },
    rawValueToDateString(value) {
      const newDate = new Date(this.baseDate);
      newDate.setDate(newDate.getDate() + value);
      return newDate.toISOString().split("T")[0];
    },
    dateStringToRawValue(date) {
      const timeDifference = new Date(date) - this.baseDate;
      return Math.round(timeDifference / (24 * 3600 * 1000));
    },
    emitUpdateDates() {
      this.$emit("updateDates", {
        minDate: this.minDatePicker,
        maxDate: this.maxDatePicker,
      });
    },
    updateWidth() {
      if (this.$refs.timelineChartContainer) {
        this.width = this.$refs.timelineChartContainer.clientWidth;
      }
    },
    moveSlider(position) {
      const shift = position - this.rawMinValue;
      this.rawMinValue = this.rawMinValue + shift;
      this.rawMaxValue = this.rawMaxValue + shift;
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
.timeline-chart-container {
  padding-bottom: 0.1rem;
  margin-bottom: 1rem;
}

.timeline-controls {
  margin: 1rem 0;
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

.timeline-chart-container .thumb-label {
  visibility: hidden;
}

.timeline-chart-container:hover .thumb-label {
  visibility: visible;
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
}

.multi-range-slider-bar-only .bar-left {
  border-radius: 4px 0 0 4px;
}

.multi-range-slider-bar-only .bar-right {
  border-radius: 0 4px 4px 0;
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

.multi-range-slider-bar-only .caption {
  /* Required for Chrome */
  visibility: hidden;
}
</style>
