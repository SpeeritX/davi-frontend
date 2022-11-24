<template>
  <div>
    <div id="flight-map"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import stateData from "../assets/states.json";
import countryData from "../assets/countries.json";
import grayscale from "../tools/TileLayer.Grayscale";
import updateRegionMap from "../tools/regionMap";
import updateFlightPaths from "../tools/flightPaths";
import setCountryMap from "../tools/countryMap";

export default {
  name: "FlightsMap",
  props: ["filters"],
  data() {
    return {
      map: null,
      layersToUpdate: null,
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
    this.map.createPane("countries");
    this.map.getPane("countries").style.zIndex = 910;
    this.layersToUpdate = L.layerGroup();
    this.layersToUpdate.addTo(this.map);
    setCountryMap(countryData).addTo(this.map);
    (await updateFlightPaths(this.filters)).addTo(this.layersToUpdate);
    (await updateRegionMap(this.filters, stateData)).addTo(this.layersToUpdate);
  },
  async updated() {
    this.layersToUpdate.clearLayers();
    (await updateFlightPaths(this.filters)).addTo(this.layersToUpdate);
    (await updateRegionMap(this.filters, stateData)).addTo(this.layersToUpdate);
  },
};
</script>

<style scoped>
#flight-map {
  width: 100%;
  height: 100%;
}
</style>
