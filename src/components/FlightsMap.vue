<template>
  <div>
    <div
      id="flight-map"
      v-bind:style="{
        backgroundColor: loading ? 'transparent' : '#bae5ff',
      }"
    ></div>
    <div class="legend-anchor">
      <div
        class="map-legend-container"
        ref="mapLegendContainer"
        v-bind:style="{
          bottom: `${legendHeight + 2}px`,
        }"
      >
        <MapLegend
          :maxNumberOfFlights="maxRegionValue"
          :showFlightPaths="showFlightPaths"
          :showFlights="showFlights"
          :showShortestPaths="shortestPaths"
          :showChoroplethMap="choroplethMap"
          :numberOfFlights="numberOfFlights"
        />
      </div>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import stateData from "../assets/states.json";
import countryData from "../assets/countries.json";
import updateRegionMap from "../tools/regionMap";
import updateFlightPaths from "../tools/flightPaths";
import setCountryMap from "../tools/countryMap";
import mapService from "../services/mapService";
import MapLegend from "./MapLegend";

export default {
  name: "FlightsMap",
  props: [
    "filters",
    "region",
    "dates",
    "shortestPaths",
    "showFlightPaths",
    "choroplethMap",
    "pathsOpacity",
    "numberOfFlights",
    "selectedRegions",
    "hoveredRegions",
  ],
  components: { MapLegend },
  data() {
    return {
      map: null,
      flightsLayers: null,
      regionLayers: null,
      loading: true,
      maxRegionValue: 0,
      legendHeight: 173,
    };
  },
  async mounted() {
    // Fix icons path (leaflet doesn't support webpack by deafult)
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });

    // Prepare map
    this.map = L.map("flight-map", {
      zoomControl: false,
      maxZoom: 11,
      minZoom: 6,
      maxBounds: [
        [54, 41],
        [41.3, 20.7],
      ],
      maxBoundsViscosity: 1,
    }).setView([50.45, 30.52], 6.3);
    this.map.createPane("flights");
    this.map.getPane("flights").style.zIndex = 998;
    this.map.createPane("regions");
    this.map.getPane("regions").style.zIndex = 900;
    this.map.createPane("countries");
    this.map.getPane("countries").style.zIndex = 910;
    this.flightsLayers = L.layerGroup();
    this.regionLayers = L.layerGroup();
    this.flightsLayers.addTo(this.map);
    this.regionLayers.addTo(this.map);
    setCountryMap(countryData).addTo(this.map);
    await this.updateRegions();
    await this.updateFlights();
    this.loading = false;
  },
  updated() {
    this.calculateLegendHeight();
  },
  watch: {
    async shortestPaths() {
      await this.updateFlights();
    },
    async showFlightPaths() {
      await this.updateFlights();
    },
    async pathsOpacity() {
      await this.updateFlights();
    },
    async filters() {
      await this.updateRegions();
      await this.updateFlights();
    },
    async region() {
      await this.updateRegions();
      await this.updateFlights();
    },
    async dates() {
      await this.updateRegions();
      await this.updateFlights();
    },
    async choroplethMap() {
      await this.updateRegions();
    },
    hoveredRegions(regions, oldRegions) {
      oldRegions?.forEach((region) => {
        this.resetRegionStyle(region);
      });
      regions?.forEach((region) => {
        this.updateRegionStyle(region, {
          color: "red",
          weight: 3,
          dashArray: "",
        });
      });
      this.highlightSelectedRegions(this.selectedRegions);
    },
  },
  computed: {
    showFlights() {
      return this.numberOfFlights < 5000;
    },
  },
  methods: {
    async updateFlights() {
      this.flightsLayers?.clearLayers();
      if (this.showFlights && (this.shortestPaths || this.showFlightPaths)) {
        (
          await updateFlightPaths(
            { ...this.filters, ...this.dates, current_region: this.region },
            this.shortestPaths,
            this.showFlightPaths,
            this.pathsOpacity
          )
        ).addTo(this.flightsLayers);
      }
    },
    async updateRegions() {
      this.loading = true;
      this.regionLayers?.clearLayers();
      const response = await mapService.getFlightPerRegion({
        ...this.filters,
        ...this.dates,
        current_region: this.region,
      });
      const matrixData = response.data;
      this.maxRegionValue = Math.max(
        ...Object.values(Object.values(matrixData))
      );
      (
        await updateRegionMap(
          matrixData,
          this.maxRegionValue,
          stateData,
          this.choroplethMap
        )
      ).addTo(this.regionLayers);
      this.highlightSelectedRegions(this.selectedRegions);
      this.loading = false;
    },
    highlightSelectedRegions(regions) {
      regions?.forEach((region) => {
        this.updateRegionStyle(region, {
          color: "mediumseagreen",
          weight: 3,
          dashArray: "",
        });
      });
    },
    updateRegionStyle(regionName, style) {
      this.regionLayers.eachLayer(function (parentLayer) {
        parentLayer.eachLayer(function (layer) {
          if (layer.id === regionName) {
            layer.setStyle(style);
            layer.bringToFront();
          }
        });
      });
    },
    resetRegionStyle(regionName) {
      this.regionLayers.eachLayer(function (parentLayer) {
        parentLayer.eachLayer(function (layer) {
          if (layer.id === regionName) {
            parentLayer.resetStyle(layer);
          }
        });
      });
    },
    calculateLegendHeight() {
      this.legendHeight = this.$refs.mapLegendContainer.clientHeight;
    },
  },
};
</script>

<style>
#flight-map {
  width: 100%;
  height: 100%;
  border: 1px solid var(--border-color);
}

.legend-anchor {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  height: 0;
}

.map-legend-container {
  padding: 0.8rem;
  height: fit-content;
  width: 12rem;
  position: relative;
  right: -1px;
  background-color: white;
  z-index: 999;
  box-sizing: border-box;
  border-radius: 4px 0 0 0;
  opacity: 0.5;
}
.map-legend-container:hover {
  opacity: 1;
}
</style>
