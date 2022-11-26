<template>
  <div>
    <div id="flight-map"></div>
    <div class="legend-anchor">
      <div class="map-legend-container">Legend</div>
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

export default {
  name: "FlightsMap",
  props: ["filters", "shortestPaths"],
  data() {
    return {
      map: null,
      flightsLayers: null,
      regionLayers: null,
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
        [54, 40],
        [41, 20],
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
  },
  watch: {
    async shortestPaths() {
      await this.updateFlights();
    },
    async filters() {
      await this.updateRegions();
      await this.updateFlights();
    },
  },
  methods: {
    async updateFlights() {
      this.flightsLayers.clearLayers();
      (await updateFlightPaths(this.filters, this.shortestPaths)).addTo(
        this.flightsLayers
      );
    },
    async updateRegions() {
      this.regionLayers.clearLayers();
      (await updateRegionMap(this.filters, stateData)).addTo(this.regionLayers);
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
  height: 8rem;
  position: relative;
  bottom: 8rem;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 999;
  box-sizing: border-box;
}
.leaflet-container {
  background-color: #bae5ff;
}
</style>
