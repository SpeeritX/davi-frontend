<template>
  <div>
    <div id="timeline-chart"></div>
    <DateSlider @update-dates="updateDates" />
  </div>
</template>

<script>
// import d3 from "d3-horizon-chart";
import { select } from "d3-selection";
import DateSlider from "./DateSlider.vue";

export default {
  name: "TimelineChart",
  components: { DateSlider },
  props: {},
  data() {
    return {};
  },
  methods: {
    updateDates(dates) {
      this.$emit("updateDates", dates);
    },
  },

  mounted() {
    var d3 = require("d3-horizon-chart");

    var series = [];
    for (var i = 0, variance = 0; i < 100; i++) {
      variance += (Math.random() - 0.5) / 10;
      series.push(Math.abs(Math.cos(i / 100) + variance));
    }

    var horizonChart = d3
      .horizonChart()
      .height(40)
      .colors([
        "#313695",
        "#4575b4",
        "#74add1",
        "#fdae61",
        "#f46d43",
        "#d73027",
      ]);

    select("#timeline-chart")
      .selectAll(".horizon")
      .data([series])
      .enter()
      .append("div")
      .attr("class", "horizon")
      .each(horizonChart);
  },
};
</script>

<style>
@import "/node_modules/multi-range-slider-vue/MultiRangeSliderBarOnly.css";
.horizon {
  border-top: solid 1px #000;
  border-bottom: solid 1px #000;
  overflow: hidden;
  position: relative;
}

.horizon + .horizon {
  border-top: none;
}

.horizon canvas {
  display: block;
  image-rendering: pixelated;
  background-color: #fee090;
}

.horizon .title,
.horizon .value {
  bottom: 0;
  line-height: 30px;
  margin: 0 6px;
  position: absolute;
  font-family: sans-serif;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  white-space: nowrap;
}

.horizon .title {
  left: 0;
}

.horizon .value {
  right: 0;
}
</style>
