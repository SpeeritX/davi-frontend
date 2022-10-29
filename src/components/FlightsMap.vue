<template>
  <div id="flight-map"></div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import flightIconSvg from "../assets/flight-icon.svg";
import "leaflet-rotatedmarker";
//import flightsService from "@/services/flightsService";

export default {
  name: "FlightsMap",
  async mounted() {
    // Fix icons path (leaflet doesn't support webpack by deafult)
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });

    var map = L.map("flight-map", {
      zoomControl: false,
      maxZoom: 11,
      minZoom: 6,
      maxBounds: [
        [54, 41],
        [40, 20],
      ],
      maxBoundsViscosity: 1,
    }).setView([50.45, 30.52], 6);
    const flightIcon = L.icon({
      iconUrl: flightIconSvg,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [-10, -10],
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    const marker = L.marker([50.45, 30.52], { icon: flightIcon, rotationAngle: 145 }).addTo(
      map
    );
  },
};
</script>

<style scoped>
#flight-map {
  width: 100%;
  height: 100%;
}
.icon {
  color: red;
  background-color: aquamarine;
}
</style>
