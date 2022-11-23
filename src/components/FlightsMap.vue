<template>
  <div>
    <div id="flight-map"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import stateData from "../assets/states.json";
import grayscale from "../tools/TileLayer.Grayscale";
import setUpRegionMap from "../tools/regionMap";
import updateFlightPaths from "../tools/flightPaths";

export default {
  name: "FlightsMap",
  props: ["flights"],
  data() {
    return {
      map: null,
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
    grayscale(L);
    L.tileLayer
      .grayscale("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        noWrap: true,
        maxBounds: [
          [54, 40],
          [41, 20],
        ],
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      })
      .addTo(this.map);
    this.map.createPane("flights");
    this.map.getPane("flights").style.zIndex = 1000;
    this.map.createPane("regions");
    this.map.getPane("regions").style.zIndex = 900;
  },
  async updated() {
    (await updateFlightPaths(this.flights)).addTo(this.map);
    (await setUpRegionMap(stateData)).addTo(this.map);
  },
};
</script>

<style scoped>
#flight-map {
  width: 100%;
  height: 100%;
}
</style>
