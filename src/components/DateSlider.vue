<template>
  <div>
    <MultiRangeSlider
      baseClassName="multi-range-slider-bar-only"
      :min="0"
      :max="100"
      :step="1"
      :minValue="rawMinValue"
      :maxValue="rawMaxValue"
      @input="updateRawValues"
      :range-margin="0"
    />
    <label for="minDate">Min Date</label>
    <input type="date" id="minDate" v-model="minDatePicker" />
    <label for="maxDate">Max Date</label>
    <input type="date" id="maxDate" v-model="maxDatePicker" />
    <button @click="emitUpdateDates">Confirm</button>
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
      baseDate: new Date("2022-02-22"),
      minDatePicker: "2022-02-22",
      maxDatePicker: "2022-02-22",
    };
  },
  mounted() {
    this.rawMaxValue = 0;
  },
  methods: {
    updateRawValues(e) {
      this.rawMinValue = e.minValue;
      this.rawMaxValue = e.maxValue;
      this.minDatePicker = this.rawValueToDateString(this.rawMinValue);
      this.maxDatePicker = this.rawValueToDateString(this.rawMaxValue);
    },
    rawValueToDateString(value) {
      const newDate = new Date(this.baseDate);
      newDate.setDate(newDate.getDate() + value);
      const dateString = newDate.toISOString().split("T")[0];
      return dateString;
    },
    dateStringToRawValue(date) {
      const timeDifference = new Date(date) - this.baseDate;
      const day = Math.floor(timeDifference / (24 * 3600 * 1000));
      return day;
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
</style>
  