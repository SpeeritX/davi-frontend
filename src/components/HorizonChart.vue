<template>
  <div :id="id" class="horizon-chart-container"></div>
</template>

<script>
import { horizonChart } from "d3-horizon-chart";
import { select } from "d3-selection";

export default {
  name: "HorizonChart",
  components: {},
  props: {
    data: {
      type: Array,
      required: true,
    },
    width: {
      type: Number,
      required: false,
    },
    height: {
      type: Number,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return { chart: null };
  },
  computed: {
    numberOfDataPoints() {
      return this.data.length;
    },
  },
  methods: {
    updateSize(width) {
      if (width) {
        const scale = width / this.numberOfDataPoints + 0.001;
        const leftMargin = Math.floor(
          (width - this.numberOfDataPoints) / 2 - 1
        );
        select(`#${this.id}`)
          .selectAll(".horizon")
          .style("scale", `${scale} 1`)
          .style("margin-left", `${leftMargin}px`);
      }
    },
  },
  mounted() {
    this.chart = horizonChart()
      .height(this.height)
      .colors([
        "#313695",
        "#4575b4",
        "#74add1",
        "#fdae61",
        "#f46d43",
        "#d73027",
      ]);

    select(`#${this.id}`)
      .selectAll(".horizon")
      .data([this.data])
      .enter()
      .append("div")
      .attr("class", "horizon")
      .each(this.chart);
    this.updateSize(this.width);
  },
  watch: {
    width(value) {
      this.updateSize(value);
    },
    async data(value) {
      select(`#${this.id}`).selectAll(".horizon").remove();
      select(`#${this.id}`)
        .selectAll(".horizon")
        .remove()
        .data([value])
        .enter()
        .append("div")
        .attr("class", "horizon")
        .each(this.chart);
      this.updateSize(this.width);
    },
  },
};
</script>

<style>
.horizon-chart-container {
  border: solid 1px var(--border-color);
  overflow: hidden;
}
.horizon {
  overflow: hidden;
  position: relative;
  width: fit-content;
  background-color: #fee090;
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
